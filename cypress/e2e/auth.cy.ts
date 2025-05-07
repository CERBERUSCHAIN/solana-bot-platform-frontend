// cypress/e2e/auth.cy.ts
describe('Authentication', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
  });

  it('should redirect unauthenticated users to login page', () => {
    cy.visit('/dashboard');
    cy.url().should('include', '/login');
  });

  it('should show error on invalid login', () => {
    cy.visit('/login');
    cy.get('[data-cy=email-input]').type('wrong@example.com');
    cy.get('[data-cy=password-input]').type('wrongpassword');
    cy.get('[data-cy=login-button]').click();
    cy.get('[data-cy=auth-error]').should('be.visible');
  });

  it('should allow valid login and redirect to dashboard', () => {
    cy.visit('/login');
    cy.get('[data-cy=email-input]').type('test@example.com');
    cy.get('[data-cy=password-input]').type('password123');
    cy.get('[data-cy=login-button]').click();
    
    // Should redirect to dashboard
    cy.url().should('include', '/dashboard');
    cy.get('[data-cy=dashboard-title]').should('be.visible');
  });
});
