// cypress/support/component.ts
import { mount } from 'cypress/react'

// Import global styles if they exist
try {
  require('../../src/styles/globals.css')
} catch (e) {
  try {
    require('../../styles/globals.css')
  } catch (e2) {
    // No global styles found, that's okay
  }
}

// Add mount command to Cypress
declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount
    }
  }
}

// Custom mount function that applies theme context if needed
const customMount = (component: React.ReactNode, options = {}) => {
  // You can customize this to add your theme providers
  return mount(
    <div className="app-theme dark">
      {component}
    </div>,
    options
  )
}

Cypress.Commands.add('mount', customMount)
