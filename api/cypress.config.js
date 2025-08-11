const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:8000',
    specPattern: 'vakaden/cypress/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: false,
    setupNodeEvents(on, config) {
      // Override baseUrl in config
      config.baseUrl = 'http://localhost:8000'
      return config
    }
  },
})
