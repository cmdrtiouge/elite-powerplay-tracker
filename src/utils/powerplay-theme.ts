import { readFileSync } from "node:fs";
import { join } from "node:path";

type PowerplayTheme = {
    logo: string;
    color: string;
};

function loadPowerSvg(file: string): string {

    const svg = readFileSync(
        join(
            process.cwd(),
            "assets",
            "images",
            "powers",
            file
        ),
        "utf8"
    );

    return svg
        .replace(/^<svg[^>]*>/, "")
        .replace(/<\/svg>\s*$/, "");

}

const POWERPLAY_THEME: Record<string, PowerplayTheme> = {

    "Aisling Duval": {
        logo: loadPowerSvg("aisling-duval.svg"),
        color: "#43b5eb"
    },

    "Archon Delaine": {
        logo: loadPowerSvg("archon-delaine.svg"),
        color: "#ed453c"
    },

    "Arissa Lavigny-Duval": {
        logo: loadPowerSvg("arissa-lavigny-duval.svg"),
        color: "#d082fd"
    },

    "Denton Patreus": {
        logo: loadPowerSvg("denton-patreus.svg"),
        color: "#3fd3d3"
    },

    "Edmund Mahon": {
        logo: loadPowerSvg("edmund-mahon.svg"),
        color: "#5acd57"
    },

    "Felicia Winters": {
        logo: loadPowerSvg("felicia-winters.svg"),
        color: "#e9b61e"
    },

    "Jerome Archer": {
        logo: loadPowerSvg("jerome-archer.svg"),
        color: "#e876eb"
    },

    "Li Yong-Rui": {
        logo: loadPowerSvg("li-yong-rui.svg"),
        color: "#38db9d"
    },

    "Nakato Kaine": {
        logo: loadPowerSvg("nakato-kaine.svg"),
        color: "#a6d950"
    },

    "Pranav Antal": {
        logo: loadPowerSvg("pranav-antal.svg"),
        color: "#d6d758"
    },

    "Yuri Grom": {
        logo: loadPowerSvg("yuri-grom.svg"),
        color: "#ef8435"
    },

    "Zemina Torval": {
        logo: loadPowerSvg("zemina-torval.svg"),
        color: "#7b94f3"
    },

    default: {
        logo: loadPowerSvg("default.svg"),
        color: "#f07b05"
    }

};

export function getPowerplayLogo(power: string): string {

    return (POWERPLAY_THEME[power] ?? POWERPLAY_THEME.default).logo;

}

export function getPowerplayColor(power: string): string {

    return (POWERPLAY_THEME[power] ?? POWERPLAY_THEME.default).color;

}