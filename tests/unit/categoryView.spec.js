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
  get: jest.fn(() => Promise.resolve({ data: [] })),
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
    reload_button: 'Reload page',
    errored_description: 'An error has occured during loading. Please reload this page.',
    resources: {
      movies_list: 'Error loading movies list from the server',
      series_list: 'Error loading series list from the server',
      locations_list: 'Error loading locations list from the server',
      categories_list: 'Error loading categories list from the server',
    },
  }),
};

const stubs = [
  'category',
  'category-form',
  'md-button',
  'md-empty-state',
  'md-icon',
  'md-progress-spinner',
  'md-snackbar',
  'md-divider',
];

describe('CategoriesView', () => {
  it('Correctly loads', () => {
    const wrapper = shallowMount(Categories, {
      stubs,
      mocks: {
        $ml,
      },
    });
    expect(wrapper.find('.categories')).toBeDefined();
  });

  it('correctly sets the data when creating a category', async () => {
    const wrapper = shallowMount(Categories, {
      stubs,
      mocks: {
        $ml,
      },
    });

    expect(wrapper.vm.state).toEqual('loading');
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.dialogMethod).toEqual('create');
    expect(wrapper.vm.state).toEqual('empty');
    wrapper.vm.newCategory();
    expect(wrapper.vm.dialogMethod).toEqual('create');
    expect(wrapper.vm.state).toEqual('edit');
  });

  it('correctly sets the data when editing a category', async () => {
    const wrapper = shallowMount(Categories, {
      stubs,
      mocks: {
        $ml,
      },
    });

    await wrapper.vm.$nextTick();
    expect(wrapper.vm.dialogMethod).toEqual('create');
    expect(wrapper.vm.state).toEqual('empty');
    wrapper.vm.editCategory(1, 'test category', 'test description');
    expect(wrapper.vm.dialogMethod).toEqual('modify');
    expect(wrapper.vm.state).toEqual('edit');
    expect(wrapper.vm.currentId).toEqual(1);
    expect(wrapper.vm.currentLabel).toEqual('test category');
    expect(wrapper.vm.currentDescription).toEqual('test description');
  });

  it('correctly closes the category when clicking a second time', async () => {
    const wrapper = shallowMount(Categories, {
      stubs,
      mocks: {
        $ml,
      },
    });

    await wrapper.vm.$nextTick();
    wrapper.setData({
      categories: [{ id: 1, label: 'test', description: 'test' }],
    });
    expect(wrapper.vm.dialogMethod).toEqual('create');

    wrapper.vm.editCategory(1, 'test category', 'test description');
    expect(wrapper.vm.dialogMethod).toEqual('modify');
    expect(wrapper.vm.state).toEqual('edit');
    expect(wrapper.vm.currentId).toEqual(1);
    expect(wrapper.vm.currentLabel).toEqual('test category');
    expect(wrapper.vm.currentDescription).toEqual('test description');

    wrapper.vm.editCategory(1, 'test category', 'test description');
    expect(wrapper.vm.currentId).toEqual(-1);
    expect(wrapper.vm.state).toEqual('ok');
  });
});
