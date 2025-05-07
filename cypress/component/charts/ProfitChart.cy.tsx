// cypress/component/charts/ProfitChart.cy.tsx
import React from "react";
import ProfitChart from "../../../components/charts/ProfitChart";

describe("ProfitChart Component", () => {
  const mockData = [
    { date: "2025-05-01", value: 150 },
    { date: "2025-05-02", value: 220 },
    { date: "2025-05-03", value: 180 },
    { date: "2025-05-04", value: 250 },
    { date: "2025-05-05", value: 210 },
    { date: "2025-05-06", value: 290 },
    { date: "2025-05-07", value: 310 }
  ];

  it("renders the chart with correct number of bars", () => {
    cy.mount(<ProfitChart data={mockData} />);
    cy.get("[data-cy=chart-bar]").should("have.length", 7);
  });

  it("displays title and date range", () => {
    cy.mount(<ProfitChart data={mockData} title="Weekly Performance" />);
    cy.contains("Weekly Performance").should("be.visible");
    cy.get("[data-cy=chart-first-date]").should("contain", "2025-05-01");
    cy.get("[data-cy=chart-last-date]").should("contain", "2025-05-07");
  });

  it("handles negative values correctly", () => {
    const dataWithNegatives = [
      { date: "2025-05-01", value: 150 },
      { date: "2025-05-02", value: -50 },
      { date: "2025-05-03", value: 80 },
      { date: "2025-05-04", value: -120 }
    ];
    
    cy.mount(<ProfitChart data={dataWithNegatives} />);
    cy.get("[data-cy=chart-bar]").should("have.length", 4);
    cy.get("[data-value='-50']").should("exist");
    cy.get("[data-value='-120']").should("exist");
  });

  it("handles empty data gracefully", () => {
    cy.mount(<ProfitChart data={[]} />);
    cy.get("[data-cy=chart-bar]").should("not.exist");
    cy.get("[data-cy=chart-first-date]").should("not.exist");
  });
});
