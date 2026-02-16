const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { join } = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
  output: {
    path: join(__dirname, 'dist'),
    clean: true,
    ...(process.env.NODE_ENV !== 'production' && {
      devtoolModuleFilenameTemplate: '[absolute-resource-path]',
    }),
  },
  resolve: {
    plugins: [
      new TsconfigPathsPlugin({
        configFile: join(__dirname, '../tsconfig.base.json'),
      }),
    ],
  },
  plugins: [
    new NxAppWebpackPlugin({
      target: 'node',
      compiler: 'tsc',
      main: './src/main.ts',
      tsConfig: './tsconfig.app.json',
      assets: ['./src/assets'],
      optimization: false,
      outputHashing: 'none',
      generatePackageJson: false,
      sourceMap: true,
      externalDependencies: 'all',
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: join(__dirname, '../node_modules/.prisma'),
          to: join(__dirname, 'dist/node_modules/.prisma'),
          noErrorOnMissing: false,
        },
      ],
    }),
  ],
};
