import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/pdf-proxy": {
        target: "https://auth-detect.s3.amazonaws.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/pdf-proxy/, ""),
      },
    },
  },
});
