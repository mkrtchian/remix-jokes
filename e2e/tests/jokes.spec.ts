/// <reference types="cypress" />

describe("Create and display jokes", () => {
  before(() => {
    cy.register("loginUser", "strongestpasswordever");
  });

  it("creates a new joke, displays it and deleted it", function () {
    cy.visit("/jokes");
    createJoke();
    checkJokeExists();
    deleteJoke();
    checkJokeDoesNotExist();
  });
});

function createJoke() {
  cy.contains("Add your own").click();
  cy.get("input[name=name]").type("My own joke");
  cy.get("textarea[name=content]").type("My joke content.");
  cy.contains(/^Add$/).click();
}

function checkJokeExists() {
  cy.contains(/^My own joke$/).click();
  cy.contains("My joke content.").should("exist");
}

function deleteJoke() {
  cy.contains(/^My own joke$/).click();
  cy.contains("Delete").click();
}

function checkJokeDoesNotExist() {
  cy.contains("My own joke").should("not.exist");
}

export {};
