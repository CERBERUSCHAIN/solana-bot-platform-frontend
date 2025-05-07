// cypress/component/react-minimal/Button.cy.jsx
import React from 'react'

// Create a simple button component right in the test file
const SimpleButton = ({ label, onClick }) => (
  <button 
    onClick={onClick} 
    data-testid="simple-button"
    style={{ padding: '8px 16px', backgroundColor: '#4CAF50', color: 'white', border: 'none' }}
  >
    {label}
  </button>
)

describe('Simple React Button', () => {
  it('renders and responds to clicks', () => {
    // Create a spy to track clicks
    const onClickSpy = cy.spy().as('clickSpy')
    
    // Mount the component
    cy.mount(
      <SimpleButton 
        label="Click Me" 
        onClick={onClickSpy} 
      />
    )
    
    // Check it renders correctly
    cy.get('[data-testid=simple-button]').should('be.visible')
    cy.get('[data-testid=simple-button]').should('contain.text', 'Click Me')
    
    // Test the click functionality
    cy.get('[data-testid=simple-button]').click()
    cy.get('@clickSpy').should('have.been.called')
  })
})
