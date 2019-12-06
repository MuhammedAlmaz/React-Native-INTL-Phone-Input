
module.exports = {
  'extends': 'airbnb',
  'parser': 'babel-eslint',
  'env': {
    'jest': true,
  },
  'rules': {
    'no-use-before-define': 'off',
    'react/jsx-filename-extension': 'off',
    'react/prop-types': 'off',
    'comma-dangle': 'off',
    'react/forbid-prop-types': 'off',
     'no-restricted-globals':'off',
    'react/require-default-props': 'off',
    'no-return-assign': 'off',
    'react/destructuring-assignment': 'off',
    'camelcase': 'off',
    'prefer-destructuring': 'off',
    'no-throw-literal': 'off',
    'no-mixed-spaces-and-tabs': 'off',
    'no-tabs': 'off',
    'react/no-unescaped-entities': 'off',
    'no-underscore-dangle': 'off',
    'import/no-cycle': 'off',
  },
  'globals': {
    "fetch": false
  }
}
