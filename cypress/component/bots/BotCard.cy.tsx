// cypress/component/bots/BotCard.cy.tsx
import React from "react";
import BotCard from "../../../components/bots/BotCard";

describe("BotCard Component", () => {
  const mockBot = {
    id: "bot-123",
    name: "DCA Bitcoin",
    type: "dca",
    tradingPair: "BTC/USDT",
    exchange: "binance",
    status: "active" as const,
    profit: 245.75,
    profitPercentage: 12.3
  };

  it("renders bot information correctly", () => {
    cy.mount(<BotCard bot={mockBot} />);
    cy.get("[data-cy=bot-name]").should("contain", "DCA Bitcoin");
    cy.get("[data-cy=bot-status]").should("contain", "active");
    cy.get("[data-cy=bot-pair]").should("contain", "BTC/USDT • binance");
    cy.get("[data-cy=bot-profit]").should("contain", "+245.75 USD");
    cy.get("[data-cy=bot-profit]").should("contain", "+12.30%");
  });

  it("handles click events", () => {
    const onClick = cy.spy().as("clickHandler");
    cy.mount(<BotCard bot={mockBot} onClick={onClick} />);
    
    cy.get("[data-cy=bot-card]").click();
    cy.get("@clickHandler").should("have.been.calledWith", "bot-123");
  });

  it("shows different status styles", () => {
    // Test for paused bot
    const pausedBot = { ...mockBot, status: "paused" as const };
    cy.mount(<BotCard bot={pausedBot} />);
    cy.get("[data-cy=bot-status]")
      .should("contain", "paused")
      .should("have.class", "bg-yellow-500");
    
    // Test for stopped bot
    const stoppedBot = { ...mockBot, status: "stopped" as const };
    cy.mount(<BotCard bot={stoppedBot} />);
    cy.get("[data-cy=bot-status]")
      .should("contain", "stopped")
      .should("have.class", "bg-red-500");
  });

  it("displays negative profit correctly", () => {
    const losingBot = { ...mockBot, profit: -125.50, profitPercentage: -6.25 };
    cy.mount(<BotCard bot={losingBot} />);
    cy.get("[data-cy=bot-profit]")
      .should("contain", "-125.50 USD")
      .should("contain", "-6.25%")
      .should("have.class", "text-red-400");
  });
});
