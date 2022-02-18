/// <reference types="cypress" />

describe("The Login Page", () => {
  it("creates user account", function () {
    performLogin({ register: true });
    checkUserLoggedIn();
    performLogout();
  });

  it("logs in user and sets session cookie", function () {
    performLogin({ register: false });
    checkUserLoggedIn();
    performLogout();
  });
});

function performLogin({ register = false }) {
  cy.visit("/");
  cy.contains("Read Jokes").click();
  cy.contains("Login").click();
  if (register) {
    cy.get('[type="radio"]').check("register");
  }
  cy.get("input[name=username]").type("Roman");
  cy.get("input[name=password]").type("strongestpasswordever");
  cy.contains("Submit").click();
}

function performLogout() {
  cy.contains("Logout").click();
  cy.contains("Hi Roman").should("not.exist");
}

function checkUserLoggedIn() {
  cy.url().should("include", "/jokes");
  cy.getCookie("RJ_session").should("exist");
  cy.contains("Hi Roman");
}

export {}
