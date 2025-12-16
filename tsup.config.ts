import { defineConfig } from "tsup";

/**
 * tsup configuration for building the library
 * Builds both ESM and CommonJS formats with TypeScript definitions
 */
export default defineConfig({
  // Entry point for the library
  entry: ["src/index.ts"],
  // Output formats: ESM for modern bundlers, CJS for Node.js compatibility
  format: ["esm", "cjs"],
  // Generate TypeScript declaration files (.d.ts)
  dts: true,
  // Generate source maps for debugging
  sourcemap: true,
  // Clean output directory before building
  clean: true,
  // Target ES2019 for better browser compatibility
  target: "es2019",
  // Mark React and React-DOM as external dependencies (peer dependencies)
  external: ["react", "react-dom"],
  // Don't minify output (can be enabled for production builds)
  minify: false,
  // Use specific tsconfig for build
  tsconfig: "tsconfig.build.json"
});

