// Gera token reutilizável para tests que precisarem de autenticação.

// cypress/support/api/utils/authHelper.js
// Funções auxiliares para autenticação

const apiClient = require("../clients/apiClient");

const authHelper = {
  // Faz o login e retorna o token
  getToken(email, password) {
    // usamos cy.wrap para manter chainability em Cypress
    return cy.wrap(null).then(() => {
      return apiClient
        .request({
          method: "POST",
          url: "/login",
          body: { email, password },
          failOnStatusCode: false,
        })
        .then((resp) => {
          // espera 200 e token na resposta
          if (resp.status === 200 && resp.body.authorization) {
            return resp.body.authorization;
          }
          // se houver falha, retorna null para o teste tratar
          return null;
        });
    });
  },
};

module.exports = authHelper;

// Comentário: getToken tenta extrair authorization (padrão do Serverest). Se não achar, devolve null.
