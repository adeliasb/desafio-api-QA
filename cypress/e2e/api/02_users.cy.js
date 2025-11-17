// cypress/e2e/api/02_users.cy.js

describe("Users - API", () => {
  it("Criar usuário válido deve retornar id e status 201", () => {
    const novo = {
      nome: "Novo Usuario",
      email: `user_${Date.now()}@serverest.dev`,
      password: "123456",
      administrador: "true",
    };

    cy.request({
      method: "POST",
      url: "/usuarios",
      body: novo,
      failOnStatusCode: false,
    }).then((resp) => {
      expect(resp.status).to.eq(201);

      // A API pode retornar _id ou id, então verificamos os dois de forma segura
      expect(resp.body).to.satisfy((body) => body._id || body.id);
    });
  });

  it("Criar usuário com email já existente deve retornar erro", () => {
    const emailFixo = `duplicado_${Date.now()}@serverest.dev`;

    const baseUser = {
      nome: "Teste Duplicado",
      email: emailFixo,
      password: "123456",
      administrador: "true",
    };

    // primeiro cria o usuário
    cy.request({
      method: "POST",
      url: "/usuarios",
      body: baseUser,
      failOnStatusCode: false,
    }).then((resp) => {
      // a primeira criação deve ser 201
      expect(resp.status).to.eq(201);

      // tenta criar novamente
      cy.request({
        method: "POST",
        url: "/usuarios",
        body: baseUser,
        failOnStatusCode: false,
      }).then((respRetry) => {
        expect([400, 401, 409]).to.include(respRetry.status);

        // valida que existe alguma chave de erro
        expect(respRetry.body).to.satisfy((b) => b.message || b.msg);
      });
    });
  });
});
