// cypress/e2e/api/01_login.cy.js
// Testes de Login: 2 cenários críticos
const authHelper = require("../../support/api/utils/authHelper");
const authFixture = require("../../fixtures/auth.json");

describe("Login - API", () => {
  it("Login com credenciais válidas deve retornar token e status 200", () => {
    // carrega credenciais válidas da fixture
    const { email, password } = authFixture.valid;

    // usamos apiClient via authHelper
    cy.request({
      method: "POST",
      url: "/login",
      body: { email, password },
      failOnStatusCode: false,
    }).then((resp) => {
      // validações principais
      expect(resp.status).to.be.oneOf([200, 201]); // aceitar 200 ou 201 conforme API
      // serverest retorna campo 'authorization' com token
      expect(resp.body).to.have.property("authorization");
      // token não vazio
      expect(resp.body.authorization)
        .to.be.a("string")
        .and.to.have.length.greaterThan(10);
    });
  });

  it("Login com credenciais inválidas deve retornar erro (não permitir acesso)", () => {
    const { email, password } = authFixture.invalid;

    cy.request({
      method: "POST",
      url: "/login",
      body: { email, password },
      failOnStatusCode: false,
    }).then((resp) => {
      // esperamos um erro: 400 ou 401 conforme implementação
      expect([400, 401, 403]).to.include(resp.status);
      // corpo deve ter mensagem de erro
      expect(resp.body).to.have.property("message").or.have.property("msg");
    });
  });
});
