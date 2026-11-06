import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: './' makes all file paths relative, so the built app works
// from any GitHub Pages address (https://<user>.github.io/<repo>/).
export default defineConfig({
  plugins: [react()],
  base: './',
})
