import { shallowMount } from '@vue/test-utils';
import Locations from '@/views/Locations.vue';

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
    location: 'Location',
    physical_location: 'Physical location',
    edit: 'Edit location',
    delete: 'Delete location',
    create: 'Create location',
    empty_button: 'Create your first location',
    empty_description: "Creating locations, you'll be able to store and order movies and series.",
    location_required: 'The location is required',
    location_too_long: 'The location is too long',
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
  'location',
  'location-form',
  'md-button',
  'md-empty-state',
  'md-progress-spinner',
  'md-icon',
  'md-snackbar',
];

const vueToken = 'thisIsAToken';

describe('LocationsView', () => {
  it('Correctly loads', () => {
    const wrapper = shallowMount(Locations, {
      stubs,
      mocks: {
        $ml,
      },
    });
    expect(wrapper.contains('.locations')).toBe(true);
  });

  it('correctly set the authorization header', () => {
    global.window.localStorage.setItem('vue-token', vueToken);
    process.env.NODE_ENV = 'testAuthentication';
    const wrapper = shallowMount(Locations, {
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
    const wrapper = shallowMount(Locations, {
      stubs,
      mocks: {
        $ml,
      },
    });

    expect(wrapper.vm.dialogMethod).toEqual('create');
    expect(wrapper.vm.showDialog).toEqual(false);
    wrapper.vm.newLocation();
    expect(wrapper.vm.dialogMethod).toEqual('create');
    expect(wrapper.vm.showDialog).toEqual(true);
  });

  it('correctly sets the data when editing a category', () => {
    const wrapper = shallowMount(Locations, {
      stubs,
      mocks: {
        $ml,
      },
    });

    expect(wrapper.vm.dialogMethod).toEqual('create');
    expect(wrapper.vm.showDialog).toEqual(false);
    wrapper.vm.editLocation(1, 'test location', true);
    expect(wrapper.vm.dialogMethod).toEqual('modify');
    expect(wrapper.vm.showDialog).toEqual(true);
    expect(wrapper.vm.currentId).toEqual(1);
    expect(wrapper.vm.currentLocation).toEqual('test location');
    expect(wrapper.vm.currentPhysical).toEqual(true);
  });

  it('correctly closes the category when clicking a second time', () => {
    const wrapper = shallowMount(Locations, {
      stubs,
      mocks: {
        $ml,
      },
    });

    expect(wrapper.vm.dialogMethod).toEqual('create');
    expect(wrapper.vm.showDialog).toEqual(false);

    wrapper.vm.editLocation(1, 'test location', true);
    expect(wrapper.vm.dialogMethod).toEqual('modify');
    expect(wrapper.vm.showDialog).toEqual(true);
    expect(wrapper.vm.currentId).toEqual(1);
    expect(wrapper.vm.currentLocation).toEqual('test location');
    expect(wrapper.vm.currentPhysical).toEqual(true);

    wrapper.vm.editLocation(1, 'test location', true);
    expect(wrapper.vm.currentId).toEqual(-1);
    expect(wrapper.vm.showDialog).toEqual(false);
  });
});
