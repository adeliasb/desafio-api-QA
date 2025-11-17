// cypress/support/api/index.js
// Inicialização para a camada API. Aqui podemos registrar comandos customizados
// caso sejam necessários no futuro.

Cypress.Commands.add("loginApi", (email, password) => {
  // comando utilitário que devolve a resposta do login
  return cy
    .request({
      method: "POST",
      url: "/login",
      body: { email, password },
      failOnStatusCode: false,
    })
    .then((resp) => resp);
});
