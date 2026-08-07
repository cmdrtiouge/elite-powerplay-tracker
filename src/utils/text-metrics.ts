const ADVANCE_WIDTHS: Record<string, number> = {
    "0": 1152,
    "1": 1150,
    "2": 1074,
    "3": 1112,
    "4": 1114,
    "5": 1116,
    "6": 1122,
    "7": 1069,
    "8": 1112,
    "9": 1118,
    ".": 431
};

export const FONT_SIZE_TOTAL_MERITS = 250;
export const FONT_SIZE_GAINED_MERITS = 250;

export const SCROLL_SPEED_TOTAL_MERITS = 500;
export const SCROLL_SPEED_GAINED_MERITS = 500;

export const TOTAL_MERITS_Y = 400;
export const GAINED_MERITS_Y = 800;

export const UNITS_PER_EM = 2048;
export const STREAMDECK_SVG_SCALE = 1.18;

/**
 * Calcula el ancho real de un texto utilizando
 * los advanceWidth de la fuente EuroCaps.
 */
export function measureEuroCapsText(
    text: string,
    fontSize: number
): number {

    let width = 0;

    for (const char of text) {

        const advance = ADVANCE_WIDTHS[char] ?? 0;

        width += (advance * fontSize / UNITS_PER_EM) *
    STREAMDECK_SVG_SCALE;
    }

    return width;
}
