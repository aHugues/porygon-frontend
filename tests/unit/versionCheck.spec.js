import { shallowMount } from '@vue/test-utils';
import VersionCheck from '@/components/misc/VersionCheck.vue';

jest.mock('../../src/config', () => ({
  all: {
    porygonApiMinVersion: '1.2.3',
  },
  test: {
    porygonApiBaseUrl: 'http://example.com:4000',
    porygonApiAuthentication: false,
  },
  testAuthentication: {
    porygonApiBaseUrl: 'http://example.com:4000',
    porygonApiAuthentication: true,
  },
}));

jest.mock('axios');
const axios = require('axios');

const $ml = {
  get: () => ({
    status_check: {
      waiting: 'Status check pending...',
      version_ok: 'Version {0}: OK',
      version_error: 'Expecting min version {0} but found version {1}',
      version_checking_error: 'Impossible to get version from the server.',
    },
  }),
};

const stubs = ['md-card', 'md-card-header', 'md-card-content'];


describe('VersionCheckComponent', () => {
  it('Correctly loads', () => {
    const wrapper = shallowMount(VersionCheck, {
      stubs,
      mocks: {
        $ml,
      },
    });
    expect(wrapper.contains('.md-title')).toBe(true);
  });

  it('correctly inits the component', async () => {
    axios.get.mockImplementation(() => Promise.resolve({ headers: { 'porygon-api-version': '1.2.3' } }));
    const wrapper = shallowMount(VersionCheck, {
      stubs,
      mocks: {
        $ml,
      },
    });
    expect(wrapper.vm.pageState).toBe(wrapper.vm.state.LOADING);
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.pageState).toBe(wrapper.vm.state.VALID);
  });

  it('correctly inits the component on wrong version', async () => {
    axios.get.mockImplementation(() => Promise.resolve({ headers: { 'porygon-api-version': '0.1' } }));
    const wrapper = shallowMount(VersionCheck, {
      stubs,
      mocks: {
        $ml,
      },
    });
    expect(wrapper.vm.pageState).toBe(wrapper.vm.state.LOADING);
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.pageState).toBe(wrapper.vm.state.VERSION_MISMATCH);
  });

  it('correctly parses version numbers', () => {
    const wrapper = shallowMount(VersionCheck, {
      stubs,
      mocks: {
        $ml,
      },
    });
    expect(wrapper.vm.parseVersionNumber('1.2.3')).toEqual([1, 2, 3]);
    expect(wrapper.vm.parseVersionNumber('1.2')).toEqual([1, 2, 0]);
    expect(wrapper.vm.parseVersionNumber('1')).toEqual([1, 0, 0]);
    expect(wrapper.vm.parseVersionNumber('v1')).toEqual([1, 0, 0]);
  });

  it('correctly checks the validity of version', () => {
    const wrapper = shallowMount(VersionCheck, {
      stubs,
      mocks: {
        $ml,
      },
    });
    expect(wrapper.vm.isVersionValid('1.2.3', '1.2.3')).toBe(true);
    expect(wrapper.vm.isVersionValid('1.2', '1.2.3')).toBe(true);
    expect(wrapper.vm.isVersionValid('1', '1.2.3')).toBe(true);
    expect(wrapper.vm.isVersionValid('1.2', '0.1.3')).toBe(false);
  });

  it('correctly gets the version', (done) => {
    axios.get.mockImplementation(() => Promise.resolve({ headers: { 'porygon-api-version': '1.2.3' } }));
    const wrapper = shallowMount(VersionCheck, {
      stubs,
      mocks: {
        $ml,
      },
    });
    wrapper.vm.getApiVersion().then(() => {
      const axiosCall = axios.get.mock.calls[0];
      expect(axiosCall[0]).toBe('http://example.com:4000');
      expect(axiosCall[1]).toEqual({ headers: { 'Content-Type': 'application/json' }, withCredentials: true });
      expect(wrapper.vm.distantVersion).toEqual('1.2.3');
      done();
    });
  });

  it('correctly raises an error', (done) => {
    axios.get.mockImplementation(() => Promise.reject(Error('test')));
    const wrapper = shallowMount(VersionCheck, {
      stubs,
      mocks: {
        $ml,
      },
    });
    wrapper.vm.getApiVersion().catch(() => {
      const axiosCall = axios.get.mock.calls[0];
      expect(axiosCall[0]).toBe('http://example.com:4000');
      expect(axiosCall[1]).toEqual({ headers: { 'Content-Type': 'application/json' }, withCredentials: true });
      expect(wrapper.emitted('server-version-error')).toBeDefined();
      done();
    });
  });

  it('correctly displays the valid value for version check', () => {
    const wrapper = shallowMount(VersionCheck, {
      stubs,
      mocks: {
        $ml,
      },
    });
    wrapper.setData({ pageState: wrapper.vm.state.VALID });
    expect(wrapper.vm.displayStatusCheckValue()).toBe('Version 1.2.3: OK');
  });

  it('correctly displays the invalid value for version check', () => {
    const wrapper = shallowMount(VersionCheck, {
      stubs,
      mocks: {
        $ml,
      },
    });
    wrapper.setData({ pageState: wrapper.vm.state.VERSION_MISMATCH, distantVersion: '1.1' });
    expect(wrapper.vm.displayStatusCheckValue()).toBe('Expecting min version 1.2.3 but found version 1.1');
  });

  it('correctly displays the error value for version check', () => {
    const wrapper = shallowMount(VersionCheck, {
      stubs,
      mocks: {
        $ml,
      },
    });
    wrapper.setData({ pageState: wrapper.vm.state.ERROR });
    expect(wrapper.vm.displayStatusCheckValue()).toBe('Impossible to get version from the server.');
  });

  it('correctly displays the loading value for version check', () => {
    const wrapper = shallowMount(VersionCheck, {
      stubs,
      mocks: {
        $ml,
      },
    });
    expect(wrapper.vm.displayStatusCheckValue()).toBe('');
  });
});
