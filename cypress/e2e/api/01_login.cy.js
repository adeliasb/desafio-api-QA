// cypress/e2e/api/01_login.cy.js
// Testes de Login: 2 cenários críticos
const authHelper = require("../../support/api/utils/authHelper");
const authFixture = require("../../fixtures/auth.json");

describe("Login - API", () => {
  before(() => {
    // cria usuário válido antes dos testes
    cy.request({
      method: "POST",
      url: "/usuarios",
      body: {
        nome: "Teste QA",
        email: "teste.login.qa@serverest.dev",
        password: "123456",
        administrador: "true",
      },
      failOnStatusCode: false, // evita quebra caso já exista
    });
  });

  it("Login com credenciais válidas deve retornar token e status 200", () => {
    // agora usamos o usuário criado no before()
    const email = "teste.login.qa@serverest.dev";
    const password = "123456";

    cy.request({
      method: "POST",
      url: "/login",
      body: { email, password },
      failOnStatusCode: false,
    }).then((resp) => {
      expect(resp.status).to.eq(200);
      expect(resp.body).to.have.property("authorization");
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
      expect([400, 401, 403]).to.include(resp.status);
      expect(resp.body).to.have.property("message");
    });
  });
});
