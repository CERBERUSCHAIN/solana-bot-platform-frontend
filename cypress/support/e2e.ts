// cypress/support/commands.ts

// Simulate login
Cypress.Commands.add('login', (email = 'test@example.com', password = 'password123') => {
  // Either use UI login
  cy.visit('/login');
  cy.get('[data-cy=email-input]').type(email);
  cy.get('[data-cy=password-input]').type(password);
  cy.get('[data-cy=login-button]').click();
  cy.url().should('include', '/dashboard');
  
  // Or use programmatic login (faster for tests that just need authenticated state)
  // cy.window().then((window) => {
  //   window.localStorage.setItem('token', 'fake-jwt-token');
  //   window.localStorage.setItem('user', JSON.stringify({
  //     id: '123',
  //     email,
  //     name: 'Test User'
  //   }));
  // });
  // cy.visit('/dashboard');
});

// Add type definitions for TypeScript
declare global {
  namespace Cypress {
    interface Chainable {
      login(email?: string, password?: string): void;
    }
  }
}
