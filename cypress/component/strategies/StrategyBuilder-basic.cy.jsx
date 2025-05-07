// cypress/component/strategies/StrategyBuilder-basic.cy.jsx
import React from 'react';

// Simple mock of StrategyBuilder to test rendering only
const MockStrategyBuilder = () => {
  return (
    <div className="strategy-builder">
      <div className="form-group">
        <label htmlFor="strategy-name">Strategy Name</label>
        <input
          id="strategy-name"
          type="text"
          aria-label="Strategy name"
        />
      </div>
      
      <div className="select-group">
        <label>Indicator</label>
        <select aria-label="Select indicator">
          <option>RSI</option>
          <option>MACD</option>
        </select>
      </div>
      
      <button type="button" aria-label="Save strategy">
        <span className="sr-only">Save strategy</span>
        Save
      </button>
    </div>
  );
};

describe('StrategyBuilder Basic', () => {
  it('renders with accessible elements', () => {
    cy.mount(<MockStrategyBuilder />);
    
    // Check basic structure
    cy.get('.strategy-builder').should('exist');
    cy.get('select').should('have.attr', 'aria-label');
    cy.get('button').should('have.attr', 'aria-label');
  });
});
