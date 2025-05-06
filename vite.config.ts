import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
    plugins: [react(), tsconfigPaths()],
    build: {
        ssr: 'src/app.tsx',
        outDir: 'dist',
        target: 'node20',
        emptyOutDir: true,
        sourcemap: true,
        minify: false, // keep it readable for now
        rollupOptions: {
            output: {
                /**
                 * Produce a single file called app.js
                 * plus a shebang so users can call `blenderq` directly
                 */
                entryFileNames: 'app.js',
                format: 'esm',
                banner: '#!/usr/bin/env node',
            },
        },
    },
})
