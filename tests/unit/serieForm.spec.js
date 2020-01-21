import { shallowMount } from '@vue/test-utils';
import axios from 'axios';
import SerieForm from '@/components/serie/SerieForm.vue';

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
    title: 'Title',
    season: 'Season',
    episodes: 'Number of episodes',
    supports: 'Supports',
    year: 'Year',
    support_digital: 'Digital',
    remarks: 'Remarks',
    edit: 'Edit serie',
    delete: 'Delete serie',
    create: 'Create serie',
    empty_button: 'Create your first serie',
    empty_description: "Creating series, you'll be able to store and order your series library.",
    title_required: 'The title is required',
    title_too_long: 'The title is too long',
    year_required: "L'année de sortie est requise",
    year_between: "L'année de sortie doit être comprise entre 1920 et 2100",
    year_integer: "L'année de sortie doit être un nombre",
    season_integer: 'The season should be a number',
    episodes_integer: 'The number of episodes should be a number',
    remarks_too_long: 'The remarks are too long',
    form_error: {
      serie: "Erreur lors de l'ajout ou de la modification de la série",
    },
  }),
};

const validV = {
  $touch: () => {},
  $invalid: false,
  serie: {
    title: {},
    season: {},
    episodes: {},
    remarks: {},
    year: {},
  },
};

const invalidV = {
  $touch: () => {},
  $invalid: true,
  serie: {
    title: {},
    season: {},
    episodes: {},
    remarks: {},
    year: {},
  },
};


const stubs = ['md-field', 'md-switch', 'md-input', 'md-snackbar',
  'md-button', 'md-select', 'md-option'];

describe('SerieForm.vue', () => {
  it('correctly loads', () => {
    const wrapper = shallowMount(SerieForm, {
      stubs,
      propsData: {
        method: 'create',
        categories: [],
        locations: [],
      },
      mocks: {
        $ml,
      },
    });

    expect(wrapper.contains('.serie-edit-form')).toBe(true);
    expect(wrapper.vm.$options.props.method.required).toBeTruthy();
    expect(wrapper.vm.$props.method).toBe('create');
  });

  it('loads the current Serie on modify mode', () => {
    const wrapper = shallowMount(SerieForm, {
      stubs,
      propsData: {
        method: 'modify',
        categories: [],
        locations: [],
        currentSerie: {
          title: 'test title',
          season: 1,
          location_id: 1,
          is_dvd: true,
          episodes: 13,
          year: 2019,
        },
        serieCategories: [
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
    expect(wrapper.vm.serie.title).toBe('test title');
    expect(wrapper.vm.serie.season).toBe(1);
    expect(wrapper.vm.serie.episodes).toBe(13);
    expect(wrapper.vm.serie.location_id).toBe(1);
    expect(wrapper.vm.serie.year).toBe(2019);
    expect(wrapper.vm.supports).toContain('dvd');
    expect(wrapper.vm.supports).not.toContain('bluray');
    expect(wrapper.vm.serie.categories).toEqual([1, 2]);
  });

  it('emits the correct event when serie is saved', () => {
    const wrapper = shallowMount(SerieForm, {
      stubs,
      propsData: {
        method: 'create',
        categories: [],
        locations: [],
      },
      mocks: {
        $ml,
      },
    });
    wrapper.vm.saveSerie();
    wrapper.vm.$nextTick(() => {
      expect(wrapper.emitted('serie-added-or-modified')).toBeDefined();
    });
  });

  it('emits the correct event when serie is deleted', () => {
    const wrapper = shallowMount(SerieForm, {
      stubs,
      propsData: {
        method: 'modify',
        categories: [],
        locations: [],
        currentSerie: {
          title: 'test title',
          season: 1,
          location_id: 1,
          is_dvd: true,
          episodes: 13,
          year: 2019,
        },
        serieCategories: [
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
    wrapper.vm.deleteSerie();
    wrapper.vm.$nextTick(() => {
      expect(wrapper.emitted('serie-added-or-modified')).toBeDefined();
    });
  });

  it('sends the correct arguments when modifying a serie', (done) => {
    const wrapper = shallowMount(SerieForm, {
      stubs,
      propsData: {
        method: 'modify',
        categories: [],
        locations: [],
        currentSerie: {
          id: 42,
          title: 'test title',
          season: 1,
          location_id: 1,
          is_dvd: true,
          episodes: 13,
          year: 2019,
        },
        serieCategories: [
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
    wrapper.vm.saveSerie();
    wrapper.vm.$nextTick(() => {
      const axiosArgs = axios.mock.calls[2][0];
      expect(axios.mock.calls.length).toBe(3);
      expect(axiosArgs.method).toBe('put');
      expect(axiosArgs.url).toBe('http://example.com:4000/series/42');
      expect(axiosArgs.headers['Content-Type']).toBe('application/json');
      expect(axiosArgs.headers.Authorization).not.toBeDefined();
      expect(axiosArgs.data.remarks).not.toBeDefined();
      expect(axiosArgs.data.title).toBe('test title');
      expect(axiosArgs.data.season).toBe(1);
      expect(axiosArgs.data.location_id).toBe(1);
      expect(axiosArgs.data.year).toBe(2019);
      done();
    });
  });

  it('sends the correct arguments when deleting a serie', () => {
    const wrapper = shallowMount(SerieForm, {
      stubs,
      propsData: {
        categories: [],
        locations: [],
        currentSerie: {
          id: 42,
          title: 'test title',
          season: 1,
          location_id: 1,
          is_dvd: true,
          episodes: 13,
          year: 2019,
        },
        serieCategories: [
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
    wrapper.vm.deleteSerie();
    wrapper.vm.$nextTick(() => {
      const axiosArgs = axios.mock.calls[3][0];
      expect(axios.mock.calls.length).toBe(4);
      expect(axiosArgs.method).toBe('delete');
      expect(axiosArgs.url).toBe('http://example.com:4000/series/42');
      expect(axiosArgs.headers['Content-Type']).toBe('application/json');
      expect(axiosArgs.headers.Authorization).not.toBeDefined();
      expect(axiosArgs.data).not.toBeDefined();
    });
  });

  it('correctly saves after validating', () => {
    const wrapper = shallowMount(SerieForm, {
      stubs,
      propsData: {
        categories: [],
        locations: [],
        method: 'create',
      },
      mocks: {
        $ml,
        $v: validV,
      },
    });
    wrapper.vm.validateSerie();
    wrapper.vm.$nextTick(() => {
      expect(axios.mock.calls.length).toEqual(5);
      const axiosArgs = axios.mock.calls[4][0];
      expect(axiosArgs.method).toBe('post');
      expect(axiosArgs.url).toBe('http://example.com:4000/series');
      expect(axiosArgs.headers['Content-Type']).toBe('application/json');
      expect(axiosArgs.headers.Authorization).not.toBeDefined();
      expect(axiosArgs.data.title).not.toBeDefined();
    });
  });

  it('correctly detects invalid', () => {
    const wrapper = shallowMount(SerieForm, {
      stubs,
      propsData: {
        categories: [],
        locations: [],
        currentSerie: {
          id: 42,
        },
        serieCategories: [
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
    wrapper.vm.validateSerie();
    wrapper.vm.$nextTick(() => {
      expect(axios.mock.calls.length).toEqual(5);
    });
  });
});
