export let notes = [
    {
        id: 1,
        title: "Grocery List",
        note: "Milk, eggs, bread, butter, cheese, fruit, rice, oats, yogurt, coffee, tea, tomatoes, onions, spinach, and chicken are on the weekly shopping list. I want to keep the pantry stocked, avoid extra store trips, and make sure I have simple ingredients ready for breakfasts, lunches, and quick dinners during the week.",
        date: "2024-01-15",
    },
    {
        id: 2,
        title: "Meeting Notes",
        note: "The team meeting focused on Q1 goals, project timelines, and the tasks that need to be finished before the next review. We discussed blockers, owner assignments, and the need to keep communication clear so progress stays visible. Everyone agreed to share updates earlier and keep follow-up notes simple and actionable.",
        date: "2024-01-16",
    },
    {
        id: 3,
        title: "Ideas",
        note: "A new app feature could improve mobile optimization by making the layout more adaptive, reducing visual clutter, and surfacing the most important actions first. I also want the experience to feel faster, smoother, and easier to scan, especially when someone is using the app one-handed on a smaller screen.",
        date: "2024-01-17",
    },
    {
        id: 4,
        title: "Reminder",
        note: "Call the dentist to schedule an appointment, confirm the available dates, and ask whether there are any forms or insurance details needed before the visit. I should also check my calendar for a time that will not conflict with work, travel, or other personal tasks so the appointment is easy to keep.",
        date: "2024-01-18",
    },
    {
        id: 5,
        title: "Todo",
        note: "Complete the project documentation, review the code for any missing edge cases, and make sure the final notes are easy for someone else to follow later. I also want to verify that the examples are accurate, the wording is clear, and the instructions match the actual implementation without leaving out important steps.",
        date: "2024-01-19",
    },
    {
        id: 6,
        title: "Workout Plan",
        note: "Plan a balanced workout for the week that includes strength training, light cardio, stretching, and enough rest between harder sessions. I want to stay consistent without overdoing it, so the goal is to build a routine that feels realistic, supports energy levels, and makes it easier to keep showing up each day.",
        date: "2024-01-20",
    },
    {
        id: 7,
        title: "Reading List",
        note: "Finish the current book chapter, write down a few useful ideas, and keep a short list of titles I want to read next. I prefer choosing books that are practical, engaging, and worth revisiting later, so this list helps me remember what to buy, borrow, or download when I have free time.",
        date: "2024-01-21",
    },
    {
        id: 8,
        title: "Travel Prep",
        note: "Prepare for the trip by checking the weather, packing the right clothes, charging devices, and confirming transportation details before leaving. I also need to keep important documents together, set aside any medication or essentials, and make sure I have a simple plan for arrival so the first day goes smoothly.",
        date: "2024-01-22",
    },
    {
        id: 9,
        title: "Project Brainstorm",
        note: "Collect fresh ideas for the next project update, including possible features, visual improvements, and ways to make the app easier to use. I want to note anything that might improve clarity, speed, or engagement, then review the best ideas later and decide which ones are realistic enough to build next.",
        date: "2024-01-23",
    },
    {
        id: 10,
        title: "Weekend Goals",
        note: "Use the weekend to finish small tasks, clean up the workspace, relax a little, and prepare for the week ahead. I want a balance between productivity and rest, so I am focusing on a few specific goals that will make Monday feel less stressful and help me start the week organized.",
        date: "2024-01-24",
    },
];

type Note = {
    id: number;
    title: string;
    note: string;
    date: string;
};

export const deleteNote = (id: number) => {
    notes = notes.filter((note) => note.id !== id);
};

export const updateNote = (id: number, title: string, note: string) => {
    const today = new Date();
    const date = today.toISOString().split("T")[0];

    notes = notes.map((currentNote) => {
        if (currentNote.id !== id) {
            return currentNote;
        }

        return {
            ...currentNote,
            title,
            note,
            date,
        };
    });
};

export const saveNote = (title: string, note: string) => {
    const nextId = notes.reduce((maxId, currentNote) => {
        return currentNote.id > maxId ? currentNote.id : maxId;
    }, 0);

    const today = new Date();
    const date = today.toISOString().split("T")[0];

    const newNote: Note = {
        id: nextId + 1,
        title,
        note,
        date,
    };

    notes = [...notes, newNote];

    return newNote;
};
