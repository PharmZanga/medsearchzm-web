import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
    // Relative assets work on both the current GitHub Pages project URL and a
    // future custom domain such as medsearchafrica.com.
    base: "./",
    plugins: [react(), tailwindcss()],
    esbuild: {
        jsx: "automatic",
    },
    resolve: {
        alias: {
            "@": resolve(__dirname, "./resources/js"),
        },
    },
    server: {
        proxy: {
            "/api": {
                target: "http://127.0.0.1:8000",
                changeOrigin: true,
            },
        },
    },
});
