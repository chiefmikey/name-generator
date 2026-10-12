import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import App from '../src/components/App.vue';
import animals from '../src/data/animals.json';

function mountApp() {
  return mount(App, {
    global: {
      stubs: {
        transition: false,
      },
    },
  });
}

function stubStorage(overrides = {}) {
  const storage = {
    getItem: vi.fn(() => null),
    removeItem: vi.fn(),
    setItem: vi.fn(),
    ...overrides,
  };
  vi.stubGlobal('localStorage', storage);
  return storage;
}

async function fill(wrapper, data = {}) {
  await wrapper.setData({
    animal: 'dog',
    birthday: '3-15',
    fruit: 'apple',
    ...data,
  });
}

beforeEach(() => {
  vi.useFakeTimers();
  stubStorage();
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('prototype key handling', () => {
  const badKeys = ['constructor', 'constructors', '__proto__', 'toString'];

  it.each(badKeys)('resolveAnimal rejects %s', (key) => {
    const wrapper = mountApp();

    expect(wrapper.vm.resolveAnimal(key)).toBeNull();
  });

  it.each(badKeys)('resolveFruit rejects %s', (key) => {
    const wrapper = mountApp();

    expect(wrapper.vm.resolveFruit(key)).toBeNull();
  });

  it('shows errors and is not ready for prototype keys', async () => {
    const wrapper = mountApp();
    await fill(wrapper, { animal: 'constructor', fruit: '__proto__' });

    expect(wrapper.vm.animalError).toBe('Not a recognized animal');
    expect(wrapper.vm.fruitError).toBe('Not a recognized fruit');
    expect(wrapper.vm.isReady).toBe(false);
  });

  it('still rejects the default animal key', () => {
    const wrapper = mountApp();

    expect(wrapper.vm.resolveAnimal('default')).toBeNull();
  });

  it('generate never produces undefined or function text', async () => {
    const wrapper = mountApp();
    await fill(wrapper, { animal: 'constructors', fruit: 'constructor' });
    wrapper.vm.generate();
    vi.advanceTimersByTime(800);
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.mainResult).not.toMatch(/undefined|function/u);
    expect(wrapper.vm.emoResult).not.toMatch(/undefined|function/u);
  });
});

describe('cache validation', () => {
  const invalid = {
    array: JSON.stringify([1, 2]),
    'empty strings': JSON.stringify({ emoResult: '', mainResult: '' }),
    'huge string': JSON.stringify({
      emoResult: 'e',
      mainResult: 'x'.repeat(5000),
    }),
    'malformed json': '{not json',
    'missing fields': '{}',
    'null literal': 'null',
    'numeric fields': JSON.stringify({ emoResult: 2, mainResult: 1 }),
  };

  it.each(Object.entries(invalid))('discards %s', async (_name, value) => {
    const storage = stubStorage({ getItem: vi.fn(() => value) });
    const wrapper = mountApp();
    await fill(wrapper);
    wrapper.vm.generate();

    expect(storage.removeItem).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.generating).toBe(true);

    vi.advanceTimersByTime(800);
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.generating).toBe(false);
    expect(wrapper.vm.mainResult.length).toBeGreaterThan(0);
    expect(wrapper.vm.mainResult.length).toBeLessThan(200);
  });

  it('uses a valid cached entry', async () => {
    const storage = stubStorage({
      getItem: vi.fn(() =>
        JSON.stringify({ emoResult: 'emo!', mainResult: 'main!' }),
      ),
    });
    const wrapper = mountApp();
    await fill(wrapper);
    wrapper.vm.generate();

    expect(wrapper.vm.mainResult).toBe('main!');
    expect(wrapper.vm.emoResult).toBe('emo!');
    expect(wrapper.vm.generating).toBe(false);
    expect(storage.removeItem).not.toHaveBeenCalled();
  });

  it('shares a cache key for trimmed inputs', async () => {
    const wrapper = mountApp();
    await fill(wrapper, { animal: 'Dog ', fruit: ' Apple' });
    const first = wrapper.vm.getCacheKey();
    await fill(wrapper, { animal: 'dog', fruit: 'apple' });

    expect(wrapper.vm.getCacheKey()).toBe(first);
  });
});

describe('storage failures', () => {
  it('still displays the result when setItem throws', async () => {
    stubStorage({
      setItem: vi.fn(() => {
        throw new Error('QuotaExceededError');
      }),
    });
    const wrapper = mountApp();
    await fill(wrapper);
    wrapper.vm.generate();
    vi.advanceTimersByTime(800);
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.generating).toBe(false);
    expect(wrapper.vm.hasResult).toBe(true);
  });

  it('generates when getItem and removeItem throw', async () => {
    stubStorage({
      getItem: vi.fn(() => {
        throw new Error('SecurityError');
      }),
      removeItem: vi.fn(() => {
        throw new Error('SecurityError');
      }),
    });
    const wrapper = mountApp();
    await fill(wrapper);
    wrapper.vm.generate();
    vi.advanceTimersByTime(800);
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.generating).toBe(false);
    expect(wrapper.vm.hasResult).toBe(true);
  });

  it('survives removeItem throwing on an invalid entry', async () => {
    stubStorage({
      getItem: vi.fn(() => 'garbage'),
      removeItem: vi.fn(() => {
        throw new Error('nope');
      }),
    });
    const wrapper = mountApp();
    await fill(wrapper);
    wrapper.vm.generate();
    vi.advanceTimersByTime(800);
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.hasResult).toBe(true);
  });
});

async function ready() {
  const wrapper = mountApp();
  await wrapper.setData({ copied: false, mainResult: 'abc' });
  return wrapper;
}

describe('copyResult', () => {
  it('does not throw or set copied when clipboard is undefined', async () => {
    vi.stubGlobal('navigator', {});
    const wrapper = await ready();
    await wrapper.vm.copyResult();

    expect(wrapper.vm.copied).toBe(false);
  });

  it('does not set copied when writeText rejects', async () => {
    const writeText = vi.fn(() => Promise.reject(new Error('denied')));
    vi.stubGlobal('navigator', { clipboard: { writeText } });
    const wrapper = await ready();
    await wrapper.vm.copyResult();

    expect(writeText).toHaveBeenCalledWith('abc');
    expect(wrapper.vm.copied).toBe(false);
  });

  it('sets copied on success and clears it later', async () => {
    const writeText = vi.fn(() => Promise.resolve());
    vi.stubGlobal('navigator', { clipboard: { writeText } });
    const wrapper = await ready();
    await wrapper.vm.copyResult();

    expect(wrapper.vm.copied).toBe(true);

    vi.advanceTimersByTime(1500);

    expect(wrapper.vm.copied).toBe(false);
  });
});

describe('generation races', () => {
  it('ignores a second generate while generating', async () => {
    const storage = stubStorage();
    const wrapper = mountApp();
    await fill(wrapper);
    wrapper.vm.generate();
    wrapper.vm.generate();
    vi.advanceTimersByTime(800);
    await wrapper.vm.$nextTick();

    expect(storage.setItem).toHaveBeenCalledTimes(1);
    expect(vi.getTimerCount()).toBe(0);
  });

  it('disables the button while generating', async () => {
    const wrapper = mountApp();
    await fill(wrapper);
    wrapper.vm.generate();
    await wrapper.vm.$nextTick();

    expect(wrapper.find('.generate-btn').attributes('disabled')).toBeDefined();
  });

  it('uses the click-time snapshot when inputs change mid-generation', async () => {
    const storage = stubStorage();
    vi.spyOn(Math, 'random').mockReturnValue(0);

    expect(animals.dog[0]).not.toBe(animals.cat[0]);

    const wrapper = mountApp();
    await fill(wrapper);
    const oldKey = wrapper.vm.getCacheKey();
    wrapper.vm.generate();
    await wrapper.setData({ animal: 'cat' });
    vi.advanceTimersByTime(800);
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.generating).toBe(false);
    expect(wrapper.vm.hasResult).toBe(false);
    expect(storage.setItem).toHaveBeenCalledTimes(1);

    const [key, value] = storage.setItem.mock.calls[0];

    expect(key).toBe(oldKey);
    expect(JSON.parse(value).mainResult).toContain(animals.dog[0]);
  });
});
