// import { mockAxios } from 'axios';
import { shallowMount } from '@vue/test-utils';
import axios from 'axios';
import LocationForm from '@/components/location/LocationForm.vue';

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

const $ml = {
  get: () => ({
    location: 'Location',
    physical_location: 'Physical location',
    edit: 'Edit location',
    delete: 'Delete location',
    create: 'Create location',
    empty_button: 'Create your first location',
    empty_description: "Creating locations, you'll be able to store and order movies and series.",
    location_required: 'The location is required',
    location_too_long: 'The location is too long',
    form_error: {
      location: "Erreur lors de l'ajout ou de la modification de l'emplacement",
    },
  }),
};

const validV = {
  $touch: () => {},
  $invalid: false,
  location: {},
};

const invalidV = {
  $touch: () => {},
  $invalid: true,
  location: {},
};


const stubs = ['md-card', 'md-card-header', 'md-card-content', 'md-snackbar',
  'md-card-actions', 'md-field', 'md-switch', 'md-input', 'md-button'];


describe('LocationForm.vue', () => {
  it('correctly loads', () => {
    const wrapper = shallowMount(LocationForm, {
      stubs,
      propsData: {
        method: 'create',
      },
      mocks: {
        $ml,
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
      mocks: {
        $ml,
      },
    });

    expect(wrapper.contains('md-card-stub')).toBe(true);
    expect(wrapper.vm.$props.method).toBe('modify');
    expect(wrapper.vm.location).toBe('test');
    expect(wrapper.vm.physical).toBe(true);
  });

  it('emits the correct event when location is saved', () => {
    const wrapper = shallowMount(LocationForm, {
      stubs,
      propsData: {
        method: 'create',
      },
      mocks: {
        $ml,
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
      mocks: {
        $ml,
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
      mocks: {
        $ml,
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
      mocks: {
        $ml,
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

  it('Correctly watches currentLocation updates', () => {
    const wrapper = shallowMount(LocationForm, {
      stubs,
      propsData: {
        method: 'modify',
        currentLocation: 'test location',
        currentPhysical: true,
      },
      mocks: {
        $ml,
      },
    });

    expect(wrapper.vm.location).toEqual('test location');
    wrapper.setProps({ currentLocation: 'updated location' });
    expect(wrapper.vm.location).toEqual('updated location');
  });

  it('Correctly watches currentPhysical updates', () => {
    const wrapper = shallowMount(LocationForm, {
      stubs,
      propsData: {
        method: 'modify',
        currentLocation: 'test location',
        currentPhysical: true,
      },
      mocks: {
        $ml,
      },
    });

    expect(wrapper.vm.physical).toEqual(true);
    wrapper.setProps({ currentPhysical: false });
    expect(wrapper.vm.physical).toEqual(false);
  });

  it('correctly saves after validating', () => {
    const wrapper = shallowMount(LocationForm, {
      stubs,
      propsData: {
        method: 'create',
      },
      mocks: {
        $ml,
        $v: validV,
      },
    });
    wrapper.vm.validateLocation();
    wrapper.vm.$nextTick(() => {
      expect(axios.mock.calls.length).toEqual(5);
      const axiosArgs = axios.mock.calls[4][0];
      expect(axiosArgs.method).toBe('post');
      expect(axiosArgs.url).toBe('http://example.com:4000/locations');
      expect(axiosArgs.headers['Content-Type']).toBe('application/json');
      expect(axiosArgs.headers.Authorization).not.toBeDefined();
      expect(axiosArgs.data.location).toEqual('');
      expect(axiosArgs.data.is_physical).toEqual(true);
    });
  });

  it('correctly detects invalid', () => {
    const wrapper = shallowMount(LocationForm, {
      stubs,
      propsData: {
        id: 42,
        method: 'modify',
      },
      mocks: {
        $ml,
        $v: invalidV,
      },
    });
    wrapper.vm.validateLocation();
    wrapper.vm.$nextTick(() => {
      expect(axios.mock.calls.length).toEqual(5);
    });
  });
});
