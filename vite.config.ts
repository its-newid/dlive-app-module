import {defineConfig} from "vite";
import react from "@vitejs/plugin-react-swc";
import legacy from "@vitejs/plugin-legacy";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
    base: "./",
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
        }),
        svgr(),
    ],
    build: {
        cssTarget: "chrome69",
        assetsDir: "",
        minify: "terser", // 주석처리하면 esbuild 사용.
        rollupOptions: {
            output: {
                manualChunks: undefined,
                entryFileNames: 'dlive-entry-[name]-[hash].js',
                chunkFileNames: 'dlive-chunk-[name]-[hash].js',
                assetFileNames: 'dlive-asset-[name]-[hash].[ext]',
                dir: 'dist'
            }
        },
        chunkSizeWarningLimit: 1500, // tv앱은 앱 설치 시점에 이미 웹 리소스가 모두 다운로드되므로 파일 I/O 최소화가 더 중요.
    },
});
