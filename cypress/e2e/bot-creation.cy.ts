// cypress/e2e/bot-creation.cy.ts
describe('Bot Creation Flow', () => {
  beforeEach(() => {
    // Assuming we have a helper for login
    cy.login('test@example.com', 'password123');
    cy.visit('/dashboard');
  });

  it('should allow creating a new bot', () => {
    cy.get('[data-cy=create-bot-button]').click();
    cy.url().should('include', '/bots/create');
    
    // Fill bot details
    cy.get('[data-cy=bot-name-input]').type('Test DCA Bot');
    cy.get('[data-cy=bot-type-select]').select('DCA');
    cy.get('[data-cy=trading-pair-input]').type('SOL/USDT');
    cy.get('[data-cy=exchange-select]').select('Binance');
    
    // Configure bot settings
    cy.get('[data-cy=investment-amount-input]').type('100');
    cy.get('[data-cy=investment-interval-select]').select('Daily');
    
    // Save the bot
    cy.get('[data-cy=save-bot-button]').click();
    
    // Verify we're redirected to bot details page
    cy.url().should('match', /\/bots\/[\w-]+/);
    cy.get('[data-cy=bot-details]').should('contain', 'Test DCA Bot');
  });
});
