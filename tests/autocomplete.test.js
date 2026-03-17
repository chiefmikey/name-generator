import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import AutocompleteInput from '../src/components/AutocompleteInput.vue';

const testOptions = [
  'apple',
  'apricot',
  'avocado',
  'banana',
  'blueberry',
  'cherry',
];

function mountAc(properties = {}) {
  return mount(AutocompleteInput, {
    props: {
      label: 'Test',
      modelValue: '',
      options: testOptions,
      ...properties,
    },
  });
}

describe('AutocompleteInput', () => {
  it('mounts with label', () => {
    const wrapper = mountAc();

    expect(wrapper.find('.input-label').text()).toBe('Test');
  });

  it('renders input with placeholder', () => {
    const wrapper = mountAc({ placeholder: 'Type here...' });
    const input = wrapper.find('input');

    expect(input.attributes('placeholder')).toBe('Type here...');
  });

  it('shows no hint when input is empty', () => {
    const wrapper = mountAc();

    expect(wrapper.vm.hint).toBe('');
    expect(wrapper.find('.ac-ghost').exists()).toBe(false);
  });

  it('shows hint for prefix match', () => {
    const wrapper = mountAc({ modelValue: 'ap' });

    expect(wrapper.vm.hint).toBe('ple');
  });

  it('shows hint for single-char input', () => {
    const wrapper = mountAc({ modelValue: 'b' });

    expect(wrapper.vm.hint).toBe('anana');
  });

  it('shows no hint when exact match', () => {
    const wrapper = mountAc({ modelValue: 'apple' });

    expect(wrapper.vm.hint).toBe('');
  });

  it('shows no hint when no match', () => {
    const wrapper = mountAc({ modelValue: 'xyz' });

    expect(wrapper.vm.hint).toBe('');
  });

  it('hint is case-insensitive', () => {
    const wrapper = mountAc({ modelValue: 'AP' });

    expect(wrapper.vm.hint).toBe('ple');
  });

  it('shows ghost overlay when hint exists', () => {
    const wrapper = mountAc({ modelValue: 'ch' });

    expect(wrapper.find('.ac-ghost').exists()).toBe(true);
    expect(wrapper.find('.ac-hint').text()).toBe('erry');
  });

  it('fullMatch returns matched option', () => {
    const wrapper = mountAc({ modelValue: 'blu' });

    expect(wrapper.vm.fullMatch).toBe('blueberry');
  });

  it('fullMatch returns null for no match', () => {
    const wrapper = mountAc({ modelValue: 'xyz' });

    expect(wrapper.vm.fullMatch).toBeNull();
  });

  it('emits update on input', async () => {
    const wrapper = mountAc();
    const input = wrapper.find('input');
    await input.setValue('test');

    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')[0]).toEqual(['test']);
  });

  it('accepts hint with Tab key', async () => {
    const wrapper = mountAc({ modelValue: 'ap' });
    const input = wrapper.find('input');
    input.element.selectionStart = 2;
    await input.trigger('keydown', { key: 'Tab' });

    const emitted = wrapper.emitted('update:modelValue');

    expect(emitted).toBeTruthy();
    expect(emitted[0]).toEqual(['apple']);
  });

  it('accepts hint with ArrowRight key', async () => {
    const wrapper = mountAc({ modelValue: 'ban' });
    const input = wrapper.find('input');
    input.element.selectionStart = 3;
    await input.trigger('keydown', { key: 'ArrowRight' });

    const emitted = wrapper.emitted('update:modelValue');

    expect(emitted).toBeTruthy();
    expect(emitted[0]).toEqual(['banana']);
  });

  it('does not accept hint when cursor is not at end', async () => {
    const wrapper = mountAc({ modelValue: 'ap' });
    const input = wrapper.find('input');
    input.element.selectionStart = 1;
    await input.trigger('keydown', { key: 'Tab' });

    expect(wrapper.emitted('update:modelValue')).toBeFalsy();
  });

  it('does not emit on Tab when no hint', async () => {
    const wrapper = mountAc({ modelValue: 'xyz' });
    const input = wrapper.find('input');
    input.element.selectionStart = 3;
    await input.trigger('keydown', { key: 'Tab' });

    expect(wrapper.emitted('update:modelValue')).toBeFalsy();
  });

  it('does not show error until touched', () => {
    const wrapper = mountAc({ error: 'Not valid' });

    expect(wrapper.vm.touched).toBe(false);
    expect(wrapper.vm.showError).toBeFalsy();
    expect(wrapper.find('.error-text').classes()).toContain(
      'error-text-hidden',
    );
  });

  it('shows error after blur when error exists', async () => {
    const wrapper = mountAc({ error: 'Not valid' });
    const input = wrapper.find('input');
    await input.trigger('blur');

    expect(wrapper.vm.touched).toBe(true);
    expect(wrapper.vm.showError).toBeTruthy();
    expect(wrapper.find('.error-text').text()).toBe('Not valid');
    expect(wrapper.find('.error-text').classes()).not.toContain(
      'error-text-hidden',
    );
  });

  it('hides error when no error even if touched', async () => {
    const wrapper = mountAc({ error: '' });
    const input = wrapper.find('input');
    await input.trigger('blur');

    expect(wrapper.vm.touched).toBe(true);
    expect(wrapper.vm.showError).toBeFalsy();
    expect(wrapper.find('.error-text').classes()).toContain(
      'error-text-hidden',
    );
  });

  it('resets touched when input cleared', async () => {
    const wrapper = mountAc({ error: 'Not valid' });
    const input = wrapper.find('input');
    await input.trigger('blur');

    expect(wrapper.vm.touched).toBe(true);

    await input.setValue('');

    expect(wrapper.vm.touched).toBe(false);
  });
});
