import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import App from '../src/components/App.vue';

function mountApp() {
  return mount(App, {
    global: {
      stubs: {
        transition: false,
      },
    },
  });
}

beforeEach(() => {
  vi.stubGlobal('localStorage', {
    getItem: vi.fn(() => null),
    setItem: vi.fn(),
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('App component', () => {
  it('mounts successfully', () => {
    const wrapper = mountApp();

    expect(wrapper.find('.title').text()).toBe('NAME GENERATOR');
  });

  it('shows normal subtitle by default', () => {
    const wrapper = mountApp();

    expect(wrapper.find('.subtitle').text()).toBe(
      'Something wonderful is about to happen',
    );
  });

  it('shows emo subtitle when emo is toggled', async () => {
    const wrapper = mountApp();
    await wrapper.setData({ emo: true });

    expect(wrapper.find('.subtitle').text()).toBe(
      'Something dark stirs within',
    );
  });

  it('generate button is disabled when form is empty', () => {
    const wrapper = mountApp();
    const button = wrapper.find('.generate-btn');

    expect(button.attributes('disabled')).toBeDefined();
  });

  it('generate button enables when all fields are filled', async () => {
    const wrapper = mountApp();
    await wrapper.setData({
      animal: 'dog',
      birthday: '3-15',
      fruit: 'apple',
    });
    const button = wrapper.find('.generate-btn');

    expect(button.attributes('disabled')).toBeUndefined();
  });

  it('generate button stays disabled with invalid animal', async () => {
    const wrapper = mountApp();
    await wrapper.setData({
      animal: 'notananimal',
      birthday: '3-15',
      fruit: 'apple',
    });

    expect(wrapper.vm.isReady).toBe(false);
  });

  it('generate button stays disabled with invalid fruit', async () => {
    const wrapper = mountApp();
    await wrapper.setData({
      animal: 'dog',
      birthday: '3-15',
      fruit: 'notafruit',
    });

    expect(wrapper.vm.isReady).toBe(false);
  });

  it('generates a name on button click', async () => {
    vi.useFakeTimers();
    const wrapper = mountApp();
    await wrapper.setData({
      animal: 'dog',
      birthday: '3-15',
      fruit: 'apple',
    });
    await wrapper.find('.generate-btn').trigger('click');

    expect(wrapper.vm.generating).toBe(true);

    vi.advanceTimersByTime(900);
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.generating).toBe(false);
    expect(wrapper.vm.mainResult).toBeTruthy();
    expect(wrapper.vm.emoResult).toBeTruthy();
    expect(wrapper.vm.postMessage).toBeTruthy();
    expect(wrapper.vm.emoPostMessage).toBeTruthy();

    vi.useRealTimers();
  });

  it('caches generated names in localStorage', async () => {
    vi.useFakeTimers();
    const wrapper = mountApp();
    await wrapper.setData({
      animal: 'dog',
      birthday: '3-15',
      fruit: 'apple',
    });
    await wrapper.find('.generate-btn').trigger('click');
    vi.advanceTimersByTime(900);
    await wrapper.vm.$nextTick();

    expect(localStorage.setItem).toHaveBeenCalled();

    vi.useRealTimers();
  });

  it('uses cached result when available', async () => {
    localStorage.getItem.mockReturnValue(
      JSON.stringify({
        emoResult: 'x_cached_x',
        mainResult: 'cached_Name_123',
      }),
    );
    const wrapper = mountApp();
    await wrapper.setData({
      animal: 'dog',
      birthday: '3-15',
      fruit: 'apple',
    });
    wrapper.vm.generate();
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.mainResult).toBe('cached_Name_123');
    expect(wrapper.vm.emoResult).toBe('x_cached_x');
  });

  it('displays normal result by default', async () => {
    const wrapper = mountApp();
    await wrapper.setData({
      emoPostMessage: 'Dead inside',
      emoResult: '_xXx_broken_Buddy_666_xXx_',
      mainResult: 'excited_Buddy_103',
      postMessage: 'No refunds',
    });

    expect(wrapper.vm.displayResult).toBe('excited_Buddy_103');
  });

  it('displays emo result when toggled', async () => {
    const wrapper = mountApp();
    await wrapper.setData({
      emo: true,
      emoPostMessage: 'Dead inside',
      emoResult: '_xXx_broken_Buddy_666_xXx_',
      mainResult: 'excited_Buddy_103',
      postMessage: 'No refunds',
    });

    expect(wrapper.vm.displayResult).toBe('_xXx_broken_Buddy_666_xXx_');
  });

  it('button text shows post-message after generation', async () => {
    const wrapper = mountApp();
    await wrapper.setData({
      emoPostMessage: 'Dead inside',
      emoResult: '_xXx_broken_Buddy_666_xXx_',
      mainResult: 'excited_Buddy_103',
      postMessage: 'No refunds',
    });

    expect(wrapper.vm.buttonText).toBe('No refunds');
  });

  it('button text shows emo post-message in emo mode', async () => {
    const wrapper = mountApp();
    await wrapper.setData({
      emo: true,
      emoPostMessage: 'Dead inside',
      emoResult: '_xXx_broken_Buddy_666_xXx_',
      mainResult: 'excited_Buddy_103',
      postMessage: 'No refunds',
    });

    expect(wrapper.vm.buttonText).toBe('Dead inside');
  });

  it('button text shows Transforming during generation', async () => {
    const wrapper = mountApp();
    await wrapper.setData({ generating: true });

    expect(wrapper.vm.buttonText).toBe('Transforming...');
  });

  it("button text shows Let's Go by default", () => {
    const wrapper = mountApp();

    expect(wrapper.vm.buttonText).toBe("Let's Go");
  });

  it('resets result when birthday changes', async () => {
    const wrapper = mountApp();
    await wrapper.setData({
      animal: 'dog',
      birthday: '3-15',
      emoPostMessage: 'Dead inside',
      emoResult: '_xXx_broken_Buddy_666_xXx_',
      fruit: 'apple',
      mainResult: 'excited_Buddy_103',
      postMessage: 'No refunds',
    });
    await wrapper.setData({ birthday: '4-20' });

    expect(wrapper.vm.mainResult).toBe('');
    expect(wrapper.vm.emoResult).toBe('');
    expect(wrapper.vm.emo).toBe(false);
    expect(wrapper.vm.postMessage).toBe('');
  });

  it('resets result when animal changes', async () => {
    const wrapper = mountApp();
    await wrapper.setData({
      animal: 'dog',
      birthday: '3-15',
      fruit: 'apple',
      mainResult: 'excited_Buddy_103',
    });
    await wrapper.setData({ animal: 'cat' });

    expect(wrapper.vm.mainResult).toBe('');
  });

  it('resets result when fruit changes', async () => {
    const wrapper = mountApp();
    await wrapper.setData({
      animal: 'dog',
      birthday: '3-15',
      fruit: 'apple',
      mainResult: 'excited_Buddy_103',
    });
    await wrapper.setData({ fruit: 'banana' });

    expect(wrapper.vm.mainResult).toBe('');
  });

  it('does not reset when toggling emo mode', async () => {
    const wrapper = mountApp();

    // Set emo first so the watcher doesn't fire resetResult
    await wrapper.setData({ emo: false });
    await wrapper.setData({
      emoPostMessage: 'Dead inside',
      emoResult: '_xXx_broken_Buddy_666_xXx_',
      mainResult: 'excited_Buddy_103',
      postMessage: 'No refunds',
    });

    // Now toggle emo - should NOT reset
    await wrapper.setData({ emo: true });

    expect(wrapper.vm.mainResult).toBe('excited_Buddy_103');
    expect(wrapper.vm.emoResult).toBe('_xXx_broken_Buddy_666_xXx_');
  });

  it('computes animalError for invalid input', async () => {
    const wrapper = mountApp();
    await wrapper.setData({ animal: 'notananimal' });

    expect(wrapper.vm.animalError).toBe('Not a recognized animal');
  });

  it('no animalError for valid input', async () => {
    const wrapper = mountApp();
    await wrapper.setData({ animal: 'dog' });

    expect(wrapper.vm.animalError).toBe('');
  });

  it('no animalError for empty input', async () => {
    const wrapper = mountApp();
    await wrapper.setData({ animal: '' });

    expect(wrapper.vm.animalError).toBe('');
  });

  it('computes fruitError for invalid input', async () => {
    const wrapper = mountApp();
    await wrapper.setData({ fruit: 'notafruit' });

    expect(wrapper.vm.fruitError).toBe('Not a recognized fruit');
  });

  it('no fruitError for valid input', async () => {
    const wrapper = mountApp();
    await wrapper.setData({ fruit: 'apple' });

    expect(wrapper.vm.fruitError).toBe('');
  });

  it('resultFontSize returns max for short names', () => {
    const wrapper = mountApp();

    expect(wrapper.vm.resultFontSize).toBe('1.5rem');
  });

  it('resultFontSize scales down for long names', async () => {
    const wrapper = mountApp();
    await wrapper.setData({
      mainResult: '_xXx_melancholic_Shadow_666_xXx_very_long_name_here_',
    });
    const size = Number.parseFloat(wrapper.vm.resultFontSize);

    expect(size).toBeLessThan(1.5);
    expect(size).toBeGreaterThanOrEqual(0.4);
  });

  it('resultFontSize returns min for very long names', async () => {
    const wrapper = mountApp();
    await wrapper.setData({
      mainResult: 'a'.repeat(70),
    });

    expect(wrapper.vm.resultFontSize).toBe('0.4rem');
  });

  it('resolveAnimal handles plurals', () => {
    const wrapper = mountApp();

    expect(wrapper.vm.resolveAnimal('dogs')).toBe('dog');
    expect(wrapper.vm.resolveAnimal('butterflies')).toBe('butterfly');
    expect(wrapper.vm.resolveAnimal('wolves')).toBe('wolf');
    expect(wrapper.vm.resolveAnimal('foxes')).toBe('fox');
  });

  it('resolveFruit handles plurals', () => {
    const wrapper = mountApp();

    expect(wrapper.vm.resolveFruit('apples')).toBe('apple');
    expect(wrapper.vm.resolveFruit('cherries')).toBe('cherry');
  });

  it('getSugar returns sugar value for known fruit', () => {
    const wrapper = mountApp();
    const sugar = wrapper.vm.getSugar('apple');

    expect(sugar).toBeTruthy();
    expect(sugar).not.toBe('0');
  });

  it('getSugar returns 0 for unknown fruit', () => {
    const wrapper = mountApp();

    expect(wrapper.vm.getSugar('notafruit')).toBe('0');
  });

  it('getPetName returns a string for known animal', () => {
    const wrapper = mountApp();
    const name = wrapper.vm.getPetName('dog');

    expect(typeof name).toBe('string');
    expect(name.length).toBeGreaterThan(0);
  });

  it('getPetName returns default name for unknown animal', () => {
    const wrapper = mountApp();
    const name = wrapper.vm.getPetName('notananimal');

    expect(typeof name).toBe('string');
    expect(name.length).toBeGreaterThan(0);
  });

  it('copies result to clipboard', async () => {
    const writeText = vi.fn().mockResolvedValue();
    vi.stubGlobal('navigator', { clipboard: { writeText } });
    vi.useFakeTimers();

    const wrapper = mountApp();
    await wrapper.setData({
      emoResult: 'x_test_x',
      mainResult: 'test_name_123',
    });
    wrapper.vm.copyResult();

    expect(writeText).toHaveBeenCalledWith('test_name_123');
    expect(wrapper.vm.copied).toBe(true);

    vi.advanceTimersByTime(1600);
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.copied).toBe(false);

    vi.useRealTimers();
  });

  it('result card is inactive when no result', () => {
    const wrapper = mountApp();

    expect(wrapper.find('.result-card-inactive').exists()).toBe(true);
  });

  it('result card is active when result exists', async () => {
    const wrapper = mountApp();
    await wrapper.setData({
      emoResult: 'x_test_x',
      mainResult: 'test_name',
    });

    expect(wrapper.find('.result-card-inactive').exists()).toBe(false);
  });

  it('result card is clickable when result exists', async () => {
    const wrapper = mountApp();
    await wrapper.setData({
      emoResult: 'x_test_x',
      mainResult: 'test_name',
    });

    expect(wrapper.find('.result-card-clickable').exists()).toBe(true);
  });

  it('depluralize returns empty for very short words', () => {
    const wrapper = mountApp();

    expect(wrapper.vm.depluralize('a')).toEqual([]);
    expect(wrapper.vm.depluralize('is')).toEqual([]);
  });

  it('generate button is disabled after result', async () => {
    vi.useFakeTimers();
    const wrapper = mountApp();
    await wrapper.setData({
      animal: 'dog',
      birthday: '3-15',
      fruit: 'apple',
    });
    await wrapper.find('.generate-btn').trigger('click');
    vi.advanceTimersByTime(900);
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.hasResult).toBe(true);
    expect(wrapper.find('.generate-btn').attributes('disabled')).toBeDefined();

    vi.useRealTimers();
  });

  it('pickRandom returns an element from the array', () => {
    const wrapper = mountApp();
    const array = ['a', 'b', 'c'];
    const result = wrapper.vm.pickRandom(array);

    expect(array).toContain(result);
  });
});
