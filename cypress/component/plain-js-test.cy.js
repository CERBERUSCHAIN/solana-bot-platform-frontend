// cypress/component/plain-js-test.cy.js
import React from 'react'

const TestComponent = () => {
  return <div data-cy="test">Hello CERBERUS</div>
}

describe('Basic Test', () => {
  it('renders a component', () => {
    cy.mount(<TestComponent />)
    cy.get('[data-cy=test]').should('exist')
    cy.get('[data-cy=test]').should('contain', 'Hello CERBERUS')
  })
})
