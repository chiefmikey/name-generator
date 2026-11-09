import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import App from '../src/components/App.vue';

let wolfeCapture;

beforeEach(() => {
  wolfeCapture = vi.fn();
  vi.stubGlobal('wolfeTelemetry', { capture: wolfeCapture });
  vi.stubGlobal('localStorage', {
    getItem: vi.fn(() => null),
    removeItem: vi.fn(),
    setItem: vi.fn(),
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('name_step flow events', () => {
  it('fires steps 1..3 once each as the form completes, content-free', async () => {
    const wrapper = mount(App);
    await wrapper.find('[data-testid="birthday-month"]').setValue('3');
    await wrapper.find('[data-testid="birthday-day"]').setValue('4');
    await wrapper.find('[data-testid="animal-input"]').setValue('dog');
    await wrapper.find('[data-testid="fruit-input"]').setValue('apple');
    await wrapper.find('[data-testid="fruit-input"]').setValue('apples');

    const steps = wolfeCapture.mock.calls.filter(
      ([event]) => event === 'name_step',
    );

    expect(steps.map(([, p]) => p)).toEqual([
      { step: 1 },
      { step: 2 },
      { step: 3 },
    ]);
  });

  it('reports a refused clipboard write as name_copy_failed', async () => {
    vi.stubGlobal('navigator', {
      clipboard: { writeText: vi.fn().mockRejectedValue(new Error('no')) },
    });
    const wrapper = mount(App);
    await wrapper.setData({ emoResult: 'x', mainResult: 'a_b_c' });
    await wrapper.find('[data-testid="result-card"]').trigger('click');
    await Promise.resolve();
    await Promise.resolve();

    expect(wolfeCapture).toHaveBeenCalledWith('name_copy_failed', {
      mode: 'normal',
    });
  });
});
