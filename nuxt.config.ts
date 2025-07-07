// nuxt.config.ts
export default defineNuxtConfig({
  devtools: { enabled: true },

  // Modules
  modules: [
    '@nuxtjs/tailwindcss'
  ],

  // Configuration publique
  runtimeConfig: {
    public: {
      apiBaseUrl: 'https://ressources-relationnelles-api-develop-xvsj0x.laravel.cloud/api',
      appName: 'Ressources Relationnelles'
    }
  },

  // Configuration Nitro pour les requêtes externes
  nitro: {
    experimental: {
      wasm: true
    }
  },

  // Configuration des requêtes externes
  // Désactiver le SSR temporairement pour tester
  ssr: false,

  compatibilityDate: '2025-06-28'
})