module.exports = {
  presets: [
    "@babel/preset-env", // Transpile modern JavaScript to a compatible version for your environment
    "@babel/preset-react", // Transpile JSX if using React
    "@babel/preset-typescript", // Transpile TypeScript to JavaScript
  ],
  plugins: [
    "@babel/plugin-transform-runtime", // Avoid duplication of helper code
    "@babel/plugin-transform-modules-commonjs",
  ],
};
