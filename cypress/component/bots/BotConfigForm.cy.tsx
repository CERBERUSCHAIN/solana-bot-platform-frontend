// cypress/component/bots/BotConfigForm.cy.tsx
import React, { useState } from "react";

function BotConfigForm({ onSubmit, initialValues = {} }) {
  const [formData, setFormData] = useState({
    name: initialValues.name || "",
    type: initialValues.type || "dca",
    description: initialValues.description || "",
    exchanges: initialValues.exchanges || ["binance"],
    tradingPair: initialValues.tradingPair || "SOL/USDT",
    // Add other fields as needed
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} data-cy="bot-config-form">
      <div className="mb-4">
        <label htmlFor="name" className="block mb-1">Bot Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          data-cy="bot-name-input"
          required
        /> aria-label="Input field"
      </div>
      
      <div className="mb-4">
        <label htmlFor="type" className="block mb-1">Bot Type</label>
        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          data-cy="bot-type-select"
        > aria-label="Selection field"
          <option value="dca">Dollar Cost Average</option>
          <option value="grid">Grid Trading</option>
          <option value="momentum">Momentum</option>
        </select>
      </div>
      
      <button 
        type="submit" 
        className="bg-blue-600 text-white px-4 py-2 rounded"
        data-cy="submit-button"
      >
        Save Configuration
      </button>
    </form>
  );
}

describe("BotConfigForm Component", () => {
  it("renders with default values", () => {
    cy.mount(<BotConfigForm onSubmit={cy.spy().as("onSubmit")} />);
    cy.get("[data-cy=bot-config-form]").should("exist");
    cy.get("[data-cy=bot-name-input]").should("have.value", "");
    cy.get("[data-cy=bot-type-select]").should("have.value", "dca");
  });
  
  it("renders with initial values", () => {
    const initialValues = {
      name: "Test Bot",
      type: "grid",
      description: "A test bot",
      exchanges: ["binance", "kraken"],
      tradingPair: "ETH/USDT"
    };
    
    cy.mount(<BotConfigForm onSubmit={cy.spy().as("onSubmit")} initialValues={initialValues} />);
    cy.get("[data-cy=bot-name-input]").should("have.value", "Test Bot");
    cy.get("[data-cy=bot-type-select]").should("have.value", "grid");
  });
  
  it("submits form data when submitted", () => {
    const onSubmit = cy.spy().as("onSubmit");
    cy.mount(<BotConfigForm onSubmit={onSubmit} />);
    
    // Fill the form
    cy.get("[data-cy=bot-name-input]").type("New Bot");
    cy.get("[data-cy=bot-type-select]").select("momentum");
    
    // Submit the form
    cy.get("[data-cy=submit-button]").click();
    
    // Check if onSubmit was called with the correct data
    cy.get("@onSubmit").should("have.been.calledOnce");
    cy.get("@onSubmit").should("have.been.calledWithMatch", {
      name: "New Bot",
      type: "momentum"
    });
  });
});

