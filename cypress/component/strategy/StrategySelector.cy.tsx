// cypress/component/strategy/StrategySelector.cy.tsx
import React from "react";
import StrategySelector from "../../../components/strategy/StrategySelector";

describe("StrategySelector Component", () => {
  const mockStrategies = [
    {
      id: "strategy-1",
      name: "RSI Bounce",
      description: "Buy when RSI is oversold, sell when overbought",
      type: "MEAN_REVERSION" as const,
      performance: {
        winRate: 67,
        avgProfit: 3.5
      }
    },
    {
      id: "strategy-2",
      name: "MACD Crossover",
      description: "Buy on bullish crossover, sell on bearish",
      type: "MOMENTUM" as const,
      performance: {
        winRate: 58,
        avgProfit: 5.2
      }
    },
    {
      id: "strategy-3",
      name: "Moving Average Trend",
      description: "Follow the trend based on moving averages",
      type: "TREND_FOLLOWING" as const,
      performance: {
        winRate: 52,
        avgProfit: 7.8
      }
    }
  ];

  it("renders all strategies", () => {
    const onSelect = cy.spy().as("selectHandler");
    cy.mount(
      <StrategySelector 
        strategies={mockStrategies} 
        onSelect={onSelect}
      />
    );
    
    cy.get("[data-cy=strategy-item]").should("have.length", 3);
    cy.get("[data-cy=strategy-item]").first().should("contain", "RSI Bounce");
  });

  it("highlights selected strategy", () => {
    cy.mount(
      <StrategySelector 
        strategies={mockStrategies} 
        selectedStrategyId="strategy-2"
        onSelect={cy.spy()}
      />
    );
    
    cy.get("[data-strategy-id=strategy-2]").should("have.class", "bg-blue-600");
    cy.get("[data-strategy-id=strategy-1]").should("not.have.class", "bg-blue-600");
  });

  it("filters strategies by search term", () => {
    cy.mount(
      <StrategySelector 
        strategies={mockStrategies} 
        onSelect={cy.spy()}
      />
    );
    
    cy.get("[data-cy=strategy-search]").type("macd");
    cy.get("[data-cy=strategy-item]").should("have.length", 1);
    cy.get("[data-cy=strategy-item]").should("contain", "MACD Crossover");
    
    // Clear and try another search
    cy.get("[data-cy=strategy-search]").clear().type("trend");
    cy.get("[data-cy=strategy-item]").should("have.length", 1);
    cy.get("[data-cy=strategy-item]").should("contain", "Moving Average Trend");
    
    // Empty search should show all
    cy.get("[data-cy=strategy-search]").clear();
    cy.get("[data-cy=strategy-item]").should("have.length", 3);
  });

  it("shows 'no strategies' message when no results", () => {
    cy.mount(
      <StrategySelector 
        strategies={mockStrategies} 
        onSelect={cy.spy()}
      />
    );
    
    cy.get("[data-cy=strategy-search]").type("nonexistent");
    cy.get("[data-cy=strategy-item]").should("not.exist");
    cy.get("[data-cy=no-strategies]").should("be.visible");
  });

  it("calls onSelect when strategy is clicked", () => {
    const onSelect = cy.spy().as("selectHandler");
    cy.mount(
      <StrategySelector 
        strategies={mockStrategies} 
        onSelect={onSelect}
      />
    );
    
    cy.get("[data-strategy-id=strategy-3]").click();
    cy.get("@selectHandler").should("have.been.calledWith", "strategy-3");
  });
});
