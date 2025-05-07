// CERBERUS Bot - Strategy Builder Component Test
// Created: 2025-05-07 05:51:30 UTC
// Author: CERBERUSCHAIN

import React from "react";
import { StrategyBuilder } from "../../../components/Strategy/StrategyBuilder";

describe("Strategy Builder Component", () => {
  it("renders correctly", () => {
    const onSaveMock = cy.stub().as("onSave");
    const onCancelMock = cy.stub().as("onCancel");
    
    cy.mount(
      <StrategyBuilder 
        onSave={onSaveMock}
        onCancel={onCancelMock}
      />
    );
    
    cy.get("[data-cy=strategy-builder]").should("be.visible");
    cy.get("[data-cy=strategy-name-input]").should("be.visible");
    cy.get("[data-cy=strategy-type-select]").should("be.visible");
    cy.get("[data-cy=timeframe-select]").should("be.visible");
  });
});
