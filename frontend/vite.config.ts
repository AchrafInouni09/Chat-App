import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    cssMinify: false,
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://localhost',
        secure: false,
        changeOrigin: true,
      },
      '/socket.io': {
        target: 'https://localhost',
        secure: false,
        ws: true,
        changeOrigin: true,
      },
    },
  },
})