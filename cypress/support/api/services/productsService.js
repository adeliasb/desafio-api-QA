// cypress/support/api/services/productsService.js
const apiClient = require("../clients/apiClient");

const productsService = {
  create(productPayload, token) {
    // criar produto requer token de administrador possivelmente
    return apiClient.authRequest({
      method: "POST",
      url: "/produtos",
      body: productPayload,
      token,
      failOnStatusCode: false,
    });
  },

  getAll() {
    return apiClient.request({ method: "GET", url: "/produtos" });
  },

  getById(id) {
    return apiClient.request({
      method: "GET",
      url: `/produtos/${id}`,
      failOnStatusCode: false,
    });
  },

  delete(id, token) {
    return apiClient.authRequest({
      method: "DELETE",
      url: `/produtos/${id}`,
      token,
      failOnStatusCode: false,
    });
  },
};

module.exports = productsService;
