import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "jsdom", // Use "node" if you're not testing in a browser-like environment
  transform: {
    "^.+\\.(ts|tsx)?$": "ts-jest",
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy", // Mock CSS imports
    "\\.(jpg|jpeg|png|svg|gif)$": "<rootDir>/__mocks__/fileMock.ts", // Mock static file imports
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"], // Add custom setup (optional)
  testPathIgnorePatterns: ["/node_modules/", "/dist/"], // Ignore these paths during testing
  setupFiles: ["./jest.setup.js"],
};

export default config;