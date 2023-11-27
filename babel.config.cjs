module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'usage',
        corejs: 3,
        targets: {
          browsers: [
            'last 2 years and Chrome > 0',
            'last 2 years and FireFox > 0',
            'last 2 years and Safari > 0',
          ],
        },
      },
    ],
    ['@babel/preset-typescript'],
  ],
};
