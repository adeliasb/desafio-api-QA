// cypress/support/api/services/cartsService.js
const apiClient = require("../clients/apiClient");

const cartsService = {
  create(cartPayload, token) {
    return apiClient.authRequest({
      method: "POST",
      url: "/carrinhos",
      body: cartPayload,
      token,
      failOnStatusCode: false,
    });
  },

  getById(id) {
    return apiClient.request({
      method: "GET",
      url: `/carrinhos/${id}`,
      failOnStatusCode: false,
    });
  },

  addProduct(cartId, addPayload, token) {
    // endpoint para adicionar produto ao carrinho pode variar; aqui exemplifico um padrão
    return apiClient.authRequest({
      method: "POST",
      url: `/carrinhos/${cartId}/produtos`,
      body: addPayload,
      token,
      failOnStatusCode: false,
    });
  },
};

module.exports = cartsService;

// Comentário: failOnStatusCode: false em chamadas que quero validar comportamento de erro.
