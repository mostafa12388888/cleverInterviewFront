export default defineNuxtConfig({
  modules: ["@nuxtjs/tailwindcss","@nuxtjs/i18n","@nuxt/icon","@pinia/nuxt"],
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  i18n: {
    locales: [
      { code: 'en', iso: 'en', file: 'en.json' },
      { code: 'ar', iso: 'ar', dir: 'rtl', file: 'ar.json' },
    ],
    defaultLocale: 'en',
    strategy: 'prefix',
    detectBrowserLanguage: {
      alwaysRedirect: true,
      cookieKey: 'i18n_redirected',
      useCookie: true,
      fallbackLocale: 'en',
      redirectOn: 'root',
    }, // ← الفاصلة هنا
    langDir: 'locales/',
  },
  css: [
    "~/assets/css/main.css",
  ],
});
