import { shallowMount } from '@vue/test-utils';
import ErrorState from '@/components/misc/ErrorState.vue';

const $ml = {
  get: () => ({
    error: {
      reload_button: 'reload button text',
      errored_description: 'error page description',
    },
  }),
};

describe('ErrorState.vue', () => {
  it('correctly loads on movies', () => {
    const wrapper = shallowMount(ErrorState, {
      propsData: {
        resource: 'movie',
      },
      mocks: { $ml },
      stubs: ['md-empty-state', 'md-button'],
    });
    expect(wrapper.vm.resourceIcon).toBe('movie');
  });

  it('correctly loads on series', () => {
    const wrapper = shallowMount(ErrorState, {
      propsData: {
        resource: 'serie',
      },
      mocks: { $ml },
      stubs: ['md-empty-state', 'md-button'],
    });
    expect(wrapper.vm.resourceIcon).toBe('tv');
  });

  it('correctly sends the expected event', () => {
    const wrapper = shallowMount(ErrorState, {
      propsData: {
        resource: 'serie',
      },
      mocks: { $ml },
      stubs: ['md-empty-state', 'md-button'],
    });
    wrapper.vm.reloadPage();
    wrapper.vm.$nextTick(() => {
      expect(wrapper.emitted('reload-page')).toBeDefined();
    });
  });
});
