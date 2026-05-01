export const environment = {
  production: false,
  apiUrl: 'http://localhost', // API direta no localhost sem prefixo /api
  keycloak: {
    url: 'http://localhost/auth',
    realm: 'financial-app',
    clientId: 'backend'
  }
};
