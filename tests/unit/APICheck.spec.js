import { shallowMount } from '@vue/test-utils';
import ApiCheck from '@/components/misc/ApiCheck.vue';

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

const dataValid = {
  ApiVersion: '1.2.3',
  database: {
    status: true,
  },
  keycloak: {
    used: true,
    status: true,
  },
};

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

const stubs = ['md-card', 'md-card-header', 'md-card-content', 'md-icon', 'status-check'];


describe('VersionCheckComponent', () => {
  it('Correctly loads', () => {
    const wrapper = shallowMount(ApiCheck, {
      stubs,
      mocks: {
        $ml,
      },
    });
    expect(wrapper.contains('.md-title')).toBe(true);
    expect(wrapper.vm.getClass()).toBe('check-waiting');
    expect(wrapper.vm.getIconName()).toBe('pause_circle_filled');
  });

  it('correctly inits the component', async () => {
    axios.get.mockImplementation(() => Promise.resolve({ data: dataValid }));
    const wrapper = shallowMount(ApiCheck, {
      stubs,
      mocks: {
        $ml,
      },
    });
    expect(wrapper.vm.pageState).toBe(wrapper.vm.state.LOADING);
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.apiReachableStatus).toBe(wrapper.vm.status.VALID);
    expect(wrapper.vm.apiVersionStatus).toBe(wrapper.vm.status.VALID);
    expect(wrapper.vm.authenticationStatus).toBe(wrapper.vm.status.VALID);
    expect(wrapper.vm.databaseStatus).toBe(wrapper.vm.status.VALID);
    expect(wrapper.vm.pageState).toBe(wrapper.vm.state.VALID);
    expect(wrapper.vm.getClass()).toBe('check-valid');
    expect(wrapper.vm.getIconName()).toBe('check_circle');
  });

  it('correctly inits the component on wrong version', async () => {
    const mockData = JSON.parse(JSON.stringify(dataValid));
    mockData.ApiVersion = '0.1';
    axios.get.mockImplementation(() => Promise.resolve({ data: mockData }));
    const wrapper = shallowMount(ApiCheck, {
      stubs,
      mocks: {
        $ml,
      },
    });
    expect(wrapper.vm.pageState).toBe(wrapper.vm.state.LOADING);
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.pageState).toBe(wrapper.vm.state.ERROR);
    expect(wrapper.vm.getClass()).toBe('check-error');
    expect(wrapper.vm.getIconName()).toBe('remove_circle');
  });

  it('correctly inits the component on database error', async () => {
    const mockData = JSON.parse(JSON.stringify(dataValid));
    mockData.database.status = false;
    axios.get.mockImplementation(() => Promise.resolve({ data: mockData }));
    const wrapper = shallowMount(ApiCheck, {
      stubs,
      mocks: {
        $ml,
      },
    });
    expect(wrapper.vm.pageState).toBe(wrapper.vm.state.LOADING);
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.pageState).toBe(wrapper.vm.state.ERROR);
    expect(wrapper.vm.getClass()).toBe('check-error');
    expect(wrapper.vm.getIconName()).toBe('remove_circle');
  });

  it('correctly inits the component on keycloak ok, but not required', async () => {
    const mockData = JSON.parse(JSON.stringify(dataValid));
    mockData.keycloak.status = true;
    mockData.keycloak.used = false;
    axios.get.mockImplementation(() => Promise.resolve({ data: mockData }));
    const wrapper = shallowMount(ApiCheck, {
      stubs,
      mocks: {
        $ml,
      },
    });
    expect(wrapper.vm.pageState).toBe(wrapper.vm.state.LOADING);
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.pageState).toBe(wrapper.vm.state.VALID);
    expect(wrapper.vm.getClass()).toBe('check-valid');
    expect(wrapper.vm.getIconName()).toBe('check_circle');
  });

  it('correctly inits the component on keycloak error', async () => {
    const mockData = JSON.parse(JSON.stringify(dataValid));
    mockData.keycloak.status = false;
    axios.get.mockImplementation(() => Promise.resolve({ data: mockData }));
    const wrapper = shallowMount(ApiCheck, {
      stubs,
      mocks: {
        $ml,
      },
    });
    expect(wrapper.vm.pageState).toBe(wrapper.vm.state.LOADING);
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.pageState).toBe(wrapper.vm.state.ERROR);
    expect(wrapper.vm.getClass()).toBe('check-error');
    expect(wrapper.vm.getIconName()).toBe('remove_circle');
  });

  it('correctly inits the component on keycloak error, but not required', async () => {
    const mockData = JSON.parse(JSON.stringify(dataValid));
    mockData.keycloak.status = false;
    mockData.keycloak.used = false;
    axios.get.mockImplementation(() => Promise.resolve({ data: mockData }));
    const wrapper = shallowMount(ApiCheck, {
      stubs,
      mocks: {
        $ml,
      },
    });
    expect(wrapper.vm.pageState).toBe(wrapper.vm.state.LOADING);
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.pageState).toBe(wrapper.vm.state.VALID);
    expect(wrapper.vm.getClass()).toBe('check-valid');
    expect(wrapper.vm.getIconName()).toBe('check_circle');
  });

  it('correctly parses version numbers', () => {
    const wrapper = shallowMount(ApiCheck, {
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
    const wrapper = shallowMount(ApiCheck, {
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
    axios.get.mockImplementation(() => Promise.resolve({ data: dataValid }));
    const wrapper = shallowMount(ApiCheck, {
      stubs,
      mocks: {
        $ml,
      },
    });
    wrapper.vm.checkAPI().then(() => {
      const axiosCall = axios.get.mock.calls[0];
      expect(axiosCall[0]).toBe('http://example.com:4000/healthcheck');
      expect(axiosCall[1]).toEqual({ headers: { 'Content-Type': 'application/json' }, withCredentials: true });
      done();
    });
  });

  it('correctly raises an error', (done) => {
    axios.get.mockImplementation(() => Promise.reject(Error('test')));
    const wrapper = shallowMount(ApiCheck, {
      stubs,
      mocks: {
        $ml,
      },
    });
    wrapper.vm.checkAPI().catch(() => {
      const axiosCall = axios.get.mock.calls[0];
      expect(axiosCall[0]).toBe('http://example.com:4000/healthcheck');
      expect(axiosCall[1]).toEqual({ headers: { 'Content-Type': 'application/json' }, withCredentials: true });
      expect(wrapper.emitted('server-version-error')).toBeDefined();
      done();
    });
  });
});
