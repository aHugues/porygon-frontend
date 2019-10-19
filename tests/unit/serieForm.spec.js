import { shallowMount } from '@vue/test-utils';
import axios from 'axios';
import SerieForm from '@/components/serie/SerieForm.vue';
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
    title: 'Title',
    season: 'Season',
    episodes: 'Number of episodes',
    supports: 'Supports',
    support_digital: 'Digital',
    remarks: 'Remarks',
    edit: 'Edit serie',
    delete: 'Delete serie',
    create: 'Create serie',
    empty_button: 'Create your first serie',
    empty_description: "Creating series, you'll be able to store and order your series library.",
    title_required: 'The title is required',
    title_too_long: 'The title is too long',
    season_integer: 'The season should be a number',
    episodes_integer: 'The number of episodes should be a number',
    remarks_too_long: 'The remarks are too long',
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
  },
};

const vueToken = 'thisIsAToken';

const stubs = ['md-field', 'md-switch', 'md-input', 'md-button', 'md-select', 'md-option'];

describe('SerieForm.vue', () => {
  it('correctly loads', () => {
    const wrapper = shallowMount(SerieForm, {
      stubs,
      propsData: {
        method: 'create',
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
        currentSerie: {
          title: 'test title',
          season: 1,
          location_id: 1,
          is_dvd: true,
          episodes: 13,
        },
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
    expect(wrapper.vm.supports).toContain('dvd');
    expect(wrapper.vm.supports).not.toContain('bluray');
  });

  it('generates the correct dev API urls', () => {
    const wrapper = shallowMount(SerieForm, {
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

  it('emits the correct event when serie is saved', () => {
    const wrapper = shallowMount(SerieForm, {
      stubs,
      propsData: {
        method: 'create',
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
        currentSerie: {
          title: 'test title',
          season: 1,
          location_id: 1,
          is_dvd: true,
          episodes: 13,
        },
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
        currentSerie: {
          id: 42,
          title: 'test title',
          season: 1,
          location_id: 1,
          is_dvd: true,
          episodes: 13,
        },
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
      done();
    });
  });

  it('sends the correct arguments when deleting a serie', () => {
    const wrapper = shallowMount(SerieForm, {
      stubs,
      propsData: {
        currentSerie: {
          id: 42,
          title: 'test title',
          season: 1,
          location_id: 1,
          is_dvd: true,
          episodes: 13,
        },
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

  it('correctly set the authorization header', () => {
    setGlobals();
    global.window.localStorage.setItem('vue-token', vueToken);
    process.env.NODE_ENV = 'testAuthentication';
    const wrapper = shallowMount(SerieForm, {
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
    const wrapper = shallowMount(SerieForm, {
      stubs,
      propsData: {
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
        currentSerie: {
          id: 42,
        },
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
