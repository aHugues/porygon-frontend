import { shallowMount } from '@vue/test-utils';
import App from '@/App.vue';

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
  get: jest.fn(() => Promise.resolve({ })),
}));

const $ml = {
  get: () => ({
    title: 'Navigation',
    home: 'Home',
    movies: 'Movies',
    series: 'Series',
    locations: 'Locations',
    categories: 'Categories',
    error: {
      auth: 'test',
    },
  }),
  change: jest.fn(),
};

const $material = {
  theming: () => {},
};

const stubs = [
  'md-app', 'md-app-toolbar', 'md-button', 'toolbar', 'toolbar-title', 'toolbar-avatar',
  'md-app-drawer', 'md-toolbar', 'md-list', 'md-list-item', 'md-app-content', 'md-icon',
  'router-view', 'md-snackbar',
];

describe('App', () => {
  it('Correctly loads', () => {
    const wrapper = shallowMount(App, {
      stubs,
      mocks: {
        $ml,
        $material,
      },
    });
    expect(wrapper.contains('#app')).toBe(true);
  });

  it('Correctly gets the page size', (done) => {
    global.window.innerWidth = 1440;
    const wrapper = shallowMount(App, {
      stubs,
      mocks: {
        $ml,
        $material,
      },
    });
    global.window.onresize();
    wrapper.vm.$nextTick(() => {
      expect(wrapper.vm.pageWidth).toBe(1440);
      done();
    });
  });

  it('Correctly gets the current language', () => {
    global.window.localStorage.setItem('vue-user-language', 'french');
    shallowMount(App, {
      stubs,
      mocks: {
        $ml,
        $material,
      },
    });
    expect($ml.change.mock.calls.length).toBe(1);
    expect($ml.change.mock.calls[0][0]).toBe('french');
  });
});
