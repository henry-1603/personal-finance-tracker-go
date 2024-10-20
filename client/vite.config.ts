import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from "tailwindcss";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5001, // Your desired port
  },
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
});
