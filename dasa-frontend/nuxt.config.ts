// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  css: ["~/assets/css/main.css"],
  devtools: { enabled: true },

  modules: ["@nuxt/image", "@nuxtjs/google-fonts", "@nuxtjs/seo", "@nuxtjs/strapi"],
  strapi: {

  },
  runtimeConfig:{
    public: {
      strapiUrl: process.env.STRAPI_URL ?? 'http://localhost:1337'
    }
  },
  image: {
    quality: 85,
    format: ["webp"],
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1920,
    },
  },

  // ─── Site SEO (used by @nuxtjs/seo) ───
  site: {
    url: "https://dasa.co.id",
    name: "Dasa Aprilando Sentosa",
    description:
      "DASA Aprilando Sentosa is an end-to-end IT solutions company helping businesses improve their capabilities through technology.",
    defaultLocale: "en",
    indexable: true,
  },

  sitemap: {
    strictNuxtContentPaths: false,
    zeroRuntime: true,
  },

  ogImage: {
    enabled: true,
  },

  robots: {
    disallow: [],
  },

  app: {
    head: {
      htmlAttrs: { lang: "en" },
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      meta: [{ name: "twitter:site", content: "@dasatech" }],
      link: [
        {
          rel: "icon",
          type: "image/png",
          href: "/logo-dasa.png",
        },
      ],
    },
  },

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

  // ─── Vite: pre-bundle all GSAP sub-modules together so they share
  //     the same singleton instance (fixes "Missing plugin" errors) ───

  vite: {
    optimizeDeps: {
      include: [
        "gsap",
        "gsap/CSSPlugin",
        "gsap/ScrollTrigger",
      ],
    },
  },
});
