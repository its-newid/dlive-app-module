import {defineConfig} from "vite";
import react from "@vitejs/plugin-react-swc";
import legacy from "@vitejs/plugin-legacy";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
    base: "",
    resolve: {
        alias: {
            '@': '/src',
        },
    },
    plugins: [
        react(),
        legacy({
            targets: ["chrome >= 69"],
            polyfills: true,
            renderLegacyChunks: false,
        }),
        svgr(),
        {
            name: 'remove-script-attributes',
            transformIndexHtml(html) {
                return html.replace(
                    '<script type="module" crossorigin src="./bundle.js"></script>',
                    '<script defer src="./bundle.js"></script>'
                );
            }
        }
    ],
    build: {
        cssTarget: "chrome69",
        assetsDir: "",
        minify: "terser",
        assetsInlineLimit: 10485760, // 10MB
        rollupOptions: {
            input: 'index.html',
            output: {
                inlineDynamicImports: true,
                entryFileNames: 'bundle.js',
                format: 'iife',
                manualChunks: undefined,
            }
        },
        chunkSizeWarningLimit: 1500,
    },
});
