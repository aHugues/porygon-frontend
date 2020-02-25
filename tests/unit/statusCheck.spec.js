import { shallowMount } from '@vue/test-utils';
import StatusCheck from '@/components/misc/StatusCheck.vue';

const stubs = ['md-icon'];

const Status = {
  WAITING: 0,
  VALID: 1,
  ERROR: 2,
  WARNING: 3,
};

describe('StatusCheckComponent', () => {
  it('Loads on empty props', async () => {
    const wrapper = shallowMount(StatusCheck, {
      stubs,
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.getClass()).toBe('');
    expect(wrapper.vm.getIconName()).toBe('');
  });

  it('Loads on successful check', async () => {
    const wrapper = shallowMount(StatusCheck, {
      stubs,
      propsData: {
        statusName: 'test status',
        statusCheck: Status.VALID,
      },
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.statusCheck).toBe(wrapper.vm.status.VALID);
    expect(wrapper.vm.getClass()).toBe('check-valid');
    expect(wrapper.vm.getIconName()).toBe('check_circle');
  });

  it('Loads on loading', async () => {
    const wrapper = shallowMount(StatusCheck, {
      stubs,
      propsData: {
        statusName: 'test status',
        statusCheck: Status.WAITING,
      },
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.statusCheck).toBe(wrapper.vm.status.WAITING);
    expect(wrapper.vm.getClass()).toBe('check-waiting');
    expect(wrapper.vm.getIconName()).toBe('pause_circle_filled');
  });

  it('Loads on failed check', async () => {
    const wrapper = shallowMount(StatusCheck, {
      stubs,
      propsData: {
        statusName: 'test status',
        statusCheck: Status.ERROR,
      },
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.statusCheck).toBe(wrapper.vm.status.ERROR);
    expect(wrapper.vm.getClass()).toBe('check-error');
    expect(wrapper.vm.getIconName()).toBe('remove_circle');
  });

  it('Loads on warning', async () => {
    const wrapper = shallowMount(StatusCheck, {
      stubs,
      propsData: {
        statusName: 'test status',
        statusCheck: Status.WARNING,
      },
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.statusCheck).toBe(wrapper.vm.status.WARNING);
    expect(wrapper.vm.getClass()).toBe('check-warning');
    expect(wrapper.vm.getIconName()).toBe('error');
  });
});
