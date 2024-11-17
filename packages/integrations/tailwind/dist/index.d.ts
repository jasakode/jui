export interface Config {
    wd: string;
    root: string;
    out: string;
    document: Document;
}
export declare class Tailwind {
    private _input;
    private _output;
    private _config;
    private _document;
    constructor(config: Config);
    compile(): Promise<void>;
    private classAll;
}
