import { shallowMount } from '@vue/test-utils';
import Category from '@/components/category/Category.vue';
import setGlobals from '../utils/localStorage';

const localStorageLight = {
  'vue-user-theme': 'porygon-light',
};

const localStorageDark = {
  'vue-user-theme': 'porygon-dark',
};

describe('Category.vue', () => {
  it('uses the correct class when selected on light theme', () => {
    setGlobals();
    Object.keys(localStorageLight).forEach((key) => {
      global.window.localStorage.setItem(key, localStorageLight[key]);
    });
    const wrapper = shallowMount(Category, {
      propsData: {
        selected: true,
      },
      stubs: ['md-card-header', 'md-card-content', 'md-card'],
    });
    expect(wrapper.find('md-card-stub')).toBeDefined();
    const card = wrapper.find('md-card-stub');
    expect(card.classes()).toContain('selected-light');
  });

  it('uses the correct class when selected on dark theme', () => {
    setGlobals();
    Object.keys(localStorageLight).forEach((key) => {
      global.window.localStorage.setItem(key, localStorageDark[key]);
    });
    const wrapper = shallowMount(Category, {
      propsData: {
        selected: true,
      },
      stubs: ['md-card-header', 'md-card-content', 'md-card'],
    });
    const card = wrapper.find('md-card-stub');
    expect(card.classes()).toContain('selected-dark');
  });

  it('uses the correct class when not selected', () => {
    setGlobals();
    Object.keys(localStorageLight).forEach((key) => {
      global.window.localStorage.setItem(key, localStorageDark[key]);
    });
    const wrapper = shallowMount(Category, {
      propsData: {
        selected: false,
      },
      stubs: ['md-card-header', 'md-card-content', 'md-card'],
    });
    const card = wrapper.find('md-card-stub');
    expect(card.classes()).not.toContain('selected-dark');
    expect(card.classes()).not.toContain('selected-light');
  });

  it('correctly displays the props', () => {
    setGlobals();
    Object.keys(localStorageLight).forEach((key) => {
      global.window.localStorage.setItem(key, localStorageDark[key]);
    });
    const wrapper = shallowMount(Category, {
      propsData: {
        label: 'test category',
        description: 'this is a test description',
        selected: false,
      },
      stubs: ['md-card-header', 'md-card-content', 'md-card'],
    });
    const title = wrapper.find('.md-title');
    const content = wrapper.find('md-card-content-stub');
    expect(title.text()).toContain('test category');
    expect(content.text()).toContain('this is a test description');
  });
});
