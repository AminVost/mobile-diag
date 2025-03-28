module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    ['react-native-reanimated/plugin', { disableInlineStylesWarning: true }],
    'react-native-paper/babel',
    'react-native-classname-to-style',
    [
      'react-native-platform-specific-extensions',
      {
        extensions: ['scss', 'sass']
      }
    ]
  ],
};
