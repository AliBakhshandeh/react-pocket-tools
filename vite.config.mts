import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";
import react from "@vitejs/plugin-react";

/**
 * Vite configuration for development and testing
 * Includes React plugin, path aliases, and Vitest test configuration
 */
export default defineConfig({
  // React plugin for JSX/TSX support
  plugins: [react()],
  resolve: {
    // Path aliases for cleaner imports
    alias: {
      "@components": fileURLToPath(new URL("./src/components", import.meta.url)),
      "@utils": fileURLToPath(new URL("./src/utils", import.meta.url)),
      "@types": fileURLToPath(new URL("./src/types", import.meta.url)),
    },
  },
  // Vitest configuration
  test: {
    // Enable global test APIs (describe, it, expect, etc.)
    globals: true,
    // Use jsdom environment for DOM testing
    environment: "jsdom",
    // Setup file for test configuration
    setupFiles: "./vitest.setup.ts",
    coverage: {
      // Coverage report formats
      reporter: ["text", "lcov"],
    },
  },
});
