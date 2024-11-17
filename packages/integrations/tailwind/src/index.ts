import postcss from 'postcss';
import tailwindcss from 'tailwindcss';
import type { Config as TailwindConfig } from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import fs from 'fs';
import { readFileSync, existsSync } from "node:fs";
import path from 'path';


async function compileTailwindCSS(inputFile: string, outputFile: string, config: TailwindConfig): Promise<string> {
    return new Promise<string>(async(resolve, reject) => {
        try {
            // Membaca isi file input CSS yang berisi direktif Tailwind
            const css = fs.readFileSync(inputFile, 'utf-8');
            // // Memproses CSS menggunakan PostCSS dengan plugin Tailwind dan Autoprefixer
            // const result = await postcss([tailwindcss(), autoprefixer()])
            //   .process(css, { from: inputFile, to: outputFile });
            const result = await postcss([tailwindcss(config), autoprefixer()])
            .process(css, { from: inputFile, to: outputFile });
            // Menyimpan hasil kompilasi ke file output
            fs.writeFileSync(outputFile, result.css);
        
            // Jika ada peta sumber, simpan juga
            if (result.map) {
              fs.writeFileSync(outputFile + '.map', result.map.toString());
            }
            resolve(outputFile);
        } catch (error) {
            console.error('Terjadi kesalahan saat mengkompilasi CSS:', error);
        }
    });
}

export interface Config {
    wd: string;
    root: string;
    out: string;
    document: Document;
    // tailwind_config?: string;
    // postcss_config?: string;
};

export class Tailwind {
    declare private _input: string;
    declare private _output: string;
    declare private _config: Config;
    declare private _document: Document;
    constructor (config: Config) {
        const input = path.join(__dirname, '../src/base.css');
        const output = path.resolve(__dirname, config.wd, config.out, "style.css");
        this._input = input;
        this._output = output;
        this._config = config;
    };

    public async compile() {
        const styles = await compileTailwindCSS(this._input, this._output, { content: [{ raw: this.classAll(this._config.document).join(" ") }] });
        const link = this._config.document.createElement("link");
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("href", "/index.css");
        this._config.document.head.appendChild(link);
    };

    private classAll(document: Document): string[] {
      // Ambil semua elemen dalam dokumen
      const allElements = document.querySelectorAll('*');
      // Gunakan Set untuk menghindari duplikasi kelas
      const allClasses = new Set<string>();
      // Loop melalui semua elemen dan ambil kelasnya
      allElements.forEach((element) => {
          element.classList.forEach((cls) => {
              allClasses.add(cls); // Menambahkan kelas ke dalam Set
          });
      });
      // Konversi Set ke array (opsional, jika Anda ingin menggunakan kelas-kelas dalam array)
      return Array.from(allClasses);
    };

};

  