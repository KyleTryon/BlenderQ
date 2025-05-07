import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
    plugins: [react(), tsconfigPaths()],
    build: {
        ssr: 'src/app.tsx',
        outDir: 'dist',
        target: 'node20',
        emptyOutDir: true,
        sourcemap: true,
        minify: false,
    },
})
