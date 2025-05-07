const { defineConfig } = require('cypress');

module.exports = defineConfig({
  component: {
    devServer: {
      framework: 'react',
      bundler: 'webpack',
      webpackConfig: {
        mode: 'development',
        module: {
          rules: [
            {
              test: /\.jsx?$/,
              exclude: /node_modules/,
              use: {
                loader: 'babel-loader',
                options: {
                  presets: ['@babel/preset-env', '@babel/preset-react']
                }
              }
            },
            {
              test: /\.tsx?$/,
              exclude: /node_modules/,
              use: {
                loader: 'ts-loader'
              }
            },
            {
              test: /\.css$/,
              use: ['style-loader', 'css-loader']
            }
          ]
        },
        resolve: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
          alias: {
            '@': require('path').resolve(__dirname, 'src')
          }
        }
      }
    },
    supportFile: 'cypress/support/component.ts',
    specPattern: 'cypress/component/**/*.cy.{js,jsx,ts,tsx}'
  },
  e2e: {
    setupNodeEvents(on, config) {},
  },
});
