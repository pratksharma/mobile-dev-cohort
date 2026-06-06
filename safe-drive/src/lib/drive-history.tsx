import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    createContext,
    type ReactNode,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { type DriveSessionRecord } from "./driving";

const STORAGE_KEY = "safe-drive.history.v1";

type DriveHistoryContextValue = {
    history: DriveSessionRecord[];
    isLoaded: boolean;
    addSession: (record: DriveSessionRecord) => void;
    clearHistory: () => void;
};

const DriveHistoryContext = createContext<DriveHistoryContextValue | null>(
    null,
);

export function DriveHistoryProvider({ children }: { children: ReactNode }) {
    const [history, setHistory] = useState<DriveSessionRecord[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const loadHistory = async () => {
            try {
                const rawHistory = await AsyncStorage.getItem(STORAGE_KEY);

                if (rawHistory) {
                    const parsedHistory = JSON.parse(
                        rawHistory,
                    ) as DriveSessionRecord[];
                    setHistory(
                        Array.isArray(parsedHistory) ? parsedHistory : [],
                    );
                }
            } catch {
                setHistory([]);
            } finally {
                setIsLoaded(true);
            }
        };

        void loadHistory();
    }, []);

    useEffect(() => {
        if (!isLoaded) {
            return;
        }

        void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    }, [history, isLoaded]);

    const value = useMemo<DriveHistoryContextValue>(
        () => ({
            history,
            isLoaded,
            addSession: (record) => {
                setHistory((currentHistory) =>
                    [record, ...currentHistory].slice(0, 50),
                );
            },
            clearHistory: () => {
                setHistory([]);
                void AsyncStorage.removeItem(STORAGE_KEY);
            },
        }),
        [history, isLoaded],
    );

    return (
        <DriveHistoryContext.Provider value={value}>
            {children}
        </DriveHistoryContext.Provider>
    );
}

export function useDriveHistory() {
    const context = useContext(DriveHistoryContext);

    if (!context) {
        throw new Error(
            "useDriveHistory must be used within DriveHistoryProvider",
        );
    }

    return context;
}
