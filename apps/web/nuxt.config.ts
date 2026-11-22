// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/eslint'],
  app: {
    head: {
      // lang потрібен екранним дикторам, щоб читати текст українською вимовою
      htmlAttrs: { lang: 'uk' },
      title: 'Aphasia Helper',
    },
  },
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
})
