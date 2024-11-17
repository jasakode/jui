import { resolve } from "node:path";
import { get } from "../../config/config";
import { existsSync, readFileSync, mkdirSync, writeFileSync, unlinkSync } from "node:fs";

interface Item {
    name: string;
    desc: string;
    source_path: {
        path: string;
        name: string;
        prefix: string;
    };
    output_path: {
        path: string;
        name: string;
        prefix: string;
    };
    digist: string;
    create_at: number;
};

export class Cache {
    private PATH : string = resolve(get("wd"), get("out"), "__CHACHE.json")
    constructor () {
        mkdirSync(this.PATH.slice(0, this.PATH.lastIndexOf("/")), { recursive: true });
        if(!existsSync(this.PATH)) {
            writeFileSync(this.PATH, JSON.stringify([]), "utf-8");
        };
    };


    public delete() {
        unlinkSync(this.PATH);
    };
};