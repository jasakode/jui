type ServiceName = "unix" | "http";
export interface Config {
}
export declare class Service {
    private _name;
    constructor(name: ServiceName);
}
export declare function http(config?: Config): void;
export declare function unix(config?: Config): void;
export {};
