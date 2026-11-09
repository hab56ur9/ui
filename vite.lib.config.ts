import { resolve } from "node:path";
import { defineConfig } from "vite";

const root = import.meta.dirname;

export default defineConfig({
  publicDir: false,
  define: { "process.env.NODE_ENV": JSON.stringify("production") },
  build: {
    outDir: resolve(root, "dist"),
    emptyOutDir: false,
    minify: true,
    lib: { entry: resolve(root, "src/standalone.ts"), formats: ["es"], fileName: () => "ui.js" },
  },
  plugins: [
    {
      name: "styles-ship-separately",
      enforce: "pre",
      resolveId: (id) => (id.endsWith("styles.css") ? "\0styles" : undefined),
      load: (id) => (id === "\0styles" ? "export {}" : undefined),
    },
  ],
});
