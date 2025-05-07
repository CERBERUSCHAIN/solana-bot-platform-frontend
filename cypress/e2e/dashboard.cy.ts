// cypress/e2e/dashboard.cy.ts
describe('Dashboard', () => {
  beforeEach(() => {
    // Mock authentication
    cy.window().then((window) => {
      window.localStorage.setItem('token', 'fake-jwt-token');
      window.localStorage.setItem('user', JSON.stringify({
        id: '123',
        email: 'test@example.com',
        name: 'Test User'
      }));
    });
    
    // Mock API responses
    cy.intercept('GET', '/api/bots', {
      statusCode: 200,
      fixture: 'e2e/bots.json'
    }).as('getBots');

    cy.intercept('GET', '/api/strategies', {
      statusCode: 200,
      fixture: 'e2e/strategies.json'
    }).as('getStrategies');
    
    cy.intercept('GET', '/api/performance', {
      statusCode: 200,
      fixture: 'e2e/performance.json'
    }).as('getPerformance');
  });

  it('should load dashboard page', () => {
    cy.visit('/dashboard');
    cy.get('[data-cy=dashboard-title]').should('contain', 'Dashboard');
  });

  it('should display bot cards', () => {
    cy.visit('/dashboard');
    cy.wait('@getBots');
    cy.get('[data-cy=bot-card]').should('have.length.at.least', 1);
  });

  it('should allow navigating to bot details', () => {
    cy.visit('/dashboard');
    cy.wait('@getBots');
    cy.get('[data-cy=bot-card]').first().click();
    cy.url().should('match', /\/bots\/[\w-]+/);
  });

  it('should show performance metrics', () => {
    cy.visit('/dashboard');
    cy.wait('@getPerformance');
    cy.get('[data-cy=performance-chart]').should('be.visible');
    cy.get('[data-cy=total-profit]').should('be.visible');
  });
});
