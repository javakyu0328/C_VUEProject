module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@babel/eslint-parser',
    ecmaVersion: 12,
    sourceType: 'module',
    requireConfigFile: false,
  },
  plugins: ['vue'],
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
  ],
  rules: {
    // 필요한 규칙 추가 가능
    'no-undef': 'off' // defineProps 등 인식하게 하기
  },
}