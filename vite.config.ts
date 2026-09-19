import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Path-based routing needs an absolute base. The root-domain build uses '/';
  // the /ai-chronicle-2026/ copy is built with `vite build --base=/ai-chronicle-2026/`.
  base: '/',
  plugins: [react()],
  server: {
    port: 5173,
    open: false,
  },
});
