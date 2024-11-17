declare global {
    interface String {
        reverse(): string;
        trimStartAll(char: string): string;
        trimEndAll(char: string): string;
    }
}
export {};
