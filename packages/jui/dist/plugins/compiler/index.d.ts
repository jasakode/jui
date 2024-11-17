type CompilerName = "HTML" | "SCRIPT";
interface Path {
    name: string;
    original_name: string;
    prefix?: string;
}
export interface Config {
    out?: string;
    root?: string;
    source?: Path | string;
    output?: Path | string;
}
export interface Stats {
    full_path: string;
    path: string;
    name: string;
    ext: string;
    size: number;
}
export declare function html(config?: Config): Compiler;
export declare function script(config?: Config): Compiler;
/**
 * Base Compiler
 */
export declare class Compiler {
    private _name;
    private _config;
    constructor(name: CompilerName, config?: Config);
    get name(): CompilerName;
    private init;
    private exist;
    private webpack;
    private markup;
    compile(source: string): Promise<Stats[]>;
}
export {};
