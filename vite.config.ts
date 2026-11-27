import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import pkg from './package.json'

// GitHub Pages serves at /<repo>/; derive base from GITHUB_REPOSITORY in CI
const base = process.env.GITHUB_REPOSITORY ? `/${process.env.GITHUB_REPOSITORY.split('/')[1]}/` : '/'

export default defineConfig({
  base,
  define: { __APP_VERSION__: JSON.stringify(pkg.version) },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/logo.svg'],
      manifest: {
        name: 'Holdem Research',
        short_name: 'Holdem',
        description: "Texas Hold'em preflop study drills",
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          { src: 'icons/logo.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
          { src: 'icons/logo-maskable.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'maskable' },
        ],
      },
    }),
  ],
  test: { environment: 'node' },
})
