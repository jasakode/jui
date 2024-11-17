import { config } from "node:process";
import { all, get } from "../../config/config";
import { resolve } from "node:path"
import { existsSync, mkdirSync, readFileSync, writeFileSync, copyFileSync, statSync } from "node:fs";
import { WebpackError, Configuration, webpack as webpackCompiler } from "webpack";
import { JSDOM } from "jsdom";
import { Cache } from "../../core/cache"
import prettier from 'prettier';
import { Config as TailwindConfig, Tailwind } from "@jui/tailwind";

type CompilerName = "HTML" | "SCRIPT";

interface Path {
    name: string;
    original_name: string;
    prefix?: string;
};

export interface Config {
    out?: string;
    root?: string;
    source?: Path | string;
    output?: Path | string;
};

interface RConfig extends Required<Omit<Config, "source" | "output">> {
    source: Required<Path>;
    output: Required<Path>;
};

const initialConfig: RConfig = {
    out: "",
    root: "",
    source: {
        name: "",
        original_name: "",
        prefix: "",
    },
    output: {
        prefix: "",
        original_name: "",
        name: "",
    },
};

export interface Stats {
    full_path: string;
    path: string;
    name: string;
    ext: string;
    size: number;
};

export function html(config?: Config): Compiler {
    const compiler = new Compiler("HTML", config);
    return compiler;
};

export function script(config?: Config): Compiler {
    const compiler = new Compiler("SCRIPT", config);
    return compiler;
};


/**
 * Base Compiler
 */
export class Compiler {
    declare private _name: CompilerName;
    declare private _config: Required<Config> | undefined;
    constructor (name: CompilerName, config?: Config) {
        this._name = name;
        if(config) {
            this._config = { ...initialConfig, ...config }
        };
    };

    get name(): CompilerName {
        return this._name;
    };

    private init(source: string, output?: Required<Path>): RConfig {
        const config: RConfig = { ...this._config, ...initialConfig };
        if(!config.out) {
            config.out = get("out");
        }
        if(!config.root) {
            config.root = get("root");
        }
        config.source = {
            name: source.slice(source.lastIndexOf("/")+1, source.lastIndexOf(".")),
            prefix: source,
            original_name: source.lastIndexOf("/") ? source.slice(source.lastIndexOf("/")+1) : source
        };
        if(config.source.prefix) {
            config.source.prefix = config.source.prefix.slice(0, config.source.prefix.lastIndexOf("."));
            const slices = config.source.prefix.split("/").filter(Boolean);
            if(slices.length > 0) {
                slices.pop()
            }
            config.source.prefix = slices.join("/")
        }
        if(output) {
            config.output = output;
        } else  {
            config.output = config.source;
        };
        return config;
    };
    private exist(source: string, root: string): boolean {
        return existsSync(resolve(get("wd"), root, source));
    };

    private async webpack(conf: RConfig): Promise<Stats[]> {
        return new Promise<Stats[]>((res, rejects) => {
            const config: Configuration = {
                entry: {
                    [conf.source.name]: resolve(get("wd"), conf.root, conf.source.prefix || "", conf.source.original_name),
                },
                output: {
                    filename: '[name].js',
                    path: resolve(get("wd"), conf.out, conf.output.prefix || ""),
                    // clean: true,
                },
                module: {
                    rules: [
                        {
                            test: /\.(ts|tsx|js|jsx)$/,
                            use: {
                                loader: require.resolve("ts-loader"),
                                options: {
                                    compilerOptions: {
                                        noEmitOnError: true,
                                        strict: true,
                                        target: 'ES6',
                                        module: 'ES6',
                                    },
                                },
                            },
                            exclude: /node_modules/,
                        },
                    ],
                },
                optimization: {
                    splitChunks: {
                        chunks: 'all',
                        minSize: 30000,     // Ukuran minimal untuk split (misalnya 30 KB)
                        maxSize: 200000,    // Ukuran maksimal untuk setiap chunk (200 KB)
                        maxAsyncRequests: 5,  // Maksimal permintaan async yang diizinkan
                        maxInitialRequests: 3, // Maksimal permintaan sinkron awal
                    },
                },
                mode: 'production',
            };
            webpackCompiler(config, (err, stat) => {
                if(err) {
                    console.log("ERROR", err)
                } else if (stat) {
                    const assetsInfo = stat.toJson({ assets: true }).assets || [];
                    const result: Stats[] = assetsInfo.map(asset => ({
                        name: asset.name,
                        ext: asset.name.slice(asset.name.lastIndexOf(".")+1),
                        path: [conf.output.prefix.trimStartAll("/"), asset.name.trimStartAll("/")].join("/"),
                        full_path: resolve(get("wd"), conf.out, conf.output.prefix, asset.name),
                        size: asset.size || 0,
                    }));
                    res(result);
                    // if (stat.hasErrors()) {
                    //     const errors = stat.toJson().errors;
                    //     errors?.forEach(e => {
                    //         console.error(e.message)
                    //     });
                    //   } else if (stat.hasWarnings()) {
                    //     const warnings = stat.toJson().warnings;
                    //     console.warn("Compilation warnings:", warnings);
                    //   } else {
                    //     console.log("Compilation successful!");
                    //   }
                };
            });
        });
    };

    private async markup(config: RConfig): Promise<Stats[]> {
        return new Promise<Stats[]>(async(res, reject) => {
            try {
                const jsdom = new JSDOM(readFileSync(resolve(get("wd"), config.root, config.source.prefix || "", config.source.original_name)));
                const document = jsdom.window.document;
                // compile Script
                const scripts = document.querySelectorAll("script");
                for (let i = 0; i < scripts.length; i++) {
                    const script = scripts[i];
                    const scriptCompiler = get("compiler").find(com => (com.name === "SCRIPT"));
                    if(script.src && scriptCompiler) {
                        const result = await scriptCompiler.compile(script.src);
                        result.forEach((v, si) => {
                            const sc = document.createElement("script");
                            sc.setAttribute("defer", "true");
                            sc.setAttribute("src", v.path);
                            if (si === result.length - 1) {
                                script.replaceWith(sc); // Replace original script with the last compiled script
                            } else {
                                script.insertAdjacentElement("beforebegin", sc); // Insert before the next script
                            }
                        });
                    }
                };
    
        
    
                const integrations = get("integrations");
                for (let i = 0; i < integrations.length; i++) {
                    const integration = integrations[i];
                    switch (integration) {
                        case "tailwind":
                            const css = new Tailwind({
                                wd: get("wd"),
                                root: get("root"),
                                out: get("out"),
                                document: document,
                                // tailwind_config: resolve(get("wd"), "tailwind.config.js"),
                                // postcss_config: resolve(get("wd"), "postcss.config.js")
                            });
                            await css.compile();
                            break;
                    };
                };
    
                const outputpath = resolve(get("wd"), config.out ,config.output.prefix, config.output.original_name);
                mkdirSync(outputpath.slice(0, outputpath.lastIndexOf("/")), { recursive: true });
                const formattedHtml = await prettier.format(document.documentElement.outerHTML, {
                    parser: 'html',
                    tabWidth: 2,        // Ukuran indentasi
                    printWidth: 80,     // Lebar maksimum baris
                    useTabs: false,     // Menggunakan spasi alih-alih tab
                });
                writeFileSync(outputpath, "<!DOCTYPE html>\n" +formattedHtml, "utf-8");
                res([{
                    name: config.output.original_name,
                    ext: config.output.original_name.slice(config.output.original_name.lastIndexOf(".")+1),
                    path: [config.output.prefix.trimStartAll("/"), config.output.original_name.trimStartAll("/")].join("/"),
                    full_path: resolve(get("wd"), config.out, config.output.prefix, config.output.original_name),
                    size: statSync(outputpath).size,
                }])  
            } catch (error) {
                console.error(error)   
            }
        });
    };

    public async compile(source: string): Promise<Stats[]> {
        const cache = new Cache();
        return new Promise<Stats[]>(async(resolve, rejects) => {
            const config = this.init(source.trimStartAll("/"));
            const exist = this.exist(source.trimStartAll("/"), config.root);
            if(!exist) {
                throw Error("File not found");
            };
            switch (this._name) {
                case "HTML":
                    resolve(await this.markup(config));
                break;
                case "SCRIPT":
                    resolve(await this.webpack(config));
                break;
            };
        });
    };
};

