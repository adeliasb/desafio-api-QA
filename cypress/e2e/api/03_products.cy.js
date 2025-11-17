// cypress/e2e/api/03_products.cy.js
// Testes de Produtos: 2 cenários críticos
const productsService = require("../../support/api/services/productsService");
const authFixture = require("../../fixtures/auth.json");
const productFixture = require("../../fixtures/products.json");
const authHelper = require("../../support/api/utils/authHelper");

describe("Produtos - API", () => {
  // Antes de criar produto, obtemos token de admin (se necessário)
  let adminToken = null;

  before(() => {
    // tentamos obter token com credenciais válidas da fixture
    const { email, password } = authFixture.valid;
    authHelper.getToken(email, password).then((token) => {
      adminToken = token;
    });
  });

  it("Criar produto válido deve retornar id e status 201", () => {
    const payload = productFixture.validProduct;

    productsService.create(payload, adminToken).then((resp) => {
      expect([200, 201]).to.include(resp.status);
      expect(resp.body).to.have.property("_id").or.have.property("id");
    });
  });

  it("Criar produto com dados inválidos deve retornar erro de validação", () => {
    const invalidPayload = Object.assign({}, productFixture.validProduct);
    // invalidar removendo nome
    delete invalidPayload.nome;

    productsService.create(invalidPayload, adminToken).then((resp) => {
      // esperamos um erro de validação
      expect([400, 422]).to.include(resp.status);
      expect(resp.body).to.have.property("message").or.have.property("msg");
    });
  });
});
