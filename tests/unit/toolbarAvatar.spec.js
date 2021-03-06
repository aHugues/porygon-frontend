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

const mockUser = {
  login: 'username',
  firstName: 'John',
  lastName: 'Doe',
  email: 'user@email.com',
};

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
  __esModule: true,
  get: jest.fn(() => Promise.resolve({ data: mockUser })),
  default: jest.fn((request) => Promise.resolve({ request, data: mockUser })),
}));

describe('ToolbarAvatar.vue', () => {
  it('selects the correct theme when light', () => {
    setGlobals();
    const material = { theming: () => null };
    Object.keys(localStorageLight).forEach((key) => {
      global.window.localStorage.setItem(key, localStorageLight[key]);
    });
    const wrapper = shallowMount(ToolbarAvatar, {
      stubs: ['md-button', 'md-icon', 'md-switch', 'md-menu-item', 'md-menu-content', 'md-avatar', 'md-menu', 'md-list', 'md-list-item', 'md-divider'],
      mocks: {
        $ml,
        $material: material,
      },
    });
    expect(wrapper.vm.darkTheme).toEqual(false);
  });

  it('selects the correct theme when dark', () => {
    setGlobals();
    const material = { theming: () => null };
    Object.keys(localStorageDark).forEach((key) => {
      global.window.localStorage.setItem(key, localStorageDark[key]);
    });
    const wrapper = shallowMount(ToolbarAvatar, {
      stubs: ['md-button', 'md-icon', 'md-switch', 'md-menu-item', 'md-menu-content', 'md-avatar', 'md-menu', 'md-list', 'md-list-item', 'md-divider'],
      mocks: {
        $ml,
        $material: material,
      },
    });
    expect(wrapper.vm.darkTheme).toEqual(true);
  });

  it('correctly computes the initials', () => {
    setGlobals();
    const material = { theming: () => null };
    Object.keys(localStorageDark).forEach((key) => {
      global.window.localStorage.setItem(key, localStorageDark[key]);
    });
    const wrapper = shallowMount(ToolbarAvatar, {
      stubs: ['md-button', 'md-icon', 'md-switch', 'md-menu-item', 'md-menu-content', 'md-avatar', 'md-menu', 'md-list', 'md-list-item', 'md-divider'],
      mocks: {
        $ml,
        $material: material,
      },
    });
    expect(wrapper.vm.userInitials).toEqual('J');
  });

  it('correctly computes the initials for composed nouns', () => {
    setGlobals();
    const material = { theming: () => null };
    Object.keys(localStorageComposed).forEach((key) => {
      global.window.localStorage.setItem(key, localStorageComposed[key]);
    });
    const wrapper = shallowMount(ToolbarAvatar, {
      stubs: ['md-button', 'md-icon', 'md-switch', 'md-menu-item', 'md-menu-content', 'md-avatar', 'md-menu', 'md-list', 'md-list-item', 'md-divider'],
      mocks: {
        $ml,
        $material: material,
      },
    });
    expect(wrapper.vm.userInitials).toEqual('JJ');
  });

  it('correctly computes the initials when unknown', () => {
    setGlobals();
    const material = { theming: () => null };
    global.window.localStorage.clear();
    Object.keys(localStorageUndefined).forEach((key) => {
      global.window.localStorage.setItem(key, localStorageUndefined[key]);
    });
    const wrapper = shallowMount(ToolbarAvatar, {
      stubs: ['md-button', 'md-icon', 'md-switch', 'md-menu-item', 'md-menu-content', 'md-avatar', 'md-menu', 'md-list', 'md-list-item', 'md-divider'],
      mocks: {
        $ml,
        $material: material,
      },
    });
    expect(global.window.localStorage.getItem('vue-user-firstname')).not.toBeTruthy();
    expect(wrapper.vm.userInitials).toEqual('-');
  });

  it('correctly updates the theme when updated', async () => {
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
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.darkTheme).toEqual(true);
    expect(global.window.localStorage.getItem('vue-user-theme')).toEqual('porygon-dark');
    wrapper.vm.darkTheme = false;
    wrapper.vm.$forceUpdate();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.darkTheme).toEqual(false);
    expect(global.window.localStorage.getItem('vue-user-theme')).toEqual('porygon-light');
  });

  it('correctly calls the logout function', async () => {
    const calledRoutes = [];
    const $router = {
      go: (route) => { calledRoutes.push(route); },
    };
    setGlobals();
    Object.keys(localStorageLight).forEach((key) => {
      global.window.localStorage.setItem(key, localStorageLight[key]);
    });
    const material = { theming: () => null };
    const wrapper = shallowMount(ToolbarAvatar, {
      stubs: ['md-button', 'md-icon', 'md-switch', 'md-menu-item', 'md-menu-content', 'md-avatar', 'md-menu', 'md-list', 'md-list-item', 'md-divider'],
      mocks: {
        $ml,
        $material: material,
        $router,
      },
    });
    wrapper.vm.logout();
    await wrapper.vm.$nextTick();
    expect(calledRoutes).toStrictEqual(['/']);
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
