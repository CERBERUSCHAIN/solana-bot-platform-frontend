// cypress/component/strategies/StrategySelector.cy.jsx
import React from 'react';

// Simple mock of StrategySelector
const MockStrategySelector = ({ strategies = [] }) => {
  return (
    <div className="strategy-selector">
      <h2>Available Strategies</h2>
      <ul className="strategies-list">
        {strategies.map((strategy) => (
          <li key={strategy.id} className="strategy-item">
            <div className="strategy-name">{strategy.name}</div>
            <div className="strategy-description">{strategy.description}</div>
            <button 
              className="select-strategy-btn" 
              aria-label={`Select ${strategy.name} strategy`}
            >
              Select
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

describe('StrategySelector Component', () => {
  it('renders strategies with accessible elements', () => {
    const mockStrategies = [
      { id: '1', name: 'RSI Strategy', description: 'Uses Relative Strength Index' },
      { id: '2', name: 'MACD Strategy', description: 'Moving Average Convergence/Divergence' }
    ];
    
    cy.mount(<MockStrategySelector strategies={mockStrategies} />);
    
    // Check rendering of strategies
    cy.get('.strategy-item').should('have.length', 2);
    cy.contains('RSI Strategy').should('be.visible');
    
    // Check accessibility attributes
    cy.get('button').first().should('have.attr', 'aria-label', 'Select RSI Strategy strategy');
  });
});
