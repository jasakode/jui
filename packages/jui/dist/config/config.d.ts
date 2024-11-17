import { Config } from "../../config";
import { Service } from "../plugins/service";
import { Compiler } from "../../src/plugins/compiler";
import { Integrations } from "../../src/integrations";
export interface AppConfig {
    wd: string;
    out: string;
    root: string;
    pages: string;
    static: string;
    service: Service[];
    compiler: Compiler[];
    integrations: Integrations[];
}
export declare function set<K extends keyof AppConfig>(key: K, value: AppConfig[K]): void;
export declare function put(config: Config): void;
export declare function get<K extends keyof AppConfig>(name: K): AppConfig[K];
export declare function all(): AppConfig;
declare const config: {
    get: typeof get;
    set: typeof set;
    put: typeof put;
    all: typeof all;
};
export default config;
