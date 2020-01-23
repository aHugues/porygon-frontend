import requests from '@/utils/requests';
import setGlobals from '../utils/localStorage';

jest.mock('../../src/config', () => ({
  test: {
    porygonApiBaseUrl: 'http://example.com:4000',
    porygonApiAuthentication: false,
  },
}));

const mockToken = 'sample token';


describe('BuildHeaders', () => {
  beforeEach(() => jest.resetModules());

  it('Works when authentication is not required', () => {
    jest.mock('../../src/config', () => ({
      test: {
        porygonApiBaseUrl: 'http://example.com:4000',
        porygonApiAuthentication: false,
      },
    }));
    const { buildHeaders } = require('@/utils/requests').default; // eslint-disable-line global-require
    const headers = buildHeaders();
    expect(headers).toEqual({
      'Content-Type': 'application/json',
    });
  });

  it('Works when authentication is required', () => {
    setGlobals();
    global.window.localStorage.setItem('vue-token', mockToken);
    jest.mock('../../src/config', () => ({
      test: {
        porygonApiBaseUrl: 'http://example.com:4000',
        porygonApiAuthentication: true,
      },
    }));
    const { buildHeaders } = require('@/utils/requests').default; // eslint-disable-line global-require
    const headers = buildHeaders();
    expect(headers).toEqual({
      'Content-Type': 'application/json',
      Authorization: 'Bearer sample token',
    });
    process.env.NODE_ENV = 'test';
  });
});


describe('BuildOptions', () => {
  beforeEach(() => jest.resetModules());

  it('Correctly gives the options', () => {
    expect(requests.buildOptions()).toEqual({
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
  });
});


describe('BuildUrl', () => {
  it('Parses an empty resource', () => {
    expect(requests.buildUrl()).toBe('http://example.com:4000');
    expect(requests.buildUrl(null)).toBe('http://example.com:4000');
    expect(requests.buildUrl('')).toBe('http://example.com:4000');
  });

  it('Parses a normal resource', () => {
    expect(requests.buildUrl('test')).toBe('http://example.com:4000/test');
  });
});
