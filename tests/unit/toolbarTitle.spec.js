import { shallowMount } from '@vue/test-utils';
import ToolbarTitle from '@/components/toolbar/ToolbarTitle.vue';

describe('ToolbarTitle.vue', () => {
  it('renders props.title when passed', () => {
    const title = 'Porygon';
    const wrapper = shallowMount(ToolbarTitle, {
      propsData: { title },
    });
    expect(wrapper.text()).toMatch(title);
  });
});
