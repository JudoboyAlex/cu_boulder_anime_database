module.exports = {
  presets: [
    ["@babel/preset-env", { targets: { node: "current" } }], // Transpile modern JavaScript for the current Node version
    "@babel/preset-react", // Transpile JSX for React
    "@babel/preset-typescript", // Transpile TypeScript to JavaScript
  ],
  plugins: [
    "@babel/plugin-transform-runtime", // Avoid duplication of helper code
    "babel-plugin-transform-import-meta", // Enable support for import.meta
    "babel-plugin-transform-vite-meta-env", // Transform Vite's meta.env
  ],
};
