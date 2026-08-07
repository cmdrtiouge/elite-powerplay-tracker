import { readFileSync } from "node:fs";
import { join } from "node:path";
import { getPowerplayLogo } from "./powerplay-theme";

const fontPath = join(
    process.cwd(),
    "assets",
    "fonts",
    "EUROCAPS.TTF"
);

const fontBase64 = readFileSync(fontPath).toString("base64");

export function createPowerplayImage(
    totalText: string,
    power: string,
    gainedText: string,
    totalColor: string,
    gainedColor: string,
    totalPositionX: number,
    gainedPositionX: number,
    totalFontSize: number,
    gainedFontSize: number,
    totalY: number,
    gainedY: number
): string {

    const powerContent = getPowerplayLogo(power);

    const svg = `
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1054.15 1000.45">

    <style>

    @font-face {
        font-family: "EuroCaps";
        src: url(data:font/ttf;base64,${fontBase64});
    }

    </style>

    <g transform="translate(52.7 20) scale(0.9)">
        ${powerContent}
    </g>

    <text
        x="0"
        y="${totalY}"
        text-anchor="start"
        transform="translate(${totalPositionX},0)"
        font-family="EuroCaps"
        font-size="${totalFontSize}"
        font-weight="bold"
        fill="${totalColor}">
        ${totalText}
    </text>

    <text
        x="0"
        y="${gainedY}"
        text-anchor="start"
        transform="translate(${totalPositionX},0)"
        font-family="EuroCaps"
        font-size="${gainedFontSize}"
        font-weight="bold"
        fill="${gainedColor}">
        ${gainedText}
    </text>

    </svg>
    `;

    return `data:image/svg+xml;charset=utf8,${encodeURIComponent(svg)}`;
}

export function createPowerplayNoDataImage(): string {

    const powerContent = getPowerplayLogo("default");

    const svg = `
<svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1054.15 1000.45">

<style>

@font-face {
    font-family: "EuroCaps";
    src: url(data:font/ttf;base64,${fontBase64});
}

</style>

<g transform="translate(52.7 20) scale(0.9)">
    ${powerContent}
</g>

<text
    x="527"
    y="400"
    text-anchor="middle"
    font-family="EuroCaps"
    font-size="200"
    font-weight="bold"
    fill="#ffffff">
    SIN
</text>

<text
    x="527"
    y="600"
    text-anchor="middle"
    font-family="EuroCaps"
    font-size="200"
    font-weight="bold"
    fill="#ffffff">
    DATOS
</text>

</svg>
`;

    return `data:image/svg+xml;charset=utf8,${encodeURIComponent(svg)}`;
}