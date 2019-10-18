import { shallowMount } from '@vue/test-utils';
import ToolbarAvatar from '@/components/toolbar/ToolbarAvatar.vue';
import setGlobals from '../utils/localStorage';

const localStorageLight = {
  'vue-user-theme': 'porygon-light',
  'vue-user-firstname': 'John',
  'vue-user-lastname': 'Doe',
  'vue-user-language': 'english',
};

const localStorageComposed = {
  'vue-user-theme': 'porygon-light',
  'vue-user-firstname': 'John-John',
  'vue-user-lastname': 'Doe',
};

const localStorageUndefined = {
  'vue-user-theme': 'porygon-light',
};

const localStorageDark = {
  'vue-user-theme': 'porygon-dark',
  'vue-user-firstname': 'John',
  'vue-user-lastname': 'Doe',
};

const $ml = {
  list: ['english', 'french'],
  get: () => ({
    dev_version: 'Development version',
    dark_theme: 'Dark theme',
    languages: 'Languages',
    account: 'Account',
    logout: 'Logout',
  }),
  change: () => {},
};

describe('ToolbarAvatar.vue', () => {
  it('selects the correct theme when light', () => {
    setGlobals();
    Object.keys(localStorageLight).forEach((key) => {
      global.window.localStorage.setItem(key, localStorageLight[key]);
    });
    const wrapper = shallowMount(ToolbarAvatar, {
      stubs: ['md-button', 'md-icon', 'md-switch', 'md-menu-item', 'md-menu-content', 'md-avatar', 'md-menu', 'md-list', 'md-list-item', 'md-divider'],
      mocks: {
        $ml,
      },
    });
    expect(wrapper.vm.darkTheme).toEqual(false);
  });

  it('selects the correct theme when dark', () => {
    setGlobals();
    Object.keys(localStorageDark).forEach((key) => {
      global.window.localStorage.setItem(key, localStorageDark[key]);
    });
    const wrapper = shallowMount(ToolbarAvatar, {
      stubs: ['md-button', 'md-icon', 'md-switch', 'md-menu-item', 'md-menu-content', 'md-avatar', 'md-menu', 'md-list', 'md-list-item', 'md-divider'],
      mocks: {
        $ml,
      },
    });
    expect(wrapper.vm.darkTheme).toEqual(true);
  });

  it('correctly computes the initials', () => {
    setGlobals();
    Object.keys(localStorageDark).forEach((key) => {
      global.window.localStorage.setItem(key, localStorageDark[key]);
    });
    const wrapper = shallowMount(ToolbarAvatar, {
      stubs: ['md-button', 'md-icon', 'md-switch', 'md-menu-item', 'md-menu-content', 'md-avatar', 'md-menu', 'md-list', 'md-list-item', 'md-divider'],
      mocks: {
        $ml,
      },
    });
    expect(wrapper.vm.userInitials).toEqual('J');
  });

  it('correctly computes the initials for composed nouns', () => {
    setGlobals();
    Object.keys(localStorageComposed).forEach((key) => {
      global.window.localStorage.setItem(key, localStorageComposed[key]);
    });
    const wrapper = shallowMount(ToolbarAvatar, {
      stubs: ['md-button', 'md-icon', 'md-switch', 'md-menu-item', 'md-menu-content', 'md-avatar', 'md-menu', 'md-list', 'md-list-item', 'md-divider'],
      mocks: {
        $ml,
      },
    });
    expect(wrapper.vm.userInitials).toEqual('JJ');
  });

  it('correctly computes the initials when unknown', () => {
    setGlobals();
    global.window.localStorage.clear();
    Object.keys(localStorageUndefined).forEach((key) => {
      global.window.localStorage.setItem(key, localStorageUndefined[key]);
    });
    const wrapper = shallowMount(ToolbarAvatar, {
      stubs: ['md-button', 'md-icon', 'md-switch', 'md-menu-item', 'md-menu-content', 'md-avatar', 'md-menu', 'md-list', 'md-list-item', 'md-divider'],
      mocks: {
        $ml,
      },
    });
    expect(global.window.localStorage.getItem('vue-user-firstname')).not.toBeTruthy();
    expect(wrapper.vm.userInitials).toEqual('-');
  });

  it('correctly updates the theme when updated', () => {
    setGlobals();
    Object.keys(localStorageLight).forEach((key) => {
      global.window.localStorage.setItem(key, localStorageLight[key]);
    });
    const material = { theming: () => null };
    const wrapper = shallowMount(ToolbarAvatar, {
      stubs: ['md-button', 'md-icon', 'md-switch', 'md-menu-item', 'md-menu-content', 'md-avatar', 'md-menu', 'md-list', 'md-list-item', 'md-divider'],
      mocks: {
        $material: material,
        $ml,
      },
    });
    expect(wrapper.vm.darkTheme).toEqual(false);
    wrapper.vm.darkTheme = true;
    wrapper.vm.$forceUpdate();
    expect(wrapper.vm.darkTheme).toEqual(true);
    expect(global.window.localStorage.getItem('vue-user-theme')).toEqual('porygon-dark');
    wrapper.vm.darkTheme = false;
    wrapper.vm.$forceUpdate();
    expect(wrapper.vm.darkTheme).toEqual(false);
    expect(global.window.localStorage.getItem('vue-user-theme')).toEqual('porygon-light');
  });

  it('correctly calls the logout function', () => {
    setGlobals();
    Object.keys(localStorageLight).forEach((key) => {
      global.window.localStorage.setItem(key, localStorageLight[key]);
    });
    const keycloak = { logout: (url) => { expect(url).toBe('/'); } };
    const wrapper = shallowMount(ToolbarAvatar, {
      stubs: ['md-button', 'md-icon', 'md-switch', 'md-menu-item', 'md-menu-content', 'md-avatar', 'md-menu', 'md-list', 'md-list-item', 'md-divider'],
      mocks: {
        $keycloak: keycloak,
        $ml,
      },
    });
    wrapper.vm.logout();
  });

  it('correctly updates the language', () => {
    setGlobals();
    Object.keys(localStorageLight).forEach((key) => {
      global.window.localStorage.setItem(key, localStorageLight[key]);
    });
    const material = { theming: () => null };
    const wrapper = shallowMount(ToolbarAvatar, {
      stubs: ['md-button', 'md-icon', 'md-switch', 'md-menu-item', 'md-menu-content', 'md-avatar', 'md-menu', 'md-list', 'md-list-item', 'md-divider'],
      mocks: {
        $material: material,
        $ml,
      },
    });
    expect(global.window.localStorage.getItem('vue-user-language')).toEqual('english');
    wrapper.vm.updateLanguage('french');
    wrapper.vm.$forceUpdate();
    expect(global.window.localStorage.getItem('vue-user-language')).toEqual('french');
  });
});
