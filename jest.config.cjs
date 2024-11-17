// jest.config.js
module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    testMatch: ["**/?(*.)+(spec|test).[tj]s?(x)"], // Mencari file yang berakhiran .test.ts atau .spec.ts
};
