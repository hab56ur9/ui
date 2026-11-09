import { resolve } from "node:path";
import { defineConfig } from "vite";

const root = import.meta.dirname;

export default defineConfig({
  publicDir: false,
  build: {
    outDir: resolve(root, "dist"),
    emptyOutDir: false,
    lib: { entry: resolve(root, "src/index.ts"), formats: ["es"], fileName: () => "ui.js" },
    rollupOptions: { external: [/^react($|\/)/, /^react-dom($|\/)/] },
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
