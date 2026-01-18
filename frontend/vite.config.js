import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: import.meta.env.VITE_BACKEND_URL,
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [react(), tailwindcss()],
});
