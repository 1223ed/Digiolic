import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: path.resolve(__dirname, '../assets/projects-build'),
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, 'src/projects-main.tsx'),
      output: {
        entryFileNames: 'projects-section.js',
        assetFileNames: 'projects-section.[ext]',
        format: 'es',
      },
    },
  },
});

