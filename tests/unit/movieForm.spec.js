import { shallowMount } from '@vue/test-utils';
import axios from 'axios';
import MovieForm from '@/components/movie/MovieForm.vue';
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
  __esModule: true,
  get: jest.fn(() => Promise.resolve({ data: 'data' })),
  default: jest.fn(request => Promise.resolve({ request, data: 'data' })),
}));

const $ml = {
  get: () => ({
    title: 'Original title',
    french_title: 'French title',
    year: 'Year',
    duration: 'Duration (mins.)',
    director: 'Director',
    actors: 'Actors',
    supports: 'Supports',
    support_digital: 'Digital',
    remarks: 'Remarks',
    edit: 'Edit movie',
    delete: 'Delete movie',
    create: 'Create movie',
    empty_button: 'Create your first movie',
    empty_description: "Creating movies, you'll be able to store and order your movies library.",
    title_required: 'The original title is required',
    title_too_long: 'The original title is too long',
    french_title_too_long: 'The French title is too long',
    year_required: 'The year is required',
    year_between: 'The year should be between 1920 and 210',
    year_integer: 'The year should be a number',
    duration_required: 'The duration is required',
    duration_between: 'The duration should be between 0 and 600',
    duration_integer: 'The duration should be a number',
    director_too_long: 'The director is too long',
    actors_too_long: 'The actors list is too long',
    remarks_too_long: 'The remarks are too long',
    form_error: {
      movie: "Erreur lors de l'ajout ou de la modification du film",
    },
  }),
};

const validV = {
  $touch: () => {},
  $invalid: false,
  movie: {
    title: {},
    french_title: {},
    year: {},
    duration: {},
    director: {},
    actors: {},
    remarks: {},
  },
};

const invalidV = {
  $touch: () => {},
  $invalid: true,
  movie: {
    title: {},
    french_title: {},
    year: {},
    duration: {},
    director: {},
    actors: {},
    remarks: {},
  },
};

const vueToken = 'thisIsAToken';

const stubs = ['md-field', 'md-switch', 'md-snackbar',
  'md-input', 'md-button', 'md-select', 'md-option'];

describe('MovieForm.vue', () => {
  it('correctly loads', () => {
    const wrapper = shallowMount(MovieForm, {
      stubs,
      propsData: {
        method: 'create',
      },
      mocks: {
        $ml,
      },
    });

    expect(wrapper.contains('.movie-edit-form')).toBe(true);
    expect(wrapper.vm.$options.props.method.required).toBeTruthy();
    expect(wrapper.vm.$props.method).toBe('create');
  });

  it('loads the current Movie on modify mode', () => {
    const wrapper = shallowMount(MovieForm, {
      stubs,
      propsData: {
        method: 'modify',
        currentMovie: {
          title: 'test title',
          year: 2019,
          location_id: 1,
          is_dvd: true,
        },
        movieCategories: [
          {
            id: 1,
            label: 'toto',
          },
          {
            id: 2,
            label: 'tata',
          },
        ],
      },
      mocks: {
        $ml,
      },
    });

    expect(wrapper.vm.$props.method).toBe('modify');
    expect(wrapper.vm.movie.title).toBe('test title');
    expect(wrapper.vm.movie.year).toBe(2019);
    expect(wrapper.vm.movie.location_id).toBe(1);
    expect(wrapper.vm.supports).toContain('dvd');
    expect(wrapper.vm.supports).not.toContain('bluray');
    expect(wrapper.vm.movie.categories).toEqual([1, 2]);
  });

  it('generates the correct dev API urls', () => {
    const wrapper = shallowMount(MovieForm, {
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

  it('emits the correct event when movie is saved', () => {
    const wrapper = shallowMount(MovieForm, {
      stubs,
      propsData: {
        method: 'create',
      },
      mocks: {
        $ml,
      },
    });
    wrapper.vm.saveMovie();
    wrapper.vm.$nextTick(() => {
      expect(wrapper.emitted('movie-added-or-modified')).toBeDefined();
    });
  });

  it('emits the correct event when movie is deleted', () => {
    const wrapper = shallowMount(MovieForm, {
      stubs,
      propsData: {
        method: 'modify',
        currentMovie: {
          title: 'test title',
          year: 2019,
          location_id: 1,
        },
        movieCategories: [
          {
            id: 1,
            label: 'toto',
          },
          {
            id: 2,
            label: 'tata',
          },
        ],
      },
      mocks: {
        $ml,
      },
    });
    wrapper.vm.deleteMovie();
    wrapper.vm.$nextTick(() => {
      expect(wrapper.emitted('movie-added-or-modified')).toBeDefined();
    });
  });

  it('sends the correct arguments when modifying a movie', (done) => {
    const wrapper = shallowMount(MovieForm, {
      stubs,
      propsData: {
        method: 'modify',
        currentMovie: {
          id: 42,
          title: 'test title',
          year: 2019,
          location_id: 1,
        },
        movieCategories: [
          {
            id: 1,
            label: 'toto',
          },
          {
            id: 2,
            label: 'tata',
          },
        ],
      },
      mocks: {
        $ml,
      },
    });
    wrapper.vm.saveMovie();
    wrapper.vm.$nextTick(() => {
      const axiosArgs = axios.mock.calls[2][0];
      expect(axios.mock.calls.length).toBe(3);
      expect(axiosArgs.method).toBe('put');
      expect(axiosArgs.url).toBe('http://example.com:4000/movies/42');
      expect(axiosArgs.headers['Content-Type']).toBe('application/json');
      expect(axiosArgs.headers.Authorization).not.toBeDefined();
      expect(axiosArgs.data.remarks).not.toBeDefined();
      expect(axiosArgs.data.title).toBe('test title');
      expect(axiosArgs.data.year).toBe(2019);
      expect(axiosArgs.data.location_id).toBe(1);
      done();
    });
  });

  it('sends the correct arguments when deleting a movie', () => {
    const wrapper = shallowMount(MovieForm, {
      stubs,
      propsData: {
        currentMovie: {
          id: 42,
          title: 'test title',
          year: 2019,
          location_id: 1,
        },
        movieCategories: [
          {
            id: 1,
            label: 'toto',
          },
          {
            id: 2,
            label: 'tata',
          },
        ],
        method: 'modify',
      },
      mocks: {
        $ml,
      },
    });
    wrapper.vm.deleteMovie();
    wrapper.vm.$nextTick(() => {
      const axiosArgs = axios.mock.calls[3][0];
      expect(axios.mock.calls.length).toBe(4);
      expect(axiosArgs.method).toBe('delete');
      expect(axiosArgs.url).toBe('http://example.com:4000/movies/42');
      expect(axiosArgs.headers['Content-Type']).toBe('application/json');
      expect(axiosArgs.headers.Authorization).not.toBeDefined();
      expect(axiosArgs.data).not.toBeDefined();
    });
  });

  it('correctly set the authorization header', () => {
    setGlobals();
    global.window.localStorage.setItem('vue-token', vueToken);
    process.env.NODE_ENV = 'testAuthentication';
    const wrapper = shallowMount(MovieForm, {
      stubs,
      propsData: {
        method: 'create',
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

  it('correctly saves after validating', () => {
    const wrapper = shallowMount(MovieForm, {
      stubs,
      propsData: {
        method: 'create',
      },
      mocks: {
        $ml,
        $v: validV,
      },
    });
    wrapper.vm.validateMovie();
    wrapper.vm.$nextTick(() => {
      expect(axios.mock.calls.length).toEqual(5);
      const axiosArgs = axios.mock.calls[4][0];
      expect(axiosArgs.method).toBe('post');
      expect(axiosArgs.url).toBe('http://example.com:4000/movies');
      expect(axiosArgs.headers['Content-Type']).toBe('application/json');
      expect(axiosArgs.headers.Authorization).not.toBeDefined();
      expect(axiosArgs.data.title).not.toBeDefined();
    });
  });

  it('correctly detects invalid', () => {
    const wrapper = shallowMount(MovieForm, {
      stubs,
      propsData: {
        currentMovie: {
          id: 42,
        },
        movieCategories: [
          {
            id: 1,
            label: 'toto',
          },
          {
            id: 2,
            label: 'tata',
          },
        ],
        method: 'modify',
      },
      mocks: {
        $ml,
        $v: invalidV,
      },
    });
    wrapper.vm.validateMovie();
    wrapper.vm.$nextTick(() => {
      expect(axios.mock.calls.length).toEqual(5);
    });
  });
});
