// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'
import eslintConfigPrettier from 'eslint-config-prettier'

export default withNuxt({
  rules: {
    'import/first': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'vue/first-attribute-linebreak': 'off',
    'import/consistent-type-specifier-style': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    'vue/max-attributes-per-line': 'off',
  },
}).append(eslintConfigPrettier)
