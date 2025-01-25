import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest", // Use ts-jest for TypeScript support
  testEnvironment: "node", // Set the environment to Node.js
  transform: {
    "^.+\\.tsx?$": "ts-jest", // Transform TypeScript files using ts-jest
  },
  moduleFileExtensions: ["ts", "js", "json"], // Allow importing TypeScript files
  testMatch: ["**/?(*.)+(spec|test).ts"], // Match test files ending with .spec.ts or .test.ts
};

export default config;
