// cypress/component/minimal.cy.tsx
import React from 'react';

describe('Minimal Component Test', () => {
  it('renders a div', () => {
    cy.mount(<div data-cy="simple">Hello CERBERUS</div>);
    cy.get('[data-cy=simple]').should('exist');
    cy.get('[data-cy=simple]').should('have.text', 'Hello CERBERUS');
  });
});
