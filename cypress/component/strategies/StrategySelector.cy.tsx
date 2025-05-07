// cypress/component/strategies/StrategySelector.cy.tsx
import React from 'react';
import StrategySelector from '../../../src/components/strategy/StrategySelector';

describe('StrategySelector Component', () => {
  const mockStrategies = [
    { id: '1', name: 'RSI Overbought', description: 'Alerts when RSI is overbought' },
    { id: '2', name: 'MACD Crossover', description: 'Alerts on MACD crossover signal' }
  ];

  it('renders the list of strategies', () => {
    const selectSpy = cy.spy().as('selectStrategy');
    
    cy.mount(
      <StrategySelector 
        strategies={mockStrategies}
        onSelect={selectSpy}
      />
    );
    
    // Check strategies are rendered
    cy.contains('RSI Overbought').should('exist');
    cy.contains('MACD Crossover').should('exist');
  });
  
  // Additional tests...
});
