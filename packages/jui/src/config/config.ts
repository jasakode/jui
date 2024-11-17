import { Config } from "../../config";
import { Service } from "../plugins/service";
import { Compiler } from "../../src/plugins/compiler";
import { Integrations } from "../../src/integrations";


export interface AppConfig {
    // wd is working directory
    wd: string;
    out: string;
    root: string;
    pages: string;
    static: string;

    service: Service[];
    compiler: Compiler[];
    integrations: Integrations[];
};

const CONFIG : AppConfig = {
    wd: "",
    root: "src",
    out: "dist",
    static: "public",
    pages: "pages",

    service: [],
    compiler: [],
    integrations: [],
};

export function set<K extends keyof AppConfig>(key: K, value: AppConfig[K]) {
    CONFIG[key] = value;
};

export function put(config: Config) {
    if(config.root) CONFIG.root = config.root.trimStartAll("/");
    if(config.out) CONFIG.out = config.out.trimStartAll("/");
    if(config.compiler) CONFIG.compiler = config.compiler;
    if(config.service) CONFIG.service = config.service;
    if(config.integrations) CONFIG.integrations = config.integrations;
};

export function get<K extends keyof AppConfig>(name: K): AppConfig[K] {
    return CONFIG[name];
};

export function all(): AppConfig {
    return CONFIG;
};

const config = { get, set, put, all };
export default config;