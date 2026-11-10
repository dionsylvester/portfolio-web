import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import linkPreviews from './linkPreviews.js'

export default defineConfig({
  plugins: [react(), linkPreviews()],
})
