import { shallowMount } from '@vue/test-utils';
import StatsLocation from '@/components/misc/StatsLocation.vue';

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

jest.mock('axios');
const axios = require('axios');

const data = [
  {
    id: 1, location: 'location 1', movie_count: 12, serie_count: 3,
  },
  {
    id: 2, location: 'location 2', movie_count: 2, serie_count: 3,
  },
  {
    id: 3, location: 'location 3', movie_count: 25, serie_count: 10,
  },
  {
    id: 4, location: 'location 4', movie_count: 8, serie_count: 23,
  },
];

const stubs = ['md-card', 'md-card-header', 'md-card-content'];


describe('StatsLocationComponent', () => {
  axios.get.mockImplementation(() => Promise.resolve({ data }));

  it('Correctly loads', () => {
    const wrapper = shallowMount(StatsLocation, {
      propsData: {
        resource: 'movies',
      },
      stubs,
    });
    expect(wrapper.contains('.md-title')).toBe(true);
  });


  it('Correctly gets data for movies', async () => {
    const wrapper = shallowMount(StatsLocation, {
      propsData: {
        resource: 'movies',
      },
      stubs,
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.dataset).toEqual({
      children: [
        { location: 'location 1', count: 12 },
        { location: 'location 2', count: 2 },
        { location: 'location 3', count: 25 },
        { location: 'location 4', count: 8 },
      ],
    });
  });

  it('Correctly gets data for series', async () => {
    const wrapper = shallowMount(StatsLocation, {
      propsData: {
        resource: 'series',
      },
      stubs,
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.dataset).toEqual({
      children: [
        { location: 'location 1', count: 3 },
        { location: 'location 2', count: 3 },
        { location: 'location 3', count: 10 },
        { location: 'location 4', count: 23 },
      ],
    });
  });
});
