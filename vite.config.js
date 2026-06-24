import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',  // อัปเดต SW อัตโนมัติ
      includeAssets: ['icon-192.png', 'icon-512.png'],
      manifest: {
        name: 'Everyday Life',
        short_name: 'EverydayLife',
        description: 'School task manager for the gang',
        theme_color: '#0a0f0b',
        background_color: '#0a0f0b',
        display: 'standalone',      // ← เปิดแบบ native app เลย ไม่มี browser bar
        orientation: 'portrait',
        start_url: '/',
        icons: [
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        // Cache หน้าและ asset หลักไว้ offline ได้
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
            handler: 'NetworkFirst',   // ดึง Supabase สดก่อน ถ้าไม่มีเน็ตค่อยใช้ cache
            options: {
              cacheName: 'supabase-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24,  // 1 วัน
              },
            },
          },
        ],
      },
    }),
  ],
})