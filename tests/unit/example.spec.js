import { shallowMount } from '@vue/test-utils';
import HelloWorld from '@/components/HelloWorld.vue';

describe('HelloWorld.vue', () => {
  it('renders props.msg when passed', () => {
    const msg = 'Test Test';
    const wrapper = shallowMount(HelloWorld, {
      propsData: { msg },
      stubs: ['md-button'],
    });
    expect(wrapper.text()).toMatch(msg);
  });
});
