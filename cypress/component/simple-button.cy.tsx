// cypress/component/simple-button.cy.tsx
import React from 'react';

describe('Simple Button Test', () => {
  it('renders a basic button', () => {
    // Mount a simple button component
    cy.mount(
      <button data-testid="test-button">
        Test Button
      </button>
    );

    // Test the button exists
    cy.get('[data-testid=test-button]').should('exist');
    cy.get('[data-testid=test-button]').should('contain.text', 'Test Button');
  });
});
