import fs from "fs";
import path from "path";

export type PowerplayData = {
    power: string;
    totalMerits: number;
    meritsGained: number;
};

export function readLatestPowerplayMerits(logFolder: string): PowerplayData | null {

    const files = fs.readdirSync(logFolder)
        .filter(file =>
            file.startsWith("Journal.") &&
            file.endsWith(".log")
        )
        .sort((a, b) => {
            const aTime = fs.statSync(path.join(logFolder, a)).mtimeMs;
            const bTime = fs.statSync(path.join(logFolder, b)).mtimeMs;
            return bTime - aTime;
        });

    if (files.length === 0) {
        return null;
    }

    const latestFile = path.join(logFolder, files[0]);

    const lines = fs.readFileSync(latestFile, "utf8")
        .split("\n")
        .reverse();

    let lastPowerplay: PowerplayData | null = null;

    for (const line of lines) {

        if (!line.includes("Powerplay")) {
            continue;
        }

        try {

            const json = JSON.parse(line);

            if (json.event === "PowerplayMerits") {

                return {
                    power: json.Power,
                    totalMerits: json.TotalMerits,
                    meritsGained: json.MeritsGained
                };
            }

            if (json.event === "Powerplay") {

                lastPowerplay = {
                    power: json.Power,
                    totalMerits: json.Merits,
                    meritsGained: 0
                };
            }

        } catch {
            // Ignorar líneas no válidas
        }
    }

    return lastPowerplay;
}