// import { mockAxios } from 'axios';
import { shallowMount } from '@vue/test-utils';
import axios from 'axios';
import CategoryForm from '@/components/category/CategoryForm.vue';
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

const $ml = {
  get: () => ({
    undefined: 'Undefined category',
    label: 'Label',
    description: 'Description',
    edit: 'Edit category',
    delete: 'Delete category',
    create: 'Create category',
    empty_button: 'Create your first category',
    empty_description: "Creating category, you'll be able to better organize movies and series.",
    label_required: 'The label is required',
    label_too_long: 'The label is too long',
  }),
};

const vueToken = 'thisIsAToken';

const stubs = ['md-card', 'md-card-header', 'md-card-content',
  'md-card-actions', 'md-field', 'md-switch', 'md-input', 'md-button'];


describe('CategoryForm.vue', () => {
  it('correctly loads', () => {
    const wrapper = shallowMount(CategoryForm, {
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

  it('loads the current Category on modify mode', () => {
    const wrapper = shallowMount(CategoryForm, {
      stubs,
      propsData: {
        method: 'modify',
        currentLabel: 'test category',
        currentDescription: 'test description',
      },
      mocks: {
        $ml,
      },
    });

    expect(wrapper.contains('md-card-stub')).toBe(true);
    expect(wrapper.vm.$props.method).toBe('modify');
    expect(wrapper.vm.label).toBe('test category');
    expect(wrapper.vm.description).toBe('test description');
  });

  it('generates the correct dev API urls', () => {
    const wrapper = shallowMount(CategoryForm, {
      stubs,
      propsData: {
        method: 'create',
      },
      mocks: {
        $ml,
      },
    });
    // wrapper.vm.saveLocation();
    expect(wrapper.vm.apiBaseUrl).toBe('http://example.com:4000');
    expect(wrapper.vm.authenticationRequired).toBe(false);
  });

  it('emits the correct event when category is saved', () => {
    const wrapper = shallowMount(CategoryForm, {
      stubs,
      propsData: {
        method: 'create',
      },
      mocks: {
        $ml,
      },
    });
    wrapper.vm.saveCategory();
    wrapper.vm.$nextTick(() => {
      expect(wrapper.emitted('category-added-or-modified')).toBeDefined();
    });
  });

  it('emits the correct event when category is deleted', () => {
    const wrapper = shallowMount(CategoryForm, {
      stubs,
      propsData: {
        method: 'modify',
      },
      mocks: {
        $ml,
      },
    });
    wrapper.vm.deleteCategory();
    wrapper.vm.$nextTick(() => {
      expect(wrapper.emitted('category-added-or-modified')).toBeDefined();
    });
  });

  it('sends the correct arguments when modifying a location', () => {
    const wrapper = shallowMount(CategoryForm, {
      stubs,
      propsData: {
        id: 42,
        method: 'modify',
      },
      mocks: {
        $ml,
      },
    });
    wrapper.vm.saveCategory();
    wrapper.vm.$nextTick(() => {
      const axiosArgs = axios.mock.calls[2][0];
      expect(axiosArgs.method).toBe('put');
      expect(axiosArgs.url).toBe('http://example.com:4000/categories/42');
      expect(axiosArgs.headers['Content-Type']).toBe('application/json');
      expect(axiosArgs.headers.Authorization).not.toBeDefined();
      expect(axiosArgs.data.label).not.toBeDefined();
      expect(axiosArgs.data.description).not.toBeDefined();
    });
  });

  it('sends the correct arguments when deleting a category', () => {
    const wrapper = shallowMount(CategoryForm, {
      stubs,
      propsData: {
        id: 42,
        method: 'modify',
      },
      mocks: {
        $ml,
      },
    });
    wrapper.vm.deleteCategory();
    wrapper.vm.$nextTick(() => {
      const axiosArgs = axios.mock.calls[3][0];
      expect(axiosArgs.method).toBe('delete');
      expect(axiosArgs.url).toBe('http://example.com:4000/categories/42');
      expect(axiosArgs.headers['Content-Type']).toBe('application/json');
      expect(axiosArgs.headers.Authorization).not.toBeDefined();
      expect(axiosArgs.data).not.toBeDefined();
    });
  });

  it('correctly set the authorization header', () => {
    setGlobals();
    global.window.localStorage.setItem('vue-token', vueToken);
    process.env.NODE_ENV = 'testAuthentication';
    const wrapper = shallowMount(CategoryForm, {
      stubs,
      propsData: {
        method: 'modify',
      },
      mocks: {
        'this.authenticationRequired': true,
        $ml,
      },
    });
    const headers = wrapper.vm.buildHeaders();
    expect(wrapper.vm.authenticationRequired).toBe(true);
    expect(headers.Authorization).toBe('Bearer thisIsAToken');
    expect(headers['Content-Type']).toBe('application/json');

    process.env.NODE_ENV = 'test';
  });
});
