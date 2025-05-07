// cypress/component/Button.cy.tsx
import React from "react";

// A simple button component
function Button({ label, onClick, variant = "primary" }) {
  const getClasses = () => {
    const baseClasses = "px-4 py-2 rounded";
    const variants = {
      primary: "bg-blue-600 text-white",
      secondary: "bg-gray-200 text-gray-800",
      danger: "bg-red-600 text-white"
    };
    return `${baseClasses} ${variants[variant] || variants.primary}`;
  };

  return (
    <button 
      className={getClasses()} 
      onClick={onClick}
      data-cy="button"
    >
      {label}
    </button>
  );
}

describe("Button Component", () => {
  it("renders correctly with default props", () => {
    cy.mount(<Button label="Click Me" />);
    cy.get("[data-cy=button]").should("exist");
    cy.get("[data-cy=button]").should("have.text", "Click Me");
  });

  it("handles click events", () => {
    const onClick = cy.spy().as("onClick");
    cy.mount(<Button label="Click Me" onClick={onClick} />);
    cy.get("[data-cy=button]").click();
    cy.get("@onClick").should("have.been.called");
  });
});
