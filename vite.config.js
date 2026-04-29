import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/smart-farm/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.svg', 'apple-touch-icon.png', 'masked-icon.svg',
        'splash-*.png'
      ],
      manifest: {
        name: 'المزرعة الذكية - الاكتفاء الذاتي',
        short_name: 'المزرعة الذكية',
        description: 'نظام متكامل لإدارة المزرعة الذكية وتحقيق الاكتفاء الذاتي في منطقة الأنبار',
        theme_color: '#2D6A4F',
        background_color: '#F7F3EC',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/smart-farm/',
        start_url: '/smart-farm/',
        lang: 'ar',
        dir: 'rtl',
        icons: [
          {
            src: 'icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        skipWaiting: true,
        clientsClaim: true,
        cleanupOutdatedCaches: true,
        navigateFallback: '/smart-farm/index.html',
        navigateFallbackDenylist: [/^\/api\//],
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          // Weather API — NetworkFirst: tries network, falls back to last cached response
          {
            urlPattern: /^https:\/\/api\.open-meteo\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'weather-cache',
              networkTimeoutSeconds: 5,
              expiration: {
                maxEntries: 5,
                maxAgeSeconds: 60 * 60 * 6  // 6 hours
              },
              cacheableResponse: { statuses: [0, 200] }
            }
          },
          // Static images
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 60 * 60 * 24 * 30
              }
            }
          }
        ]
      },
      devOptions: {
        enabled: false
      }
    })
  ]
})
