// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'
// Вимикає правила форматування ESLint, щоб не сперечатися з Prettier.
// Має йти останнім, тому передаємо його в withNuxt (додається після правил Nuxt).
import prettier from 'eslint-config-prettier/flat'

export default withNuxt(prettier)
