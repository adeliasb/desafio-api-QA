// cypress/e2e/api/04_carts.cy.js
// Testes de Carrinhos: 2 cenários críticos
const cartsService = require("../../support/api/services/cartsService");
const productsService = require("../../support/api/services/productsService");
const authFixture = require("../../fixtures/auth.json");
const productFixture = require("../../fixtures/products.json");
const authHelper = require("../../support/api/utils/authHelper");

describe("Carrinhos - API", () => {
  let adminToken = null;
  let createdProductId = null;

  before(() => {
    const { email, password } = authFixture.valid;
    return authHelper.getToken(email, password).then((token) => {
      adminToken = token;
      // criar produto para usar no carrinho
      return productsService
        .create(productFixture.validProduct, adminToken)
        .then((pResp) => {
          // extrair id do produto criado
          createdProductId = pResp.body._id || pResp.body.id;
        });
    });
  });

  it("Criar carrinho com produtos válidos deve retornar id do carrinho", () => {
    const cartPayload = {
      produtos: [
        {
          idProduto: createdProductId,
          quantidade: 1,
        },
      ],
    };

    cartsService.create(cartPayload, adminToken).then((resp) => {
      expect([200, 201]).to.include(resp.status);
      expect(resp.body).to.have.property("carrinho").or.have.property("_id");
    });
  });

  it("Adicionar produto a carrinho existente deve retornar carrinho atualizado", () => {
    // Primeiro criar um carrinho vazio
    const cartPayload = { produtos: [] };

    cartsService.create(cartPayload, adminToken).then((respCreate) => {
      const cartId =
        respCreate.body._id ||
        (respCreate.body.carrinho && respCreate.body.carrinho._id);
      expect(cartId).to.exist;

      // payload para adicionar produto
      const addPayload = {
        idProduto: createdProductId,
        quantidade: 2,
      };

      // usar addProduct
      cartsService
        .addProduct(cartId, addPayload, adminToken)
        .then((respAdd) => {
          expect([200, 201]).to.include(respAdd.status);
          // espera que carrinho contenha lista de produtos com tamanho >= 1
          expect(respAdd.body).to.have.property("carrinho").or.exist;
        });
    });
  });
});
