"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Compiler = void 0;
exports.html = html;
exports.script = script;
const config_1 = require("../../config/config");
const node_path_1 = require("node:path");
const node_fs_1 = require("node:fs");
const webpack_1 = require("webpack");
const jsdom_1 = require("jsdom");
const cache_1 = require("../../core/cache");
const prettier_1 = __importDefault(require("prettier"));
const tailwind_1 = require("@jui/tailwind");
;
;
;
const initialConfig = {
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
;
function html(config) {
    const compiler = new Compiler("HTML", config);
    return compiler;
}
;
function script(config) {
    const compiler = new Compiler("SCRIPT", config);
    return compiler;
}
;
/**
 * Base Compiler
 */
class Compiler {
    constructor(name, config) {
        this._name = name;
        if (config) {
            this._config = { ...initialConfig, ...config };
        }
        ;
    }
    ;
    get name() {
        return this._name;
    }
    ;
    init(source, output) {
        const config = { ...this._config, ...initialConfig };
        if (!config.out) {
            config.out = (0, config_1.get)("out");
        }
        if (!config.root) {
            config.root = (0, config_1.get)("root");
        }
        config.source = {
            name: source.slice(source.lastIndexOf("/") + 1, source.lastIndexOf(".")),
            prefix: source,
            original_name: source.lastIndexOf("/") ? source.slice(source.lastIndexOf("/") + 1) : source
        };
        if (config.source.prefix) {
            config.source.prefix = config.source.prefix.slice(0, config.source.prefix.lastIndexOf("."));
            const slices = config.source.prefix.split("/").filter(Boolean);
            if (slices.length > 0) {
                slices.pop();
            }
            config.source.prefix = slices.join("/");
        }
        if (output) {
            config.output = output;
        }
        else {
            config.output = config.source;
        }
        ;
        return config;
    }
    ;
    exist(source, root) {
        return (0, node_fs_1.existsSync)((0, node_path_1.resolve)((0, config_1.get)("wd"), root, source));
    }
    ;
    async webpack(conf) {
        return new Promise((res, rejects) => {
            const config = {
                entry: {
                    [conf.source.name]: (0, node_path_1.resolve)((0, config_1.get)("wd"), conf.root, conf.source.prefix || "", conf.source.original_name),
                },
                output: {
                    filename: '[name].js',
                    path: (0, node_path_1.resolve)((0, config_1.get)("wd"), conf.out, conf.output.prefix || ""),
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
                        minSize: 30000, // Ukuran minimal untuk split (misalnya 30 KB)
                        maxSize: 200000, // Ukuran maksimal untuk setiap chunk (200 KB)
                        maxAsyncRequests: 5, // Maksimal permintaan async yang diizinkan
                        maxInitialRequests: 3, // Maksimal permintaan sinkron awal
                    },
                },
                mode: 'production',
            };
            (0, webpack_1.webpack)(config, (err, stat) => {
                if (err) {
                    console.log("ERROR", err);
                }
                else if (stat) {
                    const assetsInfo = stat.toJson({ assets: true }).assets || [];
                    const result = assetsInfo.map(asset => ({
                        name: asset.name,
                        ext: asset.name.slice(asset.name.lastIndexOf(".") + 1),
                        path: [conf.output.prefix.trimStartAll("/"), asset.name.trimStartAll("/")].join("/"),
                        full_path: (0, node_path_1.resolve)((0, config_1.get)("wd"), conf.out, conf.output.prefix, asset.name),
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
                }
                ;
            });
        });
    }
    ;
    async markup(config) {
        return new Promise(async (res, reject) => {
            try {
                const jsdom = new jsdom_1.JSDOM((0, node_fs_1.readFileSync)((0, node_path_1.resolve)((0, config_1.get)("wd"), config.root, config.source.prefix || "", config.source.original_name)));
                const document = jsdom.window.document;
                // compile Script
                const scripts = document.querySelectorAll("script");
                for (let i = 0; i < scripts.length; i++) {
                    const script = scripts[i];
                    const scriptCompiler = (0, config_1.get)("compiler").find(com => (com.name === "SCRIPT"));
                    if (script.src && scriptCompiler) {
                        const result = await scriptCompiler.compile(script.src);
                        result.forEach((v, si) => {
                            const sc = document.createElement("script");
                            sc.setAttribute("defer", "true");
                            sc.setAttribute("src", v.path);
                            if (si === result.length - 1) {
                                script.replaceWith(sc); // Replace original script with the last compiled script
                            }
                            else {
                                script.insertAdjacentElement("beforebegin", sc); // Insert before the next script
                            }
                        });
                    }
                }
                ;
                const integrations = (0, config_1.get)("integrations");
                for (let i = 0; i < integrations.length; i++) {
                    const integration = integrations[i];
                    switch (integration) {
                        case "tailwind":
                            const css = new tailwind_1.Tailwind({
                                wd: (0, config_1.get)("wd"),
                                root: (0, config_1.get)("root"),
                                out: (0, config_1.get)("out"),
                                document: document,
                                // tailwind_config: resolve(get("wd"), "tailwind.config.js"),
                                // postcss_config: resolve(get("wd"), "postcss.config.js")
                            });
                            await css.compile();
                            break;
                    }
                    ;
                }
                ;
                const outputpath = (0, node_path_1.resolve)((0, config_1.get)("wd"), config.out, config.output.prefix, config.output.original_name);
                (0, node_fs_1.mkdirSync)(outputpath.slice(0, outputpath.lastIndexOf("/")), { recursive: true });
                const formattedHtml = await prettier_1.default.format(document.documentElement.outerHTML, {
                    parser: 'html',
                    tabWidth: 2, // Ukuran indentasi
                    printWidth: 80, // Lebar maksimum baris
                    useTabs: false, // Menggunakan spasi alih-alih tab
                });
                (0, node_fs_1.writeFileSync)(outputpath, "<!DOCTYPE html>\n" + formattedHtml, "utf-8");
                res([{
                        name: config.output.original_name,
                        ext: config.output.original_name.slice(config.output.original_name.lastIndexOf(".") + 1),
                        path: [config.output.prefix.trimStartAll("/"), config.output.original_name.trimStartAll("/")].join("/"),
                        full_path: (0, node_path_1.resolve)((0, config_1.get)("wd"), config.out, config.output.prefix, config.output.original_name),
                        size: (0, node_fs_1.statSync)(outputpath).size,
                    }]);
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    ;
    async compile(source) {
        const cache = new cache_1.Cache();
        return new Promise(async (resolve, rejects) => {
            const config = this.init(source.trimStartAll("/"));
            const exist = this.exist(source.trimStartAll("/"), config.root);
            if (!exist) {
                throw Error("File not found");
            }
            ;
            switch (this._name) {
                case "HTML":
                    resolve(await this.markup(config));
                    break;
                case "SCRIPT":
                    resolve(await this.webpack(config));
                    break;
            }
            ;
        });
    }
    ;
}
exports.Compiler = Compiler;
;
