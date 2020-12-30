import { shallowMount } from '@vue/test-utils';
import Movies from '@/views/Movies.vue';
import setGlobals from '../utils/localStorage';

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

const localStorageLight = {
  'vue-user-theme': 'porygon-light',
};

const localStorageDark = {
  'vue-user-theme': 'porygon-dark',
};

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
  'movie',
  'movie-form',
  'md-button',
  'md-empty-state',
  'md-progress-spinner',
  'md-divider',
  'md-list-item',
  'md-icon',
  'md-list',
  'md-snackbar',
];

describe('MoviesView', () => {
  it('Correctly loads', () => {
    const wrapper = shallowMount(Movies, {
      stubs,
      mocks: {
        $ml,
      },
    });
    expect(wrapper.find('.movies')).toBeDefined();
  });

  it('Gets the correct class for drawer on light theme', () => {
    setGlobals();
    Object.keys(localStorageLight).forEach((key) => {
      global.window.localStorage.setItem(key, localStorageLight[key]);
    });
    const wrapper = shallowMount(Movies, {
      stubs,
      mocks: {
        $ml,
      },
    });
    expect(wrapper.vm.rightDrawerBorderClass).toBe('right-filter-drawer-light');
  });

  it('Gets the correct class for drawer on dark theme', () => {
    setGlobals();
    Object.keys(localStorageDark).forEach((key) => {
      global.window.localStorage.setItem(key, localStorageDark[key]);
    });
    const wrapper = shallowMount(Movies, {
      stubs,
      mocks: {
        $ml,
      },
    });
    expect(wrapper.vm.rightDrawerBorderClass).toBe('right-filter-drawer-dark');
  });

  it('correctly sets the data when creating a movie', async () => {
    const wrapper = shallowMount(Movies, {
      stubs,
      mocks: {
        $ml,
      },
    });

    await wrapper.vm.$nextTick();
    wrapper.setData({
      categories: [],
      locations: [],
    });
    expect(wrapper.vm.state).toEqual('empty');
    wrapper.vm.newMovie();
    expect(wrapper.vm.state).toEqual('edit');
  });

  it('correctly refreshes the list after updating a movie', async () => {
    const wrapper = shallowMount(Movies, {
      stubs,
      mocks: {
        $ml,
      },
    });

    await wrapper.vm.$nextTick();
    wrapper.setData({
      categories: [],
      locations: [],
      expanded: [false, true, false],
    });
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.expanded).toEqual([false, true, false]);
    expect(wrapper.vm.state).toEqual('empty');
    wrapper.vm.refreshList(1);
    expect(wrapper.vm.expanded).toEqual([false, false, false]);
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.state).toEqual('empty');
  });

  it('correctly refreshes the list after creating a movie', async () => {
    const wrapper = shallowMount(Movies, {
      stubs,
      mocks: {
        $ml,
      },
    });

    await wrapper.vm.$nextTick();
    wrapper.setData({
      categories: [],
      locations: [],
      expanded: [false, false, false],
      state: wrapper.vm.State.EDIT,
    });

    expect(wrapper.vm.expanded).toEqual([false, false, false]);
    expect(wrapper.vm.state).toEqual('edit');
    wrapper.vm.refreshList(-1);
    expect(wrapper.vm.expanded).toEqual([false, false, false]);
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.state).toEqual('empty');
  });

  it('correctly scrolls on movie selection', async () => {
    const mockScrollTo = jest.fn();
    const wrapper = shallowMount(Movies, {
      stubs,
      mocks: {
        $ml,
      },
    });
    await wrapper.vm.$nextTick();
    wrapper.setData({
      categories: [],
      locations: [],
      expanded: [false, false, false],
      state: wrapper.vm.State.OK,
    });

    wrapper.setMethods({
      scrollTo: mockScrollTo,
    });

    wrapper.vm.onSelect(3);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.scrollTo.mock.calls.length).toBe(1);
    expect(wrapper.vm.scrollTo.mock.calls[0][0]).toBe(3);
  });
});
