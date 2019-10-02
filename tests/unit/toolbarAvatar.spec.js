import { shallowMount } from '@vue/test-utils';
import ToolbarAvatar from '@/components/toolbar/ToolbarAvatar.vue';
import setGlobals from '../utils/localStorage';

const localStorageLight = {
  'vue-user-theme': 'porygon-light',
  'vue-user-firstname': 'John',
  'vue-user-lastname': 'Doe',
};

const localStorageDark = {
  'vue-user-theme': 'porygon-dark',
  'vue-user-firstname': 'John',
  'vue-user-lastname': 'Doe',
};

describe('ToolbarAvatar.vue', () => {
  it('selects the correct theme when light', () => {
    setGlobals();
    Object.keys(localStorageLight).forEach((key) => {
      global.window.localStorage.setItem(key, localStorageLight[key]);
    });
    const wrapper = shallowMount(ToolbarAvatar, {
      stubs: ['md-button', 'md-icon', 'md-switch', 'md-menu-item', 'md-menu-content', 'md-avatar', 'md-menu'],
    });
    expect(wrapper.vm.darkTheme).toEqual(false);
  });

  it('selects the correct theme when dark', () => {
    setGlobals();
    Object.keys(localStorageDark).forEach((key) => {
      global.window.localStorage.setItem(key, localStorageDark[key]);
    });
    const wrapper = shallowMount(ToolbarAvatar, {
      stubs: ['md-button', 'md-icon', 'md-switch', 'md-menu-item', 'md-menu-content', 'md-avatar', 'md-menu'],
    });
    expect(wrapper.vm.darkTheme).toEqual(true);
  });

  it('correctly computes the initials', () => {
    setGlobals();
    Object.keys(localStorageDark).forEach((key) => {
      global.window.localStorage.setItem(key, localStorageDark[key]);
    });
    const wrapper = shallowMount(ToolbarAvatar, {
      stubs: ['md-button', 'md-icon', 'md-switch', 'md-menu-item', 'md-menu-content', 'md-avatar', 'md-menu'],
    });
    expect(wrapper.vm.firstNameInitial).toEqual('J');
    expect(wrapper.vm.lastNameInitial).toEqual('D');
  });

  it('correctly updates the theme when updated', () => {
    setGlobals();
    Object.keys(localStorageLight).forEach((key) => {
      global.window.localStorage.setItem(key, localStorageLight[key]);
    });
    const material = { theming: () => null };
    const wrapper = shallowMount(ToolbarAvatar, {
      stubs: ['md-button', 'md-icon', 'md-switch', 'md-menu-item', 'md-menu-content', 'md-avatar', 'md-menu'],
      mocks: {
        $material: material,
      },
    });
    expect(wrapper.vm.darkTheme).toEqual(false);
    wrapper.vm.darkTheme = true;
    wrapper.vm.$forceUpdate();
    expect(wrapper.vm.darkTheme).toEqual(true);
    expect(global.window.localStorage.getItem('vue-user-theme')).toEqual('porygon-dark');
  });
});
