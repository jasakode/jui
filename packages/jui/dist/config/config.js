"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.set = set;
exports.put = put;
exports.get = get;
exports.all = all;
;
const CONFIG = {
    wd: "",
    root: "src",
    out: "dist",
    static: "public",
    pages: "pages",
    service: [],
    compiler: [],
    integrations: [],
};
function set(key, value) {
    CONFIG[key] = value;
}
;
function put(config) {
    if (config.root)
        CONFIG.root = config.root.trimStartAll("/");
    if (config.out)
        CONFIG.out = config.out.trimStartAll("/");
    if (config.compiler)
        CONFIG.compiler = config.compiler;
    if (config.service)
        CONFIG.service = config.service;
    if (config.integrations)
        CONFIG.integrations = config.integrations;
}
;
function get(name) {
    return CONFIG[name];
}
;
function all() {
    return CONFIG;
}
;
const config = { get, set, put, all };
exports.default = config;
