"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tailwind = void 0;
const postcss_1 = __importDefault(require("postcss"));
const tailwindcss_1 = __importDefault(require("tailwindcss"));
const autoprefixer_1 = __importDefault(require("autoprefixer"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
async function compileTailwindCSS(inputFile, outputFile, config) {
    return new Promise(async (resolve, reject) => {
        try {
            // Membaca isi file input CSS yang berisi direktif Tailwind
            const css = fs_1.default.readFileSync(inputFile, 'utf-8');
            // // Memproses CSS menggunakan PostCSS dengan plugin Tailwind dan Autoprefixer
            // const result = await postcss([tailwindcss(), autoprefixer()])
            //   .process(css, { from: inputFile, to: outputFile });
            const result = await (0, postcss_1.default)([(0, tailwindcss_1.default)(config), (0, autoprefixer_1.default)()])
                .process(css, { from: inputFile, to: outputFile });
            // Menyimpan hasil kompilasi ke file output
            fs_1.default.writeFileSync(outputFile, result.css);
            // Jika ada peta sumber, simpan juga
            if (result.map) {
                fs_1.default.writeFileSync(outputFile + '.map', result.map.toString());
            }
            resolve(outputFile);
        }
        catch (error) {
            console.error('Terjadi kesalahan saat mengkompilasi CSS:', error);
        }
    });
}
;
class Tailwind {
    constructor(config) {
        const input = path_1.default.join(__dirname, '../src/base.css');
        const output = path_1.default.resolve(__dirname, config.wd, config.out, "style.css");
        this._input = input;
        this._output = output;
        this._config = config;
    }
    ;
    async compile() {
        const styles = await compileTailwindCSS(this._input, this._output, { content: [{ raw: this.classAll(this._config.document).join(" ") }] });
        const link = this._config.document.createElement("link");
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("href", "/index.css");
        this._config.document.head.appendChild(link);
    }
    ;
    classAll(document) {
        // Ambil semua elemen dalam dokumen
        const allElements = document.querySelectorAll('*');
        // Gunakan Set untuk menghindari duplikasi kelas
        const allClasses = new Set();
        // Loop melalui semua elemen dan ambil kelasnya
        allElements.forEach((element) => {
            element.classList.forEach((cls) => {
                allClasses.add(cls); // Menambahkan kelas ke dalam Set
            });
        });
        // Konversi Set ke array (opsional, jika Anda ingin menggunakan kelas-kelas dalam array)
        return Array.from(allClasses);
    }
    ;
}
exports.Tailwind = Tailwind;
;
