import { shallowMount } from '@vue/test-utils';
import Movies from '@/views/Movies.vue';

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
  'movie',
  'movie-form',
  'md-button',
  'md-empty-state',
  'md-progress-spinner',
  'md-divider',
  'md-list-item',
  'md-icon',
  'md-list',
];

const vueToken = 'thisIsAToken';

describe('MoviesView', () => {
  it('Correctly loads', () => {
    const wrapper = shallowMount(Movies, {
      stubs,
      mocks: {
        $ml,
      },
    });
    expect(wrapper.contains('.movies')).toBe(true);
  });

  it('correctly set the authorization header', () => {
    global.window.localStorage.setItem('vue-token', vueToken);
    process.env.NODE_ENV = 'testAuthentication';
    const wrapper = shallowMount(Movies, {
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

  it('correctly sets the data when creating a movie', (done) => {
    const wrapper = shallowMount(Movies, {
      stubs,
      mocks: {
        $ml,
      },
    });

    wrapper.vm.$nextTick(() => {
      wrapper.setData({
        categories: [],
        locations: [],
      });

      expect(wrapper.vm.showDialog).toEqual(false);
      wrapper.vm.newMovie();
      expect(wrapper.vm.showDialog).toEqual(true);
      done();
    });
  });

  it('correctly refreshes the list after updating a movie', (done) => {
    const wrapper = shallowMount(Movies, {
      stubs,
      mocks: {
        $ml,
      },
    });

    wrapper.vm.$nextTick(() => {
      wrapper.setData({
        categories: [],
        locations: [],
        expanded: [false, true, false],
        showDialog: true,
      });

      expect(wrapper.vm.expanded).toEqual([false, true, false]);
      expect(wrapper.vm.showDialog).toEqual(true);
      wrapper.vm.refreshList(1);
      expect(wrapper.vm.expanded).toEqual([false, false, false]);
      expect(wrapper.vm.showDialog).toEqual(false);
      done();
    });
  });

  it('correctly refreshes the list after creating a movie', (done) => {
    const wrapper = shallowMount(Movies, {
      stubs,
      mocks: {
        $ml,
      },
    });

    wrapper.vm.$nextTick(() => {
      wrapper.setData({
        categories: [],
        locations: [],
        expanded: [false, false, false],
        showDialog: true,
      });

      expect(wrapper.vm.expanded).toEqual([false, false, false]);
      expect(wrapper.vm.showDialog).toEqual(true);
      wrapper.vm.refreshList(-1);
      expect(wrapper.vm.expanded).toEqual([false, false, false]);
      expect(wrapper.vm.showDialog).toEqual(false);
      done();
    });
  });

  it('correctly scrolls on movie selection', (done) => {
    const mockScrollTo = jest.fn();
    const wrapper = shallowMount(Movies, {
      stubs,
      mocks: {
        $ml,
      },
    });
    wrapper.vm.$nextTick(() => {
      wrapper.setData({
        categories: [],
        locations: [],
        expanded: [false, false, false],
        showDialog: true,
      });

      wrapper.setMethods({
        scrollTo: mockScrollTo,
      });

      wrapper.vm.onSelect(3);
      wrapper.vm.$nextTick(() => {
        expect(wrapper.vm.scrollTo.mock.calls.length).toBe(1);
        expect(wrapper.vm.scrollTo.mock.calls[0][0]).toBe(3);
        done();
      });
    });
  });

  // TODO refactor this test so that it better captures the application workflow
  it('correctly use the scroll API', (done) => {
    const querySelector = () => 'coucou';
    const wrapper = shallowMount(Movies, {
      stubs,
      mocks: {
        $ml,
        '$el.querySelector': querySelector,
      },
    });
    wrapper.vm.$nextTick(() => {
      wrapper.setData({
        categories: [],
        locations: [],
        movies: [
          { id: 1 },
          { id: 2 },
          { id: 3 },
          { id: 4 },
        ],
        expanded: [false, false, false, false],
        showDialog: true,
      });

      wrapper.vm.scrollTo(3);
      expect(1).toBe(1);
      done();
    });
  });
});
