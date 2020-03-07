export default {
  all: {
    porygonApiMinVersion: '0.5.0',
  },
  development: {
    porygonApiBaseUrl: 'http://localhost:4000/api/v1',
    porygonApiAuthentication: false,
  },
  production: {
    porygonApiBaseUrl: 'https://api.porygon.aurelienhugues.com',
    porygonApiAuthentication: true,
  },
};
