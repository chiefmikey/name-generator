import { afterEach, describe, expect, it, vi } from 'vitest';

import { capture } from '../src/lib/analytics';

afterEach(() => {
  delete globalThis.wolfeTelemetry;
});

describe('capture', () => {
  it('forwards the event and properties to the shared loader', () => {
    const wolfeCapture = vi.fn();
    globalThis.wolfeTelemetry = { capture: wolfeCapture };

    capture('name_generated', { cache_hit: false });

    expect(wolfeCapture).toHaveBeenCalledWith('name_generated', {
      cache_hit: false,
    });
  });

  it('is a no-op when the loader is absent', () => {
    expect(() => capture('name_generated')).not.toThrow();
  });

  it('never throws when the loader throws', () => {
    globalThis.wolfeTelemetry = {
      capture: () => {
        throw new Error('boom');
      },
    };

    expect(() => capture('name_generated')).not.toThrow();
  });
});

describe('app wiring', () => {
  it('serves the loader tag in the static HTML', async () => {
    const { readFile } = await import('node:fs/promises');
    const html = await readFile('public/index.html', 'utf8');

    expect(html).toMatch(/src="https:\/\/e\.wolfe\.works\/static\/w\.js"/u);
    expect(html).toMatch(/data-site="name-generator"/u);
  });
});
