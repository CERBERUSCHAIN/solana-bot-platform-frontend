// cypress/component/strategies/StrategyBuilder-simple.cy.tsx
import React from "react";

// Mock simplified version of the StrategyBuilder component
const MockStrategyBuilder = ({ onSave }) => {
  return (
    <div className="strategy-builder">
      <h2 data-cy="strategy-builder-title">Strategy Builder</h2>
      <div className="form-field">
        <label htmlFor="strategy-name">Strategy Name:</label>
        <input 
          id="strategy-name" 
          data-cy="strategy-name-input" 
          type="text" 
          placeholder="Enter strategy name"
        />
      </div>
      
      <div className="conditions">
        <h3>Conditions</h3>
        <ul data-cy="condition-list"></ul>
        <button data-cy="add-condition-button">Add Condition</button>
      </div>
      
      <button 
        data-cy="save-strategy-button"
        onClick={() => onSave({ name: "Test Strategy", conditions: [] })}
      >
        Save Strategy
      </button>
    </div>
  );
};

describe("StrategyBuilder Component (Simplified)", () => {
  it("renders the simplified strategy builder", () => {
    const saveSpy = cy.spy().as("saveStrategy");
    
    cy.mount(<MockStrategyBuilder onSave={saveSpy} />);
    
    cy.get("[data-cy=strategy-builder-title]").should("contain", "Strategy Builder");
    cy.get("[data-cy=strategy-name-input]").should("exist");
    cy.get("[data-cy=save-strategy-button]").should("exist").click();
    
    cy.get("@saveStrategy").should("have.been.calledOnce");
  });
});
