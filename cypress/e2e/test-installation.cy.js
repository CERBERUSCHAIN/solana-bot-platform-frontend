describe('Basic E2E Test', () => {
  it('visits example page', () => {
    cy.visit('https://example.cypress.io');
    cy.contains('h1', 'Kitchen Sink').should('be.visible');
  });
});
