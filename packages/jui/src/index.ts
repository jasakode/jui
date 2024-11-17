// Copyright (c) 2024, Jasakode Authors.
// All rights reserved.
// Use of this source code is governed by a BSD 3-Clause
// license that can be found in the LICENSE file.

import { findConfig } from "./core/file/config";
import { set, get, put, all } from "./config/config";
import { Cache } from "./core/cache"
import "./core/builtin/string";


// main function
export default async function run() {
    const config = await findConfig();
    if(!config) {
        throw Error("Please add jui config");
    }
    put(config);
    set("wd", process.cwd());

    // starting 
    const args = process.argv.slice(2);

    /**
     * CLI Command
     * dev :
     * build :
     * serve :
     */
    if(args.length === 0) {
        throw Error("Please insert command");
    }
    const command = args[0];
    switch (command) {
        case "dev":
            get("compiler").map(item => {
                if(item.name === "HTML") {
                    item.compile("pages/index.html");
                }
            });
            break;
        case "build":
            get("compiler").map(item => {
                if(item.name === "HTML") {
                    item.compile("pages/index.html");
                }
            });
            const cache = new Cache();
            cache.delete();
        break;
        case "version":
            console.log("Jui Version @0.1.0")
            break;
        case "-v":
            console.log("Jui Version @0.1.0")
            break;
        default:
            throw Error("command not found.");
        break;
    }
}

