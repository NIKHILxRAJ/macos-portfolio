import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// In development, /api calls go to the Express server on port 5001.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: { "/api": "http://localhost:5001" },
  },
});
