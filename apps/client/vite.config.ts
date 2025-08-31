import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from "vite-tsconfig-paths";
import mkcert from 'vite-plugin-mkcert'
import svgr from "vite-plugin-svgr";


// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [svgr({include: "**/*.svg"}),react(), tsconfigPaths(),  mkcert()],
});
