import { shallowMount } from '@vue/test-utils';
import ResourceWarning from '@/components/misc/ResourceWarning.vue';

const $ml = {
  get: (arg) => {
    const dict = {
      error: {
        empty_category: 'No category are present in the database.',
        empty_location: 'No location are present in the database.',
      },
      category: {
        create: 'Create category',
      },
      location: {
        create: 'Create location',
      },
    };
    return dict[arg];
  },
};

const stubs = ['md-card', 'md-card-actions', 'md-card-content', 'md-icon', 'md-button'];


describe('ResourceWarning', () => {
  it('Correctly loads for categories', () => {
    const wrapper = shallowMount(ResourceWarning, {
      stubs,
      mocks: {
        $ml,
      },
      propsData: {
        resource: 'category',
      },
    });

    expect(wrapper.vm.message).toBe('No category are present in the database.');
    expect(wrapper.vm.buttonLabel).toBe('Create category');
    expect(wrapper.vm.resourceLink).toBe('/categories');
  });

  it('Correctly loads for locations', () => {
    const wrapper = shallowMount(ResourceWarning, {
      stubs,
      mocks: {
        $ml,
      },
      propsData: {
        resource: 'location',
      },
    });

    expect(wrapper.vm.message).toBe('No location are present in the database.');
    expect(wrapper.vm.buttonLabel).toBe('Create location');
    expect(wrapper.vm.resourceLink).toBe('/locations');
  });

  it('Correctly validate props', () => {
    const wrapper = shallowMount(ResourceWarning, {
      stubs,
      mocks: {
        $ml,
      },
      propsData: {
        resource: 'category',
      },
    });

    const prop = wrapper.vm.$options.props.resource;

    expect(prop.type).toBe(String);
    expect(prop.required).toBeTruthy();
    expect(prop.validator && prop.validator('category')).toBeTruthy();
    expect(prop.validator && prop.validator('location')).toBeTruthy();
    expect(prop.validator && prop.validator('test')).toBeFalsy();
  });
});
