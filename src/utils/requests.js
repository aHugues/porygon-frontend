import config from '../config';

const environment = process.env.NODE_ENV;

const apiBaseUrl = config[environment].porygonApiBaseUrl;
const authenticationRequired = config[environment].porygonApiAuthentication;

export default {

  buildHeaders() {
    const headers = { 'Content-Type': 'application/json' };
    if (authenticationRequired) {
      headers.Authorization = `Bearer ${localStorage.getItem('vue-user-token')}`;
    }
    return headers;
  },

  buildOptions() {
    return {
      headers: this.buildHeaders(),
      withCredentials: true,
    };
  },

  buildUrl(resource) {
    return resource ? `${apiBaseUrl}/${resource}` : apiBaseUrl;
  },

};
