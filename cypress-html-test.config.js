const { defineConfig } = require('cypress');

module.exports = defineConfig({
  component: {
    specPattern: 'cypress/component/html/simple.cy.js',
    supportFile: false,
    devServer: () => ({
      port: 8080,
      close: () => {}
    })
  }
});
