// cypress/support/api/services/usersService.js
const apiClient = require("../clients/apiClient");

const usersService = {
  create(userPayload) {
    // cria um usuário
    return apiClient.request({
      method: "POST",
      url: "/usuarios",
      body: userPayload,
      failOnStatusCode: false,
    });
  },

  getAll() {
    return apiClient.request({ method: "GET", url: "/usuarios" });
  },

  getById(id) {
    return apiClient.request({
      method: "GET",
      url: `/usuarios/${id}`,
      failOnStatusCode: false,
    });
  },
};

module.exports = usersService;
