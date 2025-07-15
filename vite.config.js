import path from "path";
import { fileURLToPath } from "url";

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: "./index.html",
        content: "./src/content/index.js",
        settings: "./src/options/settings.html",
      },
      output: {
        format: "es",
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === "content") {
            return "[name].js";
          }
          return "[name].[hash].js";
        },
        chunkFileNames: (chunkInfo) => {
          if (chunkInfo.facadeModuleId?.includes("content/")) {
            return "content/[name].[hash].js";
          }
          return "[name].[hash].js";
        },
        assetFileNames: "[name].[ext]",
      },
    },
  },
});
