// cypress/component/ui/Button.cy.tsx
import React from "react";

// A simple button component
function Button({ children, onClick, variant = "primary", disabled = false }) {
  const baseClasses = "px-4 py-2 rounded font-medium focus:outline-none";
  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    danger: "bg-red-600 text-white hover:bg-red-700"
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      onClick={onClick}
      disabled={disabled}
      data-cy="button"
    >
      {children}
    </button>
  );
}

describe("Button Component", () => {
  it("renders with default styling", () => {
    cy.mount(<Button>Click Me</Button>);
    cy.get("[data-cy=button]").should("exist");
    cy.get("[data-cy=button]").should("have.text", "Click Me");
    cy.get("[data-cy=button]").should("have.class", "bg-blue-600");
  });

  it("renders with secondary variant", () => {
    cy.mount(<Button variant="secondary">Secondary</Button>);
    cy.get("[data-cy=button]").should("have.class", "bg-gray-200");
  });

  it("handles click events", () => {
    const onClickSpy = cy.spy().as("onClickSpy");
    cy.mount(<Button onClick={onClickSpy}>Click Me</Button>);
    cy.get("[data-cy=button]").click();
    cy.get("@onClickSpy").should("have.been.calledOnce");
  });

  it("can be disabled", () => {
    const onClickSpy = cy.spy().as("onClickSpy");
    cy.mount(<Button onClick={onClickSpy} disabled={true}>Disabled</Button>);
    cy.get("[data-cy=button]").should("be.disabled");
    cy.get("[data-cy=button]").should("have.class", "opacity-50");
    cy.get("[data-cy=button]").click({ force: true });
    cy.get("@onClickSpy").should("not.have.been.called");
  });
});
