/**
 * .eslint.js
 *
 * ESLint configuration file.
 */

module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'vuetify',
    './.eslintrc-auto-import.json',
    '@vue/standard',
    'plugin:vue/vue3-essential',
    'eslint:recommended'
  ],
  overrides: [
    {
      files: ['src/layouts/**', 'src/pages/**'],
      rules: {
        'vue/multi-word-component-names': 'off'
      }
    }
  ]
}
