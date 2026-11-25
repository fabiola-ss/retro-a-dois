// A página de vendas fica em src/ e a Retrô de exemplo em src/exemplo/. O build gera a pasta docs/, que o GitHub Pages publica.
import { defineConfig } from "vite";
import { resolve } from "node:path";
import react from "@vitejs/plugin-react";

export default defineConfig({
  root: "src",
  base: "./",
  plugins: [react()],
  build: {
    outDir: "../docs",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, "src/index.html"),
        exemplo: resolve(import.meta.dirname, "src/exemplo/index.html"),
        montar: resolve(import.meta.dirname, "src/montar/index.html"),
        retro: resolve(import.meta.dirname, "src/r/index.html"),
        painel: resolve(import.meta.dirname, "src/painel/index.html"),
      },
    },
  },
});
