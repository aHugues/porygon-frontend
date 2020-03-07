import { shallowMount } from '@vue/test-utils';
import Home from '@/views/Home.vue';

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
  get: jest.fn(() => Promise.resolve(
    {
      data: {
        movie_count: 12,
        serie_count: 10,
        location_count: 2,
        category_count: 6,
      },
    },
  )),
}));


const stubs = ['api-check', 'stat-card'];

describe('HomeView', () => {
  it('Correctly loads', () => {
    const wrapper = shallowMount(Home, {
      stubs,
    });
    expect(wrapper.contains('.home')).toBe(true);
  });

  it('Correctly sets the data', async () => {
    const wrapper = shallowMount(Home, {
      stubs,
    });
    expect(wrapper.vm.movieCount).toBe(0);
    expect(wrapper.vm.serieCount).toBe(0);
    expect(wrapper.vm.locationCount).toBe(0);
    expect(wrapper.vm.categoryCount).toBe(0);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.movieCount).toBe(12);
    expect(wrapper.vm.serieCount).toBe(10);
    expect(wrapper.vm.locationCount).toBe(2);
    expect(wrapper.vm.categoryCount).toBe(6);
  });
});
