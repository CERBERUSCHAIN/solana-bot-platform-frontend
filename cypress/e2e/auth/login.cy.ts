// CERBERUS Bot - Login Test
// Created: 2025-05-07 05:51:30 UTC
// Author: CERBERUSCHAIN

describe("Login Flow", () => {
  beforeEach(() => {
    cy.visit("/auth/login");
  });

  it("should display login form", () => {
    cy.get("[data-cy=email-input]").should("be.visible");
    cy.get("[data-cy=password-input]").should("be.visible");
    cy.get("[data-cy=login-button]").should("be.visible");
  });

  it("should show error for invalid credentials", () => {
    cy.get("[data-cy=email-input]").type("invalid@example.com");
    cy.get("[data-cy=password-input]").type("wrongpassword");
    cy.get("[data-cy=login-button]").click();
    
    // Assuming your auth system will return an error
    cy.get("[data-cy=login-error]").should("be.visible");
  });

  it("should login with valid credentials", () => {
    // Use environment variables or test-specific values
    const email = Cypress.env("TEST_USER_EMAIL") || "test@cerberuschain.io";
    const password = Cypress.env("TEST_USER_PASSWORD") || "TestPassword123";
    
    // For testing purposes, intercept the login API call
    cy.intercept("POST", "/api/auth/login", {
      statusCode: 200,
      body: {
        token: "fake-jwt-token",
        user: {
          id: "user-1",
          email: email,
          name: "Test User"
        }
      }
    }).as("loginRequest");
    
    cy.get("[data-cy=email-input]").type(email);
    cy.get("[data-cy=password-input]").type(password);
    cy.get("[data-cy=login-button]").click();
    
    cy.wait("@loginRequest");
    
    // Verify redirection to dashboard
    cy.url().should("include", "/dashboard");
  });
});
