import { shallowMount } from '@vue/test-utils';
import Categories from '@/views/Categories.vue';

// jest.mock('@/components/category/Category.vue', () => {});
// jest.mock('@/components/category/CategoryForm.vue', () => {});

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
  get: jest.fn(() => Promise.resolve({ data: 3 })),
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

const stubs = [
  'category',
  'category-form',
  'md-button',
  'md-empty-state',
  'md-icon',
  'md-progress-spinner',
];

const vueToken = 'thisIsAToken';

describe('CategoriesView', () => {
  it('Correctly loads', () => {
    const wrapper = shallowMount(Categories, {
      stubs,
      mocks: {
        $ml,
      },
    });
    expect(wrapper.contains('.categories')).toBe(true);
  });

  it('correctly set the authorization header', () => {
    global.window.localStorage.setItem('vue-token', vueToken);
    process.env.NODE_ENV = 'testAuthentication';
    const wrapper = shallowMount(Categories, {
      stubs,
      mocks: {
        $ml,
      },
    });
    const headers = wrapper.vm.buildHeaders();
    expect(wrapper.vm.authenticationRequired).toBe(true);
    expect(headers.Authorization).toBe('Bearer thisIsAToken');
    expect(headers['Content-Type']).toBe('application/json');

    process.env.NODE_ENV = 'test';
  });

  it('correctly sets the data when creating a category', () => {
    const wrapper = shallowMount(Categories, {
      stubs,
      mocks: {
        $ml,
      },
    });

    expect(wrapper.vm.dialogMethod).toEqual('create');
    expect(wrapper.vm.showDialog).toEqual(false);
    wrapper.vm.newCategory();
    expect(wrapper.vm.dialogMethod).toEqual('create');
    expect(wrapper.vm.showDialog).toEqual(true);
  });

  it('correctly sets the data when editing a category', () => {
    const wrapper = shallowMount(Categories, {
      stubs,
      mocks: {
        $ml,
      },
    });

    expect(wrapper.vm.dialogMethod).toEqual('create');
    expect(wrapper.vm.showDialog).toEqual(false);
    wrapper.vm.editCategory(1, 'test category', 'test description');
    expect(wrapper.vm.dialogMethod).toEqual('modify');
    expect(wrapper.vm.showDialog).toEqual(true);
    expect(wrapper.vm.currentId).toEqual(1);
    expect(wrapper.vm.currentLabel).toEqual('test category');
    expect(wrapper.vm.currentDescription).toEqual('test description');
  });

  it('correctly closes the category when clicking a second time', () => {
    const wrapper = shallowMount(Categories, {
      stubs,
      mocks: {
        $ml,
      },
    });

    expect(wrapper.vm.dialogMethod).toEqual('create');
    expect(wrapper.vm.showDialog).toEqual(false);

    wrapper.vm.editCategory(1, 'test category', 'test description');
    expect(wrapper.vm.dialogMethod).toEqual('modify');
    expect(wrapper.vm.showDialog).toEqual(true);
    expect(wrapper.vm.currentId).toEqual(1);
    expect(wrapper.vm.currentLabel).toEqual('test category');
    expect(wrapper.vm.currentDescription).toEqual('test description');

    wrapper.vm.editCategory(1, 'test category', 'test description');
    expect(wrapper.vm.currentId).toEqual(-1);
    expect(wrapper.vm.showDialog).toEqual(false);
  });
});
