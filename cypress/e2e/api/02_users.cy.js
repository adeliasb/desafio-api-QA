// cypress/e2e/api/02_users.cy.js
// Testes de Usuários: 2 cenários críticos
const usersService = require("../../support/api/services/usersService");
const authFixture = require("../../fixtures/auth.json");
const userFixture = require("../../fixtures/users.json");
const authHelper = require("../../support/api/utils/authHelper");

describe("Usuários - API", () => {
  it("Criar usuário válido deve retornar id e status 201", () => {
    // criar email dinâmico para evitar conflito
    const timestamp = Date.now();
    const payload = Object.assign({}, userFixture.newUser);
    payload.email = payload.email.replace("{{timestamp}}", timestamp);

    usersService.create(payload).then((resp) => {
      // esperar 201 ou 200 dependendo da API
      expect([200, 201]).to.include(resp.status);
      // validar que retornou id
      expect(resp.body).to.have.property("_id").or.have.property("id");
    });
  });

  it("Criar usuário com email já existente deve retornar erro", () => {
    // primeiro cria um usuário
    const timestamp = Date.now();
    const payload = Object.assign({}, userFixture.newUser);
    payload.email = payload.email.replace("{{timestamp}}", timestamp);

    usersService.create(payload).then((respCreate) => {
      expect([200, 201]).to.include(respCreate.status);

      // tentar criar igual novamente (mesmo email) -> espera erro
      usersService.create(payload).then((respRetry) => {
        expect([400, 401, 409]).to.include(respRetry.status);
        // validar mensagem de erro presente
        expect(respRetry.body)
          .to.have.property("message")
          .or.have.property("msg");
      });
    });
  });
});
