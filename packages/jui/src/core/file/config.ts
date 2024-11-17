// Copyright (c) 2024, Jasakode Authors.
// All rights reserved.
// Use of this source code is governed by a BSD 3-Clause
// license that can be found in the LICENSE file.

import { Config } from "../../../config";
import { readFileSync, readdirSync, existsSync } from "node:fs";


/**
 * Mencari konfigurasi dengan nama yang diberikan (atau menggunakan nama default).
 * Fungsi ini pertama kali memeriksa apakah file konfigurasi ada di direktori kerja.
 * Jika ditemukan, file akan diimpor dan dikembalikan sebagai objek konfigurasi.
 * @param {string} [name] - Nama file konfigurasi yang akan dicari. Jika tidak diberikan, menggunakan nama default.
 * @returns {Promise<Config | undefined>} - Mengembalikan konfigurasi sebagai objek atau undefined jika tidak ditemukan.
 */
export async function findConfig(name?: string): Promise<Config | undefined> {
    // Menentukan path dari file konfigurasi yang akan dicari.
    const configPath = (() => {
        // Menentukan nama file berdasarkan parameter 'name' atau menggunakan nama default.
        const configFileName = name 
            ? (name[0] === "/" ? name.slice(1) : name) 
            : "jui.config.mjs"; // Default file jika tidak ada nama yang diberikan.

        // Memeriksa apakah file dengan nama yang ditentukan ada di direktori kerja.
        if (existsSync(`${process.cwd()}/${configFileName}`)) {
            return `${process.cwd()}/${configFileName}`;
        }

        // Jika file tidak ditemukan dengan ekstensi .mjs, coba ekstensi .js.
        if (existsSync(`${process.cwd()}/${name ? (name[0] === "/" ? name.slice(1) : name) : "jui.config.js"}`)) {
            return `${process.cwd()}/${name ? (name[0] === "/" ? name.slice(1) : name) : "jui.config.js"}`;
        }

        // Jika tidak ditemukan, kembalikan undefined.
        return undefined;
    })();

    // Jika tidak ada path konfigurasi yang ditemukan, kembalikan undefined.
    if (!configPath) return undefined;

    // Mengimpor konfigurasi secara dinamis menggunakan path yang ditemukan.
    const configModule = await import(configPath);
    
    // Mengembalikan modul konfigurasi, baik menggunakan default export atau export langsung.
    return (configModule.default || configModule) as Config;
};