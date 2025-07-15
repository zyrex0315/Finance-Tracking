import { defineConfig } from "vite";
import react from "@vitejs/plugin-react"; // Added as it's TypeScript-related and in devDependencies

// https://vitejs.dev/config/
export default defineConfig({
  base: '/Finance-Tracking/', // Set base for GitHub Pages
  plugins: [react()],
  server: {
    allowedHosts: true,
  },
  build: {
    chunkSizeWarningLimit: 5000,
  },
}); 