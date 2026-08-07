import path from "path";

const USE_TEST_LOGS = false;

const TEST_FOLDER =
    "C:\\Users\\..........\\logs";

const GAME_FOLDER = path.join(
    process.env.USERPROFILE!,
    "Saved Games",
    "Frontier Developments",
    "Elite Dangerous"
);

export function getJournalFolder(): string {
    return USE_TEST_LOGS
        ? TEST_FOLDER
        : GAME_FOLDER;
}