import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0', // Allows access from any IP
    port: 5173,      // Change port if needed
    strictPort: true, // Ensures Vite runs only on this port
    allowedHosts: ['cloudkitchenaitiger.com', 'localhost'], // Allow custom domain
  },
})



