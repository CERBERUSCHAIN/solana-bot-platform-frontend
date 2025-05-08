module.exports = {
  extends: [
    // Your other extends...
    'plugin:jsx-a11y/recommended'
  ],
  plugins: [
    // Your other plugins...
    'jsx-a11y'
  ],
  rules: {
    // Auto-fixable accessibility rules
    'jsx-a11y/alt-text': 'error',
    'jsx-a11y/aria-role': 'error',
    'jsx-a11y/aria-props': 'error',
    'jsx-a11y/aria-unsupported-elements': 'error',
    'jsx-a11y/role-has-required-aria-props': 'error',
    'jsx-a11y/label-has-associated-control': 'error',
    'jsx-a11y/no-noninteractive-element-interactions': 'error',
    'jsx-a11y/no-noninteractive-tabindex': 'error',
    'jsx-a11y/tabindex-no-positive': 'error',
    // Your other rules...
  }
};
