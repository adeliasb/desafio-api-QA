// cypress/e2e/api/04_carts.cy.js

let adminToken;
let productId;
let cartId;

describe("Carts - API", () => {
  before(() => {
    const adminUser = {
      nome: "Admin Carrinho",
      email: `admin_cart_${Date.now()}@serverest.dev`,
      password: "123456",
      administrador: "true",
    };

    // cria admin
    cy.request({
      method: "POST",
      url: "/usuarios",
      body: adminUser,
      failOnStatusCode: false,
    }).then(() => {
      // login
      cy.request({
        method: "POST",
        url: "/login",
        body: {
          email: adminUser.email,
          password: adminUser.password,
        },
        failOnStatusCode: false,
      }).then((loginResp) => {
        expect(loginResp.status).to.eq(200);
        adminToken = loginResp.body.authorization;

        // cria produto
        const product = {
          nome: `Produto_Carrinho_${Date.now()}`,
          preco: 150,
          descricao: "Produto para testes de carrinho",
          quantidade: 50,
        };

        cy.request({
          method: "POST",
          url: "/produtos",
          headers: { Authorization: adminToken },
          body: product,
          failOnStatusCode: false,
        }).then((pResp) => {
          expect([200, 201]).to.include(pResp.status);
          productId = pResp.body._id || pResp.body.id;
          expect(productId).to.exist;
        });
      });
    });
  });

  it("Criar carrinho com produtos válidos deve retornar id do carrinho", () => {
    const cartPayload = {
      produtos: [
        {
          idProduto: productId,
          quantidade: 2,
        },
      ],
    };

    cy.request({
      method: "POST",
      url: "/carrinhos",
      headers: { Authorization: adminToken },
      body: cartPayload,
      failOnStatusCode: false,
    }).then((resp) => {
      expect([200, 201]).to.include(resp.status);

      cartId = resp.body.carrinho || resp.body._id || resp.body.id;
      expect(cartId).to.exist;
    });
  });

  it("Consultar carrinho criado deve retornar lista de produtos", () => {
    cy.request({
      method: "GET",
      url: `/carrinhos/${cartId}`,
      headers: { Authorization: adminToken },
      failOnStatusCode: false,
    }).then((resp) => {
      expect(resp.status).to.eq(200);
      expect(resp.body).to.have.property("produtos");
      expect(resp.body.produtos.length).to.be.greaterThan(0);
    });
  });
});
