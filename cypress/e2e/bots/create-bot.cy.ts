// cypress/e2e/bots/create-bot.cy.ts
describe("Bot Creation Flow", () => {
  beforeEach(() => {
    cy.login("test@example.com", "password123");
    cy.visit("/trading/bots/create");
  });

  it("validates required fields", () => {
    // Try to submit without filling required fields
    cy.get("[data-cy=create-bot-submit]").click();
    cy.get("[data-cy=name-error]").should("be.visible");
    cy.get("[data-cy=bot-type-error]").should("be.visible");
  });

  it("creates a DCA bot successfully", () => {
    const botName = `DCA Test Bot ${Date.now()}`;
    
    // Fill in bot details
    cy.get("[data-cy=bot-name-input]").type(botName);
    cy.get("[data-cy=bot-type-dca]").click();
    cy.get("[data-cy=description-input]").type("Dollar-cost average bot created by Cypress");
    
    // Configure DCA specific settings
    cy.get("[data-cy=token-input]").type("SOL");
    cy.get("[data-cy=interval-select]").select("DAILY");
    cy.get("[data-cy=amount-input]").clear().type("10");
    
    // Create the bot
    cy.get("[data-cy=create-bot-submit]").click();
    
    // Verify success
    cy.url().should("include", "/trading/bots");
    cy.get("[data-cy=success-notification]").should("contain", "Bot created successfully");
    
    // Verify bot appears in the list
    cy.get("[data-cy=bot-list]").should("contain", botName);
  });
});
