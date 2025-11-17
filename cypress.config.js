// cypress.config.js
const { defineConfig } = require("cypress");
const fs = require("fs");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://serverest.dev", // URL base da API de teste
    specPattern: "cypress/e2e/api/*.cy.js", // padrão dos arquivos de teste
    supportFile: "cypress/support/e2e.js", // arquivo de suporte global
    setupNodeEvents(on, config) {
      // task para salvar arquivos via node (útil para relatórios ou artefatos)
      on("task", {
        writeFile({ filename, data }) {
          fs.writeFileSync(filename, data);
          return null;
        },
      });
    },
  },
  reporter: "mochawesome",
  reporterOptions: {
    reportDir: "cypress/reports",
    overwrite: false,
    html: true,
    json: true,
  },
});
