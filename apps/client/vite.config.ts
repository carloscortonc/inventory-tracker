import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from "vite-tsconfig-paths";
import svgr from "vite-plugin-svgr";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000,
    host: true,
    // Do this so proxy works from inside docker container
    allowedHosts: true,
  },
  plugins: [
    svgr({ include: "**/*.svg" }),
    react(),
    tsconfigPaths(),
    VitePWA({ registerType: "autoUpdate", manifest: false }),
  ],
});
