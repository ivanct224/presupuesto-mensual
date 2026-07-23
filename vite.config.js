import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Using a relative base so the build works no matter what sub-path
// GitHub Pages serves it from (e.g. https://usuario.github.io/repo/).
export default defineConfig({
  plugins: [react()],
  base: './',
});
