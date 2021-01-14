export default {
  all: {
    porygonApiMinVersion: '0.6.2',
  },
  development: {
    porygonApiBaseUrl: 'http://localhost:4000/api/v1',
    authBaseUrl: 'http://localhost:4000',
    porygonApiAuthentication: true,
  },
  production: {
    porygonApiBaseUrl: 'https://api.porygon.aurelienhugues.com',
    authBaseUrl: 'https://auth.porygon.aurelienhugues.com',
    porygonApiAuthentication: true,
  },
};
