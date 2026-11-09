import { cpSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "vite";

const root = import.meta.dirname;
const page = (path: string) => resolve(root, path);

export default defineConfig({
  base: "./",
  publicDir: false,
  resolve: { alias: [{ find: /^ui\/(tokens|ui)\.css$/, replacement: page("dist/$1.css") }, { find: /^ui$/, replacement: page("src/index.ts") }] },
  build: {
    outDir: "site",
    emptyOutDir: true,
  },
  plugins: [
    {
      name: "publish-token-dist",
      closeBundle() {
        cpSync(page("dist"), page("site/dist"), { recursive: true });
        cpSync(page("assets/fonts"), page("site/assets/fonts"), { recursive: true });
      },
    },
  ],
});
