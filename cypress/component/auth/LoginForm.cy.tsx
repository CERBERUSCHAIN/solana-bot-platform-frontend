// cypress/component/auth/LoginForm.cy.tsx
import React from "react";
import LoginForm from "../../../components/auth/LoginForm";

describe("Login Form Component", () => {
  it("renders correctly", () => {
    cy.mount(<LoginForm />);
    cy.get("[data-cy=login-form]").should("be.visible");
    cy.get("[data-cy=email-input]").should("be.visible");
    cy.get("[data-cy=password-input]").should("be.visible");
    cy.get("[data-cy=login-button]").should("be.visible");
  });
  
  it("shows error when submitting with empty fields", () => {
    cy.mount(<LoginForm />);
    cy.get("[data-cy=login-button]").click();
    cy.get("[data-cy=auth-error]").should("be.visible");
    cy.get("[data-cy=auth-error]").should("contain", "Email and password are required");
  });
  
  it("submits form data when valid", () => {
    const onSubmit = cy.spy().as("onSubmit");
    cy.mount(<LoginForm onSubmit={onSubmit} />);
    
    cy.get("[data-cy=email-input]").type("test@example.com");
    cy.get("[data-cy=password-input]").type("password123");
    cy.get("[data-cy=login-button]").click();
    
    cy.get("@onSubmit").should("have.been.calledOnce");
    cy.get("@onSubmit").should("have.been.calledWithMatch", {
      email: "test@example.com",
      password: "password123"
    });
  });
});
