"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cache = void 0;
const node_path_1 = require("node:path");
const config_1 = require("../../config/config");
const node_fs_1 = require("node:fs");
;
class Cache {
    PATH = (0, node_path_1.resolve)((0, config_1.get)("wd"), (0, config_1.get)("out"), "__CHACHE.json");
    constructor() {
        (0, node_fs_1.mkdirSync)(this.PATH.slice(0, this.PATH.lastIndexOf("/")), { recursive: true });
        if (!(0, node_fs_1.existsSync)(this.PATH)) {
            (0, node_fs_1.writeFileSync)(this.PATH, JSON.stringify([]), "utf-8");
        }
        ;
    }
    ;
    delete() {
        (0, node_fs_1.unlinkSync)(this.PATH);
    }
    ;
}
exports.Cache = Cache;
;
