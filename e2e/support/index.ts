/// <reference types="cypress" />

import "./commands";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      register(username?: string, password?: string): Chainable<Element>;
      login(username?: string, password?: string): Chainable<Element>;
      logout(): Chainable<Element>;
    }
  }
}
