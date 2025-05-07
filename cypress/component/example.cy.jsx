// cypress/component/example.cy.jsx
import React from 'react'

// A simple example component
function Button({ children }) {
  return <button>{children}</button>
}

describe('Button Component', () => {
  it('renders correctly', () => {
    cy.mount(<Button>Click me</Button>)
    cy.get('button').should('exist')
    cy.get('button').should('contain.text', 'Click me')
  })
})
