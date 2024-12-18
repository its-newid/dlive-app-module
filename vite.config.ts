import { defineConfig } from "vite";
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
      targets: ["chrome >= 38"],
      polyfills: true,
    }),
    svgr({
      // https://react-svgr.com/docs/options/
      svgrOptions: {
        exportType: "default",
        ref: true,
        svgo: false,
        titleProp: true,
      },
      include: "**/*.svg",
    }),
  ],
  build: {
    cssTarget: "chrome38",
    assetsDir: "",
    minify: "terser",
  },
});
