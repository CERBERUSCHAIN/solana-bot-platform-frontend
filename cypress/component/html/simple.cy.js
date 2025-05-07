// cypress/component/html/simple.cy.js
describe('HTML Test', () => {
  it('renders plain HTML', () => {
    const html = `
      <div class="container">
        <h1>Simple HTML Test</h1>
        <button id="testButton">Click Me</button>
      </div>
    `;
    
    cy.document().then(document => {
      document.body.innerHTML = html;
    });
    
    cy.get('#testButton').should('be.visible');
    cy.get('#testButton').contains('Click Me');
  });
});
