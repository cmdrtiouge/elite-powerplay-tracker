import {
    action,
    DidReceiveSettingsEvent,
    KeyDownEvent,
    SingletonAction,
    WillAppearEvent
} from "@elgato/streamdeck";

import { readLatestPowerplayMerits } from "../services/powerplay-reader";
import { MeritsTracker } from "../services/merits-tracker";
import { TextScroller } from "../services/text-scroller";
import { getJournalFolder } from "../services/journal-path";
import {
    FONT_SIZE_TOTAL_MERITS,
    FONT_SIZE_GAINED_MERITS,
    SCROLL_SPEED_TOTAL_MERITS,
    SCROLL_SPEED_GAINED_MERITS,
    TOTAL_MERITS_Y,
    GAINED_MERITS_Y
} from "../utils/text-metrics";

import {
    createPowerplayImage,
    createPowerplayNoDataImage
} from "../utils/powerplay-image";

import { getPowerplayColor } from "../utils/powerplay-theme";

@action({
    UUID: "com.cmdr-tiouge.elite-powerplay-tracker.powerplay"
})
export class PowerPlayTracker extends SingletonAction {

    // Temporizadores
    private dataInterval?: ReturnType<typeof setInterval>;
    private animationInterval?: ReturnType<typeof setInterval>;

    // Servicios
    private readonly tracker = new MeritsTracker();

    // Control del desplazamiento de los textos
    private readonly totalScroller = new TextScroller(
        FONT_SIZE_TOTAL_MERITS,
        SCROLL_SPEED_TOTAL_MERITS
    );

    private readonly gainedScroller = new TextScroller(
        FONT_SIZE_GAINED_MERITS,
        SCROLL_SPEED_GAINED_MERITS
    );

    // Valores mostrados actualmente
    private currentTotal = 0;
    private currentGained = 0;

    private currentTotalText = "";
    private currentGainedText = "";

    private currentPower = "default";

    private totalFontSize = FONT_SIZE_TOTAL_MERITS;
    private gainedFontSize = FONT_SIZE_GAINED_MERITS;

    private totalSpeed = SCROLL_SPEED_TOTAL_MERITS;
    private gainedSpeed = SCROLL_SPEED_GAINED_MERITS;

    private totalY = TOTAL_MERITS_Y;
    private gainedY = GAINED_MERITS_Y;

    private totalUsePowerColor = true;
    private gainedUsePowerColor = true;

    private totalColor = "#ffffff";
    private gainedColor = "#f07b05";

    // Indica si existe información válida en el Journal
    private hasData = false;

    override async onDidReceiveSettings(
        ev: DidReceiveSettingsEvent
    ): Promise<void> {

        const settings = ev.payload.settings as {
            totalFontSize?: number;
            gainedFontSize?: number;

            totalSpeed?: number;
            gainedSpeed?: number;

            totalY?: number;
            gainedY?: number;

            totalUsePowerColor?: boolean;
            gainedUsePowerColor?: boolean;

            totalColor?: string;
            gainedColor?: string;
        };

        this.totalFontSize = this.normalizeFontSize(
            settings.totalFontSize,
            FONT_SIZE_TOTAL_MERITS
        );

        this.gainedFontSize = this.normalizeFontSize(
            settings.gainedFontSize,
            FONT_SIZE_GAINED_MERITS
        );

        this.totalSpeed = this.normalizeNumber(
            settings.totalSpeed,
            SCROLL_SPEED_TOTAL_MERITS,
            20,
            1000
        );

        this.gainedSpeed = this.normalizeNumber(
            settings.gainedSpeed,
            SCROLL_SPEED_GAINED_MERITS,
            20,
            1000
        );

        this.totalY = this.normalizeNumber(
            settings.totalY,
            TOTAL_MERITS_Y,
            0,
            1024
        );

        this.gainedY = this.normalizeNumber(
            settings.gainedY,
            GAINED_MERITS_Y,
            0,
            1024
        );

        this.totalUsePowerColor =
            settings.totalUsePowerColor ?? false;

        this.gainedUsePowerColor =
            settings.gainedUsePowerColor ?? false;

        this.totalColor =
            settings.totalColor ?? "#ffffff";

        this.gainedColor =
            settings.gainedColor ?? "#f07b05";

        this.totalScroller.setFontSize(this.totalFontSize);
        this.gainedScroller.setFontSize(this.gainedFontSize);
        this.totalScroller.setSpeed(this.totalSpeed);
        this.gainedScroller.setSpeed(this.gainedSpeed);

        await ev.action.setSettings(this.getSettings());

        const totalColor =
            this.totalUsePowerColor
                ? getPowerplayColor(this.currentPower)
                : this.totalColor;

        const gainedColor =
            this.gainedUsePowerColor
                ? getPowerplayColor(this.currentPower)
                : this.gainedColor;

        await ev.action.setImage(
            createPowerplayImage(
                this.currentTotalText,
                this.currentPower,
                this.currentGainedText,

                totalColor,
                gainedColor,

                this.totalScroller.positionX,
                this.gainedScroller.positionX,

                this.totalFontSize,
                this.gainedFontSize,

                this.totalY,
                this.gainedY
            )
        );

    }

    override async onWillAppear(ev: WillAppearEvent): Promise<void> {

        this.stopTimers();

        await this.restoreState(ev);

        await this.updateDisplay(ev.action);

        // Actualiza los datos del Journal cada 2 segundos.
        this.dataInterval = setInterval(() => {
            this.updateDisplay(ev.action);
        }, 2000);

        // Actualiza la animación de desplazamiento de los textos.
        this.animationInterval = setInterval(async () => {

            if (!this.hasData) {
                return;
            }

            this.totalScroller.update();
            this.gainedScroller.update();

            const totalColor =
                this.totalUsePowerColor
                    ? getPowerplayColor(this.currentPower)
                    : this.totalColor;

            const gainedColor =
                this.gainedUsePowerColor
                    ? getPowerplayColor(this.currentPower)
                    : this.gainedColor;

            await ev.action.setImage(
                createPowerplayImage(
                    this.currentTotalText,
                    this.currentPower,
                    this.currentGainedText,

                    totalColor,
                    gainedColor,

                    this.totalScroller.positionX,
                    this.gainedScroller.positionX,

                    this.totalFontSize,
                    this.gainedFontSize,

                    this.totalY,
                    this.gainedY
                )
            );

        }, 60);
    }

    override async onWillDisappear(): Promise<void> {
    this.stopTimers();
}

    override async onKeyDown(ev: KeyDownEvent): Promise<void> {

        const data = readLatestPowerplayMerits(getJournalFolder());

        if (!data) {
            await ev.action.setImage(createPowerplayNoDataImage());
            return;
        }

        // El total actual pasa a ser la nueva referencia del contador.
        this.tracker.reset(data.totalMerits);

        await ev.action.setSettings(this.getSettings());

        await this.updateDisplay(ev.action);
    }

    /**
     * Lee el Journal y actualiza los valores
     * mostrados en la tecla.
     */
    private async updateDisplay(action: any): Promise<void> {

        const data = readLatestPowerplayMerits(getJournalFolder());

        if (!data) {
            await this.clearDisplay(action);
            return;
        }

        this.hasData = true;

        this.currentPower = data.power;

        const totalColor =
            this.totalUsePowerColor
                ? getPowerplayColor(this.currentPower)
                : this.totalColor;

        const gainedColor =
            this.gainedUsePowerColor
                ? getPowerplayColor(this.currentPower)
                : this.gainedColor;

        const result = this.tracker.update(data.totalMerits);

        this.currentTotal = result.totalMerits;
        this.currentGained = result.gainedMerits;

        this.currentTotalText = this.currentTotal
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ".");

        this.currentGainedText = this.currentGained
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ".");

        this.totalScroller.setText(this.currentTotalText);
        this.gainedScroller.setText(this.currentGainedText);
        await action.setSettings(this.getSettings());
    }

    /**
     * Restaura la referencia del último reset
     * almacenada en la configuración del plugin.
     */
    private async restoreState(ev: WillAppearEvent): Promise<void> {

        const settings = await ev.action.getSettings();

        const state = settings as {
            resetBaseMerits?: number;
            hasReset?: boolean;

            totalFontSize?: number;
            gainedFontSize?: number;

            totalSpeed?: number;
            gainedSpeed?: number;

            totalY?: number;
            gainedY?: number;

            totalUsePowerColor?: boolean;
            gainedUsePowerColor?: boolean;

            totalColor?: string;
            gainedColor?: string;
        };

        if (
            state.resetBaseMerits === undefined ||
            state.hasReset === undefined
        ) {
            return;
        }

        this.tracker.restore(
            state.resetBaseMerits,
            state.hasReset
        );

        this.totalFontSize =
            state.totalFontSize ?? FONT_SIZE_TOTAL_MERITS;

        this.gainedFontSize =
            state.gainedFontSize ?? FONT_SIZE_GAINED_MERITS;

        this.totalSpeed =
            state.totalSpeed ?? SCROLL_SPEED_TOTAL_MERITS;

        this.gainedSpeed =
            state.gainedSpeed ?? SCROLL_SPEED_GAINED_MERITS;

        this.totalY =
            state.totalY ?? TOTAL_MERITS_Y;

        this.gainedY =
            state.gainedY ?? GAINED_MERITS_Y;

        this.totalUsePowerColor =
            state.totalUsePowerColor ?? true;

        this.gainedUsePowerColor =
            state.gainedUsePowerColor ?? true;

        this.totalColor =
            state.totalColor ?? "#ffffff";

        this.gainedColor =
            state.gainedColor ?? "#f07b05";

        this.totalScroller.setSpeed(this.totalSpeed);
        this.gainedScroller.setSpeed(this.gainedSpeed);

        this.totalScroller.setFontSize(this.totalFontSize);
        this.gainedScroller.setFontSize(this.gainedFontSize);
    }

    private getSettings() {

        return {

            ...this.tracker.getState(),

            totalFontSize: this.totalFontSize,
            gainedFontSize: this.gainedFontSize,

            totalSpeed: this.totalSpeed,
            gainedSpeed: this.gainedSpeed,

            totalY: this.totalY,
            gainedY: this.gainedY,

            totalUsePowerColor: this.totalUsePowerColor,
            gainedUsePowerColor: this.gainedUsePowerColor,

            totalColor: this.totalColor,
            gainedColor: this.gainedColor

        };

    }

    private normalizeFontSize(
        value: unknown,
        defaultValue: number
    ): number {

        const size = Number(value);

        if (!Number.isFinite(size)) {
            return defaultValue;
        }

        return Math.max(50, Math.min(size, 500));

    }

    private normalizeNumber(
        value: unknown,
        defaultValue: number,
        min: number,
        max: number
    ): number {

        const number = Number(value);

        if (!Number.isFinite(number)) {
            return defaultValue;
        }

        return Math.max(min, Math.min(number, max));

    }

    /**
     * Limpia el estado interno cuando no hay
     * información disponible en el Journal.
     */
    private async clearDisplay(action: any): Promise<void> {

        this.hasData = false;

        this.currentTotal = 0;
        this.currentGained = 0;

        this.totalScroller.reset();
        this.gainedScroller.reset();

        this.tracker.clear();

        await action.setSettings(this.getSettings());

        await action.setImage(createPowerplayNoDataImage());
    }

    /**
     * Detiene los temporizadores activos antes
     * de crear unos nuevos.
     */
    private stopTimers(): void {

        if (this.dataInterval) {
            clearInterval(this.dataInterval);
        }

        if (this.animationInterval) {
            clearInterval(this.animationInterval);
        }
    }
}