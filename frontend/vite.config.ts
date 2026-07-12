import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // App is served from the /appifybook/ subpath in production, so asset
  // URLs and the router basename must be prefixed with it.
  base: '/appifybook/',
  plugins: [react()],
})
