import {
    measureEuroCapsText
} from "../utils/text-metrics";

const SCREEN_WIDTH = 1054.15;

export class TextScroller {

    // Posición X actual del borde izquierdo del texto.
    public positionX = SCREEN_WIDTH;

    private textWidth = 0;
    private currentText = "";

    private waiting = false;
    private waitStart = 0;
    private lastUpdate = performance.now();

    private speed: number;

    constructor(
        private fontSize: number,
        speed = 500,
        private readonly restartDelayMs = 1000
    ) {
        this.speed = speed;
    }

    setFontSize(fontSize: number): void {

        if (this.fontSize === fontSize) {
            return;
        }

        this.fontSize = fontSize;

        if (this.currentText.length > 0) {

            this.textWidth = measureEuroCapsText(
                this.currentText,
                this.fontSize
            );

        }

    }

    setText(text: string): void {

        if (text === this.currentText) {
            return;
        }

        this.currentText = text;

        this.textWidth = measureEuroCapsText(
            text,
            this.fontSize
        );

        this.positionX = SCREEN_WIDTH;

        this.waiting = false;
        this.lastUpdate = performance.now();

    }

    setSpeed(speed: number): void {

        this.speed = speed;

    }

    update(): void {

        const now = performance.now();
        const deltaTime = (now - this.lastUpdate) / 1000;

        this.lastUpdate = now;

        // Esperando antes de volver a aparecer
        if (this.waiting) {

            if (now - this.waitStart >= this.restartDelayMs) {

                this.positionX = SCREEN_WIDTH;
                this.waiting = false;

            }

            return;

        }

        // Desplazar hacia la izquierda
        this.positionX -= this.speed * deltaTime;

        // ¿Ha desaparecido completamente?
        if (this.positionX + this.textWidth <= 0) {

            this.waiting = true;
            this.waitStart = now;

        }

    }

    reset(): void {

        this.positionX = SCREEN_WIDTH;

        this.textWidth = 0;
        this.currentText = "";

        this.waiting = false;

        this.lastUpdate = performance.now();

    }

}