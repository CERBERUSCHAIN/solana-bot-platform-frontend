const { defineConfig } = require('cypress')

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
              test: /\.(js|jsx)$/,
              exclude: /node_modules/,
              use: {
                loader: 'babel-loader',
                options: {
                  presets: ['@babel/preset-env', '@babel/preset-react']
                }
              }
            }
          ]
        },
        resolve: {
          extensions: ['.js', '.jsx']
        }
      }
    },
    specPattern: 'cypress/component/react-minimal/Button.cy.jsx',
    supportFile: 'cypress/support/component-minimal.js'
  }
})
