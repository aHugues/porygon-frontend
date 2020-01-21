// import { mockAxios } from 'axios';
import { shallowMount } from '@vue/test-utils';
import axios from 'axios';
import CategoryForm from '@/components/category/CategoryForm.vue';

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
    form_error: {
      category: "Erreur lors de l'ajout ou de la modification de la catégorie",
    },
  }),
};

const validV = {
  $touch: () => {},
  $invalid: false,
  label: {},
};

const invalidV = {
  $touch: () => {},
  $invalid: true,
  label: {},
};


const stubs = ['md-card', 'md-card-header', 'md-card-content', 'md-snackbar',
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

  it('Correctly watches currentLabel updates', () => {
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

    expect(wrapper.vm.label).toEqual('test category');
    wrapper.setProps({ currentLabel: 'updated category' });
    expect(wrapper.vm.label).toEqual('updated category');
  });

  it('Correctly watches currentDescription updates', () => {
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

    expect(wrapper.vm.description).toEqual('test description');
    wrapper.setProps({ currentDescription: 'updated description' });
    expect(wrapper.vm.description).toEqual('updated description');
  });

  it('correctly saves after validating', () => {
    const wrapper = shallowMount(CategoryForm, {
      stubs,
      propsData: {
        method: 'create',
      },
      mocks: {
        $ml,
        $v: validV,
      },
    });
    wrapper.vm.validateCategory();
    wrapper.vm.$nextTick(() => {
      expect(axios.mock.calls.length).toEqual(5);
      const axiosArgs = axios.mock.calls[4][0];
      expect(axiosArgs.method).toBe('post');
      expect(axiosArgs.url).toBe('http://example.com:4000/categories');
      expect(axiosArgs.headers['Content-Type']).toBe('application/json');
      expect(axiosArgs.headers.Authorization).not.toBeDefined();
      expect(axiosArgs.data.label).toEqual('');
      expect(axiosArgs.data.description).toEqual('');
    });
  });

  it('correctly detects invalid', () => {
    const wrapper = shallowMount(CategoryForm, {
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
    wrapper.vm.validateCategory();
    wrapper.vm.$nextTick(() => {
      expect(axios.mock.calls.length).toEqual(5);
    });
  });
});
