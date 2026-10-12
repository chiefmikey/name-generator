import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import ChooseBirthday from '../src/components/ChooseBirthday.vue';

function mountBirthday(properties = {}) {
  return mount(ChooseBirthday, { props: { modelValue: '', ...properties } });
}

function lastEmit(wrapper) {
  const events = wrapper.emitted('update:modelValue');
  return events ? events.at(-1)[0] : undefined;
}

function dayValues(wrapper) {
  return wrapper
    .findAll('select')[1]
    .findAll('option')
    .map((o) => o.element.value)
    .filter(Boolean);
}

describe('ChooseBirthday', () => {
  it('emits month-day when both are set', async () => {
    const wrapper = mountBirthday();
    const [month, day] = wrapper.findAll('select');
    await month.setValue('3');
    await day.setValue('14');

    expect(lastEmit(wrapper)).toBe('3-14');
  });

  it('emits empty string when the day is cleared', async () => {
    const wrapper = mountBirthday({ modelValue: '3-14' });
    await wrapper.findAll('select')[1].setValue('');

    expect(lastEmit(wrapper)).toBe('');
  });

  it('emits empty string when the month is cleared', async () => {
    const wrapper = mountBirthday({ modelValue: '3-14' });
    await wrapper.findAll('select')[0].setValue('');

    expect(lastEmit(wrapper)).toBe('');
  });

  it('limits day options to the month maximum', async () => {
    const wrapper = mountBirthday();
    const month = wrapper.findAll('select')[0];

    expect(dayValues(wrapper)).toHaveLength(31);

    await month.setValue('2');

    expect(dayValues(wrapper)).toHaveLength(29);

    await month.setValue('4');

    expect(dayValues(wrapper)).toHaveLength(30);

    await month.setValue('12');

    expect(dayValues(wrapper)).toHaveLength(31);
  });

  it('clears the day and emits empty when month change makes it invalid', async () => {
    const wrapper = mountBirthday({ modelValue: '1-31' });
    await wrapper.findAll('select')[0].setValue('4');

    expect(wrapper.findAll('select')[1].element.value).toBe('');
    expect(lastEmit(wrapper)).toBe('');
  });

  it('keeps a valid day when month changes', async () => {
    const wrapper = mountBirthday({ modelValue: '1-15' });
    await wrapper.findAll('select')[0].setValue('2');

    expect(wrapper.findAll('select')[1].element.value).toBe('15');
    expect(lastEmit(wrapper)).toBe('2-15');
  });

  it('syncs selects from modelValue and reflects parent resets', async () => {
    const wrapper = mountBirthday({ modelValue: '7-4' });
    const [month, day] = wrapper.findAll('select');

    expect(month.element.value).toBe('7');
    expect(day.element.value).toBe('4');

    await wrapper.setProps({ modelValue: '' });

    expect(month.element.value).toBe('');
    expect(day.element.value).toBe('');
  });

  it('keeps a partial selection when the parent echoes empty', async () => {
    const wrapper = mountBirthday();
    await wrapper.findAll('select')[0].setValue('5');
    await wrapper.setProps({ modelValue: '' });

    expect(wrapper.findAll('select')[0].element.value).toBe('5');
  });

  it.each([
    'abc',
    '13-1',
    '0-5',
    '2-30',
    '4-31',
    '3',
    '3-',
    '-3',
    '1-2-3',
    '1.5-2',
  ])('ignores malformed value %s', (value) => {
    const wrapper = mountBirthday({ modelValue: value });
    const [month, day] = wrapper.findAll('select');

    expect(month.element.value).toBe('');
    expect(day.element.value).toBe('');
  });
});
