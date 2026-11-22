// @ts-check
import tseslint from 'typescript-eslint'
import prettier from 'eslint-config-prettier/flat'

export default tseslint.config(...tseslint.configs.recommended, prettier)
