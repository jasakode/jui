"use strict";
// Copyright (c) 2024, Jasakode Authors.
// All rights reserved.
// Use of this source code is governed by a BSD 3-Clause
// license that can be found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
;
// Implementasi metode trimStartAll pada String prototype
String.prototype.trimStartAll = function (char = ' ') {
    // Menggunakan regular expression untuk menghapus karakter tertentu dari awal string
    const regex = new RegExp(`^${char}+`);
    return this.replace(regex, '');
};
// Implementasi metode trimEndAll pada String prototype
String.prototype.trimEndAll = function (char = ' ') {
    // Menggunakan regular expression untuk menghapus karakter tertentu dari akhir string
    const regex = new RegExp(`${char}+$`);
    return this.replace(regex, '');
};
// Implementasi metode reverse pada String prototype
String.prototype.reverse = function () {
    return this.split('').reverse().join('');
};
