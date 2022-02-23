/// <reference types="cypress" />

describe("The Login Page", () => {
  it("creates user account", function () {
    cy.register();
    cy.logout();
  });

  it("logs in user and sets session cookie", function () {
    cy.login();
    cy.logout();
  });
});

export {};
