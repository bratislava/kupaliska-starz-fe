import { defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'
import { resolve } from 'path'
import dns from 'dns'
import legacy from '@vitejs/plugin-legacy'

// Use localhost instead of 127.0.0.1.
// https://vitejs.dev/config/server-options.html#server-host
dns.setDefaultResultOrder('verbatim')

export default defineConfig({
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  plugins: [
    svgr(),
    legacy({
      targets: ['defaults', 'not IE 11'],
    }),
  ],
})
