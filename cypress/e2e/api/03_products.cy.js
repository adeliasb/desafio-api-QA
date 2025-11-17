// cypress/e2e/api/03_products.cy.js

let adminToken;

describe("Products - API", () => {
  before(() => {
    const adminUser = {
      nome: "Admin Teste",
      email: `admin_${Date.now()}@serverest.dev`,
      password: "123456",
      administrador: "true",
    };

    // 1) criar usuário admin (se já existir, não quebra)
    cy.request({
      method: "POST",
      url: "/usuarios",
      body: adminUser,
      failOnStatusCode: false,
    }).then((resp) => {
      // se já existia, servidor pode devolver 400/409; aceitaremos 201 para criação nova
      if (resp.status === 201) {
        // criado com sucesso
      }

      // 2) logar com o admin criado (ou existente)
      cy.request({
        method: "POST",
        url: "/login",
        body: {
          email: adminUser.email,
          password: adminUser.password,
        },
        failOnStatusCode: false,
      }).then((loginResp) => {
        // login deve retornar 200 e um token
        expect(loginResp.status).to.eq(200);
        adminToken = loginResp.body.authorization;
      });
    });
  });

  it("Criar produto válido deve retornar id e status 201", () => {
    const payload = {
      nome: `Produto_${Date.now()}`,
      preco: 100,
      descricao: "Produto de teste",
      quantidade: 10,
    };

    cy.request({
      method: "POST",
      url: "/produtos",
      headers: {
        Authorization: adminToken,
      },
      body: payload,
      failOnStatusCode: false,
    }).then((resp) => {
      // aceitar 200 ou 201 conforme comportamento da API
      expect([200, 201]).to.include(resp.status);

      // validar id de forma segura (pode ser _id ou id)
      expect(resp.body).to.satisfy((b) => !!(b._id || b.id));
    });
  });

  it("Criar produto com dados inválidos deve retornar erro de validação", () => {
    const invalidPayload = {
      // inválido: nome em branco, preço negativo, quantidade negativa
      nome: "",
      preco: -10,
      descricao: "",
      quantidade: -5,
    };

    cy.request({
      method: "POST",
      url: "/produtos",
      headers: {
        Authorization: adminToken,
      },
      body: invalidPayload,
      failOnStatusCode: false,
    }).then((resp) => {
      // status de validação esperado
      expect([400, 422]).to.include(resp.status);

      // corpo pode vir em formatos diferentes. aceitamos qualquer um dos formatos abaixo:
      // 1) { message: "..."} ou { msg: "..." }
      // 2) objeto com chaves de validação: { nome: "...", preco: "...", ... }
      // 3) array de erros: { errors: [...] } ou diretamente [ ... ]
      const body = resp.body;

      const hasMessage = !!(body && (body.message || body.msg));
      const hasValidationKeys = !!(
        body &&
        (body.nome !== undefined ||
          body.preco !== undefined ||
          body.quantidade !== undefined)
      );
      const isErrorsArray =
        Array.isArray(body) || (body && Array.isArray(body.errors));

      expect(hasMessage || hasValidationKeys || isErrorsArray).to.equal(true);
      // se quiser, pode registrar o body no log para inspeção:
      // cy.log("Resposta de validação:", JSON.stringify(body));
    });
  });
});
