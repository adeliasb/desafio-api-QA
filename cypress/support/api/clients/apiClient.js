// Encapsula cy.request para centralizar headers, retries etc.
// cypress/support/api/clients/apiClient.js
// Cliente HTTP genérico que encapsula cy.request
// Permite adicionar headers padrão, tratar erros e reutilizar lógica.

const apiClient = {
  request({
    method = "GET",
    url,
    body = null,
    headers = {},
    failOnStatusCode = false,
  }) {
    // montamos a opção de request do Cypress
    const options = {
      method,
      url,
      headers,
      body,
      failOnStatusCode,
    };
    // Retornamos a promise do Cypress (chainable)
    return cy.request(options).then((response) => {
      return response;
    });
  },

  // helper para chamadas autenticadas usando token
  authRequest({
    method = "GET",
    url,
    body = null,
    token,
    failOnStatusCode = false,
  }) {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    return this.request({ method, url, body, headers, failOnStatusCode });
  },
};

module.exports = apiClient;
