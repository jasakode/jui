"use strict";
// Copyright (c) 2024, Jasakode Authors.
// All rights reserved.
// Use of this source code is governed by a BSD 3-Clause
// license that can be found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = run;
const config_1 = require("./core/file/config");
const config_2 = require("./config/config");
const cache_1 = require("./core/cache");
require("./core/builtin/string");
// main function
async function run() {
    const config = await (0, config_1.findConfig)();
    if (!config) {
        throw Error("Please add jui config");
    }
    (0, config_2.put)(config);
    (0, config_2.set)("wd", process.cwd());
    // starting 
    const args = process.argv.slice(2);
    /**
     * CLI Command
     * dev :
     * build :
     * serve :
     */
    if (args.length === 0) {
        throw Error("Please insert command");
    }
    const command = args[0];
    switch (command) {
        case "dev":
            (0, config_2.get)("compiler").map(item => {
                if (item.name === "HTML") {
                    item.compile("pages/index.html");
                }
            });
            break;
        case "build":
            (0, config_2.get)("compiler").map(item => {
                if (item.name === "HTML") {
                    item.compile("pages/index.html");
                }
            });
            const cache = new cache_1.Cache();
            cache.delete();
            break;
        default:
            throw Error("command not found.");
            break;
    }
}
