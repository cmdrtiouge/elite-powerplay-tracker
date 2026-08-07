export type TrackerData = {
    totalMerits: number;
    gainedMerits: number;
};

export class MeritsTracker {

    private resetBaseMerits = 0;
    private hasReset = false;

    update(totalMerits: number): TrackerData {

        return {
            totalMerits,
            gainedMerits: this.hasReset
                ? Math.max(0, totalMerits - this.resetBaseMerits)
                : totalMerits
        };
    }

    reset(totalMerits: number): void {

        this.resetBaseMerits = totalMerits;
        this.hasReset = true;
    }

    getState() {

        return {
            resetBaseMerits: this.resetBaseMerits,
            hasReset: this.hasReset
        };
    }

    restore(resetBaseMerits: number, hasReset: boolean): void {

        this.resetBaseMerits = resetBaseMerits;
        this.hasReset = hasReset;
    }

    clear(): void {

        this.resetBaseMerits = 0;
        this.hasReset = false;

    }
}