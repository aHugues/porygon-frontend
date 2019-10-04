// import { mockAxios } from 'axios';
import { shallowMount } from '@vue/test-utils';
import axios from 'axios';
import LocationForm from '@/components/location/LocationForm.vue';
import setGlobals from '../utils/localStorage';

// const mockAxios = require('../utils/axios.mock');
// import setGlobals from '../utils/localStorage';

jest.mock('../../src/config', () => ({
  test: {
    porygonApiBaseUrl: 'http://example.com:4000',
    porygonApiAuthentication: false,
  },
  testAuthentication: {
    porygonApiBaseUrl: 'http://example.com:4000',
    porygonApiAuthentication: true,
  },
}));
jest.mock('axios', () => ({
  __esModule: true,
  get: jest.fn(() => Promise.resolve({ data: 'data' })),
  default: jest.fn(request => Promise.resolve({ request, data: 'data' })),
}));

const vueToken = 'thisIsAToken';

const stubs = ['md-card', 'md-card-header', 'md-card-content',
  'md-card-actions', 'md-field', 'md-switch', 'md-input', 'md-button'];


describe('LocationForm.vue', () => {
  it('correctly loads', () => {
    const wrapper = shallowMount(LocationForm, {
      stubs,
      propsData: {
        method: 'create',
      },
    });

    expect(wrapper.contains('md-card-stub')).toBe(true);
    expect(wrapper.vm.$options.props.method.required).toBeTruthy();
    expect(wrapper.vm.$props.method).toBe('create');
  });

  it('loads the current Location on modify mode', () => {
    const wrapper = shallowMount(LocationForm, {
      stubs,
      propsData: {
        method: 'modify',
        currentPhysical: true,
        currentLocation: 'test',
      },
    });

    expect(wrapper.contains('md-card-stub')).toBe(true);
    expect(wrapper.vm.$props.method).toBe('modify');
    expect(wrapper.vm.location).toBe('test');
    expect(wrapper.vm.physical).toBe(true);
  });

  it('generates the correct dev API urls', () => {
    const wrapper = shallowMount(LocationForm, {
      stubs,
      propsData: {
        method: 'create',
      },
    });
    // wrapper.vm.saveLocation();
    expect(wrapper.vm.apiBaseUrl).toBe('http://example.com:4000');
    expect(wrapper.vm.authenticationRequired).toBe(false);
  });

  it('emits the correct event when location is saved', () => {
    const wrapper = shallowMount(LocationForm, {
      stubs,
      propsData: {
        method: 'create',
      },
    });
    wrapper.vm.saveLocation();
    wrapper.vm.$nextTick(() => {
      expect(wrapper.emitted('location-added-or-modified')).toBeDefined();
    });
  });

  it('emits the correct event when location is deleted', () => {
    const wrapper = shallowMount(LocationForm, {
      stubs,
      propsData: {
        method: 'modify',
      },
    });
    wrapper.vm.deleteLocation();
    wrapper.vm.$nextTick(() => {
      expect(wrapper.emitted('location-added-or-modified')).toBeDefined();
    });
  });

  it('sends the correct arguments when modifying a location', () => {
    const wrapper = shallowMount(LocationForm, {
      stubs,
      propsData: {
        id: 42,
        method: 'modify',
      },
    });
    wrapper.vm.saveLocation();
    wrapper.vm.$nextTick(() => {
      const axiosArgs = axios.mock.calls[2][0];
      expect(axiosArgs.method).toBe('put');
      expect(axiosArgs.url).toBe('http://example.com:4000/locations/42');
      expect(axiosArgs.headers['Content-Type']).toBe('application/json');
      expect(axiosArgs.headers.Authorization).not.toBeDefined();
      expect(axiosArgs.data.location).not.toBeDefined();
      expect(axiosArgs.data.is_physical).toBe(false);
    });
  });

  it('sends the correct arguments when deleting a location', () => {
    const wrapper = shallowMount(LocationForm, {
      stubs,
      propsData: {
        id: 42,
        method: 'modify',
      },
    });
    wrapper.vm.deleteLocation();
    wrapper.vm.$nextTick(() => {
      const axiosArgs = axios.mock.calls[3][0];
      expect(axiosArgs.method).toBe('delete');
      expect(axiosArgs.url).toBe('http://example.com:4000/locations/42');
      expect(axiosArgs.headers['Content-Type']).toBe('application/json');
      expect(axiosArgs.headers.Authorization).not.toBeDefined();
      expect(axiosArgs.data).not.toBeDefined();
    });
  });

  it('correctly set the authorization header', () => {
    setGlobals();
    global.window.localStorage.setItem('vue-token', vueToken);
    process.env.NODE_ENV = 'testAuthentication';
    const wrapper = shallowMount(LocationForm, {
      stubs,
      propsData: {
        method: 'modify',
      },
      mocks: {
        'this.authenticationRequired': true,
      },
    });
    const headers = wrapper.vm.buildHeaders();
    expect(wrapper.vm.authenticationRequired).toBe(true);
    expect(headers.Authorization).toBe('Bearer thisIsAToken');
    expect(headers['Content-Type']).toBe('application/json');

    process.env.NODE_ENV = 'test';
  });
});
