import { shallowMount } from '@vue/test-utils';
import EmptyPage from '@/components/misc/EmptyPage.vue';

const $ml = {
  get: () => ({
    movie: {
      empty_button: 'empty movie text',
      empty_description: 'empty movie page description',
    },
    serie: {
      empty_button: 'empty serie text',
      empty_description: 'empty serie page description',
    },
  }),
};

describe('EmptyPage.vue', () => {
  it('correctly loads on movies', () => {
    const wrapper = shallowMount(EmptyPage, {
      propsData: {
        resource: 'movie',
      },
      mocks: { $ml },
      stubs: ['md-empty-state', 'md-button'],
    });
    expect(wrapper.vm.resourceIcon).toBe('movie');
  });

  it('correctly loads on series', () => {
    const wrapper = shallowMount(EmptyPage, {
      propsData: {
        resource: 'serie',
      },
      mocks: { $ml },
      stubs: ['md-empty-state', 'md-button'],
    });
    expect(wrapper.vm.resourceIcon).toBe('tv');
  });

  it('correctly sends the expected event', () => {
    const wrapper = shallowMount(EmptyPage, {
      propsData: {
        resource: 'serie',
      },
      mocks: { $ml },
      stubs: ['md-empty-state', 'md-button'],
    });
    wrapper.vm.createResource();
    wrapper.vm.$nextTick(() => {
      expect(wrapper.emitted('resource-created')).toBeDefined();
    });
  });
});
