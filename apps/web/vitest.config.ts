import { defineVitestConfig } from '@nuxt/test-utils/config'

// Середовище 'nuxt' піднімає Nuxt у тестах: працюють auto-imports
// (ref, computed, composables) і аліас ~/, як у застосунку.
export default defineVitestConfig({
  test: {
    environment: 'nuxt',
    include: ['test/**/*.test.ts'],
  },
})
