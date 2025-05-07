// cypress/component/ui/NotificationToast.cy.tsx
import React from "react";

function NotificationToast({ title, message, type = "info", onClose }) {
  const typeClasses = {
    info: "bg-blue-100 border-blue-500 text-blue-700",
    success: "bg-green-100 border-green-500 text-green-700",
    warning: "bg-yellow-100 border-yellow-500 text-yellow-700",
    error: "bg-red-100 border-red-500 text-red-700"
  };
  
  return (
    <div 
      className={`p-4 rounded border-l-4 flex justify-between items-center ${typeClasses[type]}`}
      data-cy="notification-toast"
      role="alert"
    >
      <div>
        <h3 className="font-bold" data-cy="notification-title">{title}</h3>
        <p data-cy="notification-message">{message}</p>
      </div>
      <button 
        onClick={onClose} 
        className="text-gray-500 hover:text-gray-700"
        data-cy="notification-close"
        aria-label="Close"
      >
        ×
      </button>
    </div>
  );
}

describe("NotificationToast Component", () => {
  it("renders with default type (info)", () => {
    cy.mount(
      <NotificationToast 
        title="Info Notification" 
        message="This is an information message" 
        onClose={cy.spy().as("onClose")} 
      />
    );
    cy.get("[data-cy=notification-toast]").should("exist");
    cy.get("[data-cy=notification-toast]").should("have.class", "bg-blue-100");
    cy.get("[data-cy=notification-title]").should("have.text", "Info Notification");
    cy.get("[data-cy=notification-message]").should("have.text", "This is an information message");
  });
  
  it("renders with success type", () => {
    cy.mount(
      <NotificationToast 
        title="Success!" 
        message="Operation completed successfully" 
        type="success" 
        onClose={cy.spy().as("onClose")} 
      />
    );
    cy.get("[data-cy=notification-toast]").should("have.class", "bg-green-100");
  });
  
  it("calls onClose when close button is clicked", () => {
    const onClose = cy.spy().as("onClose");
    cy.mount(
      <NotificationToast 
        title="Closable Notification" 
        message="Click the X to close" 
        onClose={onClose} 
      />
    );
    cy.get("[data-cy=notification-close]").click();
    cy.get("@onClose").should("have.been.calledOnce");
  });
});
