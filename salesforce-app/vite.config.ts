import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

export default defineConfig({
  base: './',
  plugins: [
    react(),
    {
      name: 'serve-exact-video-path',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const decodedUrl = decodeURIComponent(req.url || '');
          if (
            decodedUrl.includes('hf_20260821_114821_a8ca298f-be2c-4613-a4dd-51b69e16bbde.mp4')
          ) {
            const filePath =
              '/Users/akshaymehrotra/Desktop/Digiolic Websote/hf_20260821_114821_a8ca298f-be2c-4613-a4dd-51b69e16bbde.mp4';
            if (fs.existsSync(filePath)) {
              const stat = fs.statSync(filePath);
              const range = req.headers.range;

              res.setHeader('Content-Type', 'video/mp4');
              res.setHeader('Accept-Ranges', 'bytes');
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
              res.setHeader('Access-Control-Allow-Headers', '*');

              if (req.method === 'OPTIONS') {
                res.writeHead(200);
                res.end();
                return;
              }

              if (range) {
                const parts = range.replace(/bytes=/, '').split('-');
                const start = parseInt(parts[0], 10);
                const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;
                const chunkSize = end - start + 1;

                res.writeHead(206, {
                  'Content-Range': `bytes ${start}-${end}/${stat.size}`,
                  'Content-Length': chunkSize,
                });
                fs.createReadStream(filePath, { start, end }).pipe(res);
              } else {
                res.writeHead(200, {
                  'Content-Length': stat.size,
                });
                fs.createReadStream(filePath).pipe(res);
              }
              return;
            }
          }
          next();
        });
      },
    },
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        entryFileNames: 'assets/vectrus-hero.js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/vectrus-hero.[ext]',
      },
    },
  },
  server: {
    port: 5173,
    fs: {
      allow: ['..', '/Users/akshaymehrotra/Desktop/Digiolic Websote'],
    },
  },
});
