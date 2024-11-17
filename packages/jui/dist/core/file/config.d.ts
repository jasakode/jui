import { Config } from "../../../config";
/**
 * Mencari konfigurasi dengan nama yang diberikan (atau menggunakan nama default).
 * Fungsi ini pertama kali memeriksa apakah file konfigurasi ada di direktori kerja.
 * Jika ditemukan, file akan diimpor dan dikembalikan sebagai objek konfigurasi.
 * @param {string} [name] - Nama file konfigurasi yang akan dicari. Jika tidak diberikan, menggunakan nama default.
 * @returns {Promise<Config | undefined>} - Mengembalikan konfigurasi sebagai objek atau undefined jika tidak ditemukan.
 */
export declare function findConfig(name?: string): Promise<Config | undefined>;
