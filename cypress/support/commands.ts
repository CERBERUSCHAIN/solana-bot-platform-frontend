// CERBERUS Bot - Cypress Custom Commands
// Created: 2025-05-07 05:51:30 UTC
// Author: CERBERUSCHAIN

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// -- This is a parent command --
Cypress.Commands.add("login", (email: string, password: string) => {
  cy.session(
    [email, password],
    () => {
      cy.visit("/auth/login");
      cy.get("[data-cy=email-input]").type(email);
      cy.get("[data-cy=password-input]").type(password);
      cy.get("[data-cy=login-button]").click();
      cy.url().should("include", "/dashboard");
    },
    {
      validate: () => {
        // Check if user is logged in by checking local storage or session storage
        cy.window().then((win) => {
          expect(win.localStorage.getItem("authToken")).to.exist;
        });
      },
    }
  );
});

// Command to create a bot
Cypress.Commands.add("createBot", (botName: string, botType: string) => {
  cy.visit("/trading/bots/create");
  cy.get("[data-cy=bot-name-input]").type(botName);
  cy.get(`[data-cy=bot-type-${botType}]`).click();
  cy.get("[data-cy=description-input]").type("Test bot created by Cypress");
  cy.get("[data-cy=create-bot-submit]").click();
  cy.url().should("include", "/trading/bots");
});

// Command to create a strategy
Cypress.Commands.add("createStrategy", (strategyName: string, strategyType: string) => {
  cy.visit("/trading/strategies/create");
  cy.get("[data-cy=strategy-name-input]").type(strategyName);
  cy.get("[data-cy=strategy-type-select]").select(strategyType);
  cy.get("[data-cy=add-entry-rule]").click();
  cy.get("[data-cy=indicator-select]").first().select("ind-1");
  cy.get("[data-cy=condition-select]").first().select("ABOVE");
  cy.get("[data-cy=value-input]").first().type("50");
  cy.get("[data-cy=save-strategy]").click();
});

// Command to simulate a notification
Cypress.Commands.add("simulateNotification", (title: string, message: string) => {
  cy.window().then((win) => {
    const event = new CustomEvent("cerberus:notification", {
      detail: {
        id: `test-notification-${Date.now()}`,
        title,
        message,
        createdAt: new Date().toISOString(),
        isRead: false
      }
    });
    win.document.dispatchEvent(event);
  });
  
  cy.get("[data-cy=notification-toast]").should("be.visible");
});

// Define types for custom commands
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to log in with email and password
       * @example cy.login("user@example.com", "password")
       */
      login(email: string, password: string): Chainable<Element>;
      
      /**
       * Custom command to create a trading bot
       * @example cy.createBot("Test Bot", "dex-trading")
       */
      createBot(botName: string, botType: string): Chainable<Element>;
      
      /**
       * Custom command to create a trading strategy
       * @example cy.createStrategy("My Strategy", "MOMENTUM")
       */
      createStrategy(strategyName: string, strategyType: string): Chainable<Element>;
      
      /**
       * Custom command to simulate a notification
       * @example cy.simulateNotification("Bot Alert", "Your bot has completed a trade")
       */
      simulateNotification(title: string, message: string): Chainable<Element>;
    }
  }
}

export {};
// cypress/support/commands.ts

// Add Cypress login command
Cypress.Commands.add('login', (email, password) => {
  cy.session([email, password], () => {
    cy.visit('/login')
    cy.get('[data-cy=email-input]').type(email)
    cy.get('[data-cy=password-input]').type(password)
    cy.get('[data-cy=login-button]').click()
    cy.url().should('include', '/dashboard')
  })
})

// Add type definitions for TypeScript
declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<Element>
    }
  }
}
