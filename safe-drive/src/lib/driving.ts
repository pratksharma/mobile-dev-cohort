export type DriveEventType =
    | "Harsh Braking"
    | "Harsh Acceleration"
    | "Sharp Turn"
    | "Aggressive Steering"
    | "Excessive Device Movement"
    | "Possible Phone Handling";

export type DriveEvent = {
    type: DriveEventType;
    timestamp: number;
    severity: number;
    detail: string;
};

export type SensorSample = {
    timestamp: number;
    accelerometer?: { x: number; y: number; z: number };
    gyroscope?: { x: number; y: number; z: number };
    deviceMotion?: {
        acceleration?: { x: number; y: number; z: number } | null;
        accelerationIncludingGravity?: { x: number; y: number; z: number };
        rotationRate?: { alpha: number; beta: number; gamma: number } | null;
    };
    magnetometer?: { x: number; y: number; z: number };
};

export type DriveSummary = {
    totalEvents: number;
    breakdown: Record<DriveEventType, number>;
    score: number;
    rating: string;
    deductions: number;
};

export type DriveSessionRecord = {
    id: string;
    startedAt: number;
    endedAt: number;
    durationSeconds: number;
    summary: DriveSummary;
    events: DriveEvent[];
};

export const EVENT_RULES: Record<
    DriveEventType,
    { threshold: string; deduction: number; description: string }
> = {
    "Harsh Braking": {
        threshold: "Linear deceleration below -3.6 m/s² on the forward axis",
        deduction: 5,
        description:
            "Strong negative acceleration while the phone is moving forward relative to the car.",
    },
    "Harsh Acceleration": {
        threshold: "Linear acceleration above 3.6 m/s² on the forward axis",
        deduction: 5,
        description:
            "Strong positive acceleration consistent with aggressive launch or speeding up.",
    },
    "Sharp Turn": {
        threshold: "Gyroscope yaw or Device Motion rotation above 2.3 rad/s",
        deduction: 3,
        description:
            "A high rotation burst that usually aligns with a fast corner or lane-change.",
    },
    "Aggressive Steering": {
        threshold: "Combined rotation magnitude above 3.0 rad/s",
        deduction: 4,
        description:
            "Repeated large steering corrections rather than a single cornering event.",
    },
    "Excessive Device Movement": {
        threshold: "Acceleration magnitude above 1.75g",
        deduction: 4,
        description:
            "The device is moving much more than a stable mounted phone should.",
    },
    "Possible Phone Handling": {
        threshold:
            "High rotation with low vehicle acceleration or gravity-cancelled motion",
        deduction: 10,
        description:
            "Likely phone pickup, unlocking, or in-hand movement while the drive is active.",
    },
};

const RATING_STEPS = [
    { min: 95, label: "Excellent" },
    { min: 85, label: "Very Good" },
    { min: 75, label: "Good" },
    { min: 60, label: "Fair" },
    { min: 40, label: "Risky" },
    { min: 0, label: "Unsafe" },
] as const;

export function getSafetyRating(score: number): string {
    return RATING_STEPS.find((step) => score >= step.min)?.label ?? "Unsafe";
}

export function createEmptyBreakdown(): Record<DriveEventType, number> {
    return {
        "Harsh Braking": 0,
        "Harsh Acceleration": 0,
        "Sharp Turn": 0,
        "Aggressive Steering": 0,
        "Excessive Device Movement": 0,
        "Possible Phone Handling": 0,
    };
}

export function getDriveSummary(events: DriveEvent[]): DriveSummary {
    const breakdown = createEmptyBreakdown();

    let deductions = 0;

    events.forEach((event) => {
        breakdown[event.type] += 1;
        deductions += event.severity;
    });

    const score = Math.max(0, 100 - deductions);

    return {
        totalEvents: events.length,
        breakdown,
        score,
        rating: getSafetyRating(score),
        deductions,
    };
}

export function createDriveSessionRecord(args: {
    startedAt: number;
    endedAt: number;
    events: DriveEvent[];
}): DriveSessionRecord {
    const summary = getDriveSummary(args.events);

    return {
        id: `${args.endedAt}-${args.startedAt}-${summary.score}-${args.events.length}`,
        startedAt: args.startedAt,
        endedAt: args.endedAt,
        durationSeconds: Math.max(
            0,
            Math.round((args.endedAt - args.startedAt) / 1000),
        ),
        summary,
        events: args.events,
    };
}

export function formatDuration(totalSeconds: number) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes}m ${seconds.toString().padStart(2, "0")}s`;
}

const toNumber = (value: number | undefined | null) =>
    Number.isFinite(value ?? NaN) ? (value ?? 0) : 0;

const vectorMagnitude = (x: number, y: number, z: number) =>
    Math.sqrt(x * x + y * y + z * z);

type DetectionContext = {
    lastEventAt: Partial<Record<DriveEventType, number>>;
    lastSampleAt: number;
    hasPrimed: boolean;
};

export function detectDrivingEvents(
    sample: SensorSample,
    context: DetectionContext,
): DriveEvent[] {
    const events: DriveEvent[] = [];
    const timestamp = sample.timestamp;

    if (!context.hasPrimed) {
        context.hasPrimed = true;
        context.lastSampleAt = timestamp;
        return events;
    }

    context.lastSampleAt = timestamp;

    const accelerometer = sample.accelerometer;
    const gyroscope = sample.gyroscope;
    const deviceMotion = sample.deviceMotion;

    const accel = deviceMotion?.acceleration ?? accelerometer;
    const accelWithGravity =
        deviceMotion?.accelerationIncludingGravity ?? accelerometer;
    const rotationRate = deviceMotion?.rotationRate;

    const accelX = toNumber(accel?.x);
    const accelY = toNumber(accel?.y);
    const accelZ = toNumber(accel?.z);
    const gravityX = toNumber(accelWithGravity?.x);
    const gravityY = toNumber(accelWithGravity?.y);
    const gravityZ = toNumber(accelWithGravity?.z);
    const gyroX = toNumber(gyroscope?.x ?? rotationRate?.beta);
    const gyroY = toNumber(gyroscope?.y ?? rotationRate?.gamma);
    const gyroZ = toNumber(gyroscope?.z ?? rotationRate?.alpha);

    const linearMagnitude = vectorMagnitude(accelX, accelY, accelZ);
    const gravityMagnitude = vectorMagnitude(gravityX, gravityY, gravityZ);
    const rotationMagnitude = vectorMagnitude(gyroX, gyroY, gyroZ);

    const maybeAdd = (
        type: DriveEventType,
        condition: boolean,
        detail: string,
    ) => {
        const cooldown = type === "Possible Phone Handling" ? 1800 : 900;
        const lastAt = context.lastEventAt[type] ?? 0;

        if (!condition || timestamp - lastAt < cooldown) {
            return;
        }

        context.lastEventAt[type] = timestamp;
        events.push({
            type,
            timestamp,
            severity: EVENT_RULES[type].deduction,
            detail,
        });
    };

    maybeAdd(
        "Harsh Braking",
        accelY < -3.6 || gravityY < -4.0,
        `Forward-axis deceleration reached ${accelY.toFixed(2)} m/s².`,
    );
    maybeAdd(
        "Harsh Acceleration",
        accelY > 3.6 || gravityY > 4.0,
        `Forward-axis acceleration reached ${accelY.toFixed(2)} m/s².`,
    );
    maybeAdd(
        "Sharp Turn",
        Math.abs(gyroZ) > 2.3 || Math.abs(rotationRate?.alpha ?? 0) > 140,
        `Yaw rotation peaked at ${gyroZ.toFixed(2)} rad/s.`,
    );
    maybeAdd(
        "Aggressive Steering",
        rotationMagnitude > 3.0 ||
            Math.abs(gyroX) > 1.9 ||
            Math.abs(gyroY) > 1.9,
        `Rotation magnitude reached ${rotationMagnitude.toFixed(2)} rad/s.`,
    );
    maybeAdd(
        "Excessive Device Movement",
        linearMagnitude > 1.75 || gravityMagnitude > 12.0,
        `Acceleration magnitude reached ${linearMagnitude.toFixed(2)}g-equivalent.`,
    );
    maybeAdd(
        "Possible Phone Handling",
        rotationMagnitude > 4.1 && linearMagnitude < 1.5,
        `High rotation (${rotationMagnitude.toFixed(2)} rad/s) with low vehicle acceleration.`,
    );

    return events;
}
