// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  css: ["~/assets/css/main.css"],
  devtools: { enabled: true },
  modules: ["@nuxtjs/google-fonts"],
  googleFonts: {
    families: {
      "DM Sans": [300, 400, 500, 600, 700],
      "JetBrains+Mono": [400, 500, 600],
    },
    display: "swap",
    preload: true,
    prefetch: true,
    preconnect: true,
    download: false,
  },
});
