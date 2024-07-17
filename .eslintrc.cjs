/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    '@vue/standard',
    '@vue/eslint-config-typescript',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  globals: {
    NodeJS: true,
    ObsClient: true,
    OSS: true,
    AMap: true,
    _AMapSecurityConfig: true,
    Loca: true,
  },
  rules: {
    'no-console': 'error',
    'no-debugger': 'error',
    'space-before-function-paren': ['error', 'never'],
    quotes: ['error', 'single'],
    semi: ['error', 'never'],
    'comma-dangle': 'off',
    '@typescript-eslint/comma-dangle': [
      'error',
      {
        objects: 'always-multiline',
        arrays: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
      },
    ],
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        vars: 'local',
        args: 'none',
        ignoreRestSiblings: true,
        caughtErrors: 'none',
        argsIgnorePattern: '^_',
      },
    ],
    'no-multiple-empty-lines': [
      'error',
      {
        max: 1,
        maxEOF: 0,
        maxBOF: 0,
      },
    ],
    'standard/computed-property-even-spacing': 0,
    'object-curly-newline': [
      'error',
      {
        ObjectExpression: {
          multiline: false,
          minProperties: 1,
        },
        ObjectPattern: {
          consistent: false,
          multiline: false,
          minProperties: 3,
        },
        ImportDeclaration: {
          multiline: true,
          minProperties: 3,
        },
        ExportDeclaration: {
          multiline: true,
          minProperties: 3,
        },
      },
    ],
    'vue/html-closing-bracket-newline': [
      'error',
      {
        singleline: 'never',
        multiline: 'always',
      },
    ],
    'vue/html-self-closing': [
      'error',
      {
        html: {
          void: 'never',
          normal: 'always',
          component: 'always',
        },
        svg: 'always',
        math: 'always',
      },
    ],
    'vue/max-attributes-per-line': [
      'warn',
      {
        singleline: {
          max: 2,
        },
        multiline: {
          max: 1,
        },
      },
    ],
    'vue/html-indent': [
      'error',
      2,
      {
        attribute: 1,
        baseIndent: 1,
        closeBracket: 0,
        alignAttributesVertically: false,
        ignores: [],
      },
    ],
    'vue/no-mutating-props': 'off',
    'vue/multi-word-component-names': 0,
    'vue/attribute-hyphenation': 1,
    'vue/first-attribute-linebreak': [
      'error',
      {
        singleline: 'ignore',
        multiline: 'below',
      },
    ],
    'vue/attributes-order': [
      'error',
      {
        alphabetical: false,
      },
    ],
    '@typescript-eslint/consistent-type-imports': 'error',
    'no-warning-comments': [
      'error',
      {
        terms: [
          '把这句话改成接口描述',
        ],
        location: 'anywhere',
      },
    ],
  },
}
