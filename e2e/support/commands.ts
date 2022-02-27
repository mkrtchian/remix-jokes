/// <reference types="cypress" />
import "@testing-library/cypress/add-commands";

Cypress.Commands.add(
  "login",
  (username = "Roman", password = "strongestpasswordever") => {
    performLogin({ register: false, username, password });
  }
);

Cypress.Commands.add(
  "register",
  (username = "Roman", password = "strongestpasswordever") => {
    performLogin({ register: true, username, password });
  }
);

type PerformLogin = {
  username: string;
  password: string;
  register?: boolean;
};

function performLogin({ username, password, register = false }: PerformLogin) {
  cy.visit("/login");
  if (register) {
    cy.get('[type="radio"]').check("register");
  }
  cy.findByLabelText("Username").type(username);
  cy.findByLabelText("Password").type(password);
  cy.contains("Submit").click();
  checkUserLoggedIn(username);
}

function checkUserLoggedIn(username: string) {
  cy.url().should("include", "/jokes");
  cy.getCookie("RJ_session").should("exist");
  cy.contains(`Hi ${username}`).should("exist");
}

Cypress.Commands.add("logout", () => {
  cy.contains("Logout").click();
  cy.contains("Hi Roman").should("not.exist");
});

export {};
