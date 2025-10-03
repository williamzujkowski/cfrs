import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact()],

  // GitHub Pages deployment configuration
  base: process.env.NODE_ENV === 'production' ? '/cfrs/' : '/',

  resolve: {
    alias: {
      '@': resolve(__dirname, './apps/web/src'),
      '@schemas': resolve(__dirname, './schemas'),
      '@themes': resolve(__dirname, './themes'),
    },
  },

  build: {
    outDir: 'dist',
    sourcemap: true,
    minify: 'esbuild', // Use esbuild instead of terser for faster builds
    target: 'es2020',

    // Optimize bundle size
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['preact'],
          schema: ['ajv', 'ajv-formats'],
          render: ['nunjucks'],
          importers: ['mammoth', 'marked'],
        },
      },
    },

    // Performance budgets (3s load on 3G = ~600KB)
    chunkSizeWarningLimit: 500,
  },

  server: {
    port: 3000,
    open: true,
    strictPort: false,
  },

  preview: {
    port: 4173,
    strictPort: false,
  },

  // CSP and security headers
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },

  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './apps/web/src/test/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'apps/web/src/test/', '**/*.d.ts', '**/*.config.*', '**/dist/**'],
    },
  },
});
