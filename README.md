Testes de API com Cypress

Este repositório contém a automação dos testes de API do Serverest, simulando operações comuns de um e-commerce.
A estrutura foi organizada para favorecer escalabilidade, eficiência e manutenção, permitindo expandir cenários sem perda de clareza.

1. Levantamento de cenários

A seguir está a lista completa dos cenários que considero importantes.
Os cenários marcados como automático representam os implementados conforme o desafio (2 por funcionalidade).

Login

Login com credenciais válidas — retorna token e status 200. (automático)

Login com credenciais inválidas — retorna 401 ou 400 e mensagem de erro. (automático)

Login sem preencher campos — validação de campos.

Uso do token para autorizar chamadas posteriores.

Usuários

Criar usuário válido — retorna id e status 201. (automático)

Criar usuário com email já existente — erro apropriado. (automático)

Buscar usuário por id.

Atualizar usuário.

Deletar usuário.

Produtos

Criar produto válido — retorna id e status 201. (automático)

Criar produto com dados inválidos — erro de validação. (automático)

Buscar produto por id.

Atualizar produto.

Deletar produto.

Carrinhos

Criar carrinho com produtos válidos — retorna id. (automático)

Consultar carrinho criado — deve trazer a lista de produtos. (automático)

Remover produto do carrinho.

Finalizar carrinho.

Criar carrinho com produto inexistente — erro.

2. Estrutura do projeto
   cypress/
   e2e/
   api/
   01_login.cy.js
   02_users.cy.js
   03_products.cy.js
   04_carts.cy.js
   support/
   commands.js
   e2e.js
   fixtures/
   services/
   loginService.js
   usersService.js
   productsService.js
   cartsService.js

3. Instalação
   npm install

4. Execução dos testes
   Todos os testes no Chrome

npx cypress run --browser chrome

Abrir interface interativa
npx cypress open

5. Ambiente e referências

Base URL configurada em cypress.config.js

API pública utilizada: Serverest
