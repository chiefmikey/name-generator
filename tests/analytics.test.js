import { beforeEach, describe, expect, it, vi } from 'vitest';

const posthogMock = vi.hoisted(() => ({ capture: vi.fn(), init: vi.fn() }));

vi.mock('posthog-js', () => ({ default: posthogMock }));

async function load() {
  vi.resetModules();
  return import('../src/lib/analytics');
}

beforeEach(() => {
  posthogMock.capture.mockReset();
  posthogMock.init.mockReset();
});

describe('initAnalytics options', () => {
  it('passes the exact hardened options', async () => {
    const { initAnalytics } = await load();
    initAnalytics();

    expect(posthogMock.init).toHaveBeenCalledTimes(1);

    const [key, options] = posthogMock.init.mock.calls[0];

    expect(key).toBe('phc_qwmTbmBYEBvZfpK8L8wZNmMsknSu2itJDpQjJ5FfndE4');

    const { before_send: beforeSend, ...rest } = options;

    expect(typeof beforeSend).toBe('function');
    expect(rest).toEqual({
      advanced_disable_flags: true,
      api_host: 'https://e.wolfe.works',
      autocapture: false,
      capture_dead_clicks: false,
      capture_exceptions: false,
      capture_heatmaps: false,
      capture_pageleave: false,
      capture_pageview: false,
      capture_performance: false,
      disable_conversations: true,
      disable_external_dependency_loading: true,
      disable_product_tours: true,
      disable_session_recording: true,
      disable_surveys: true,
      disable_web_experiments: true,
      ip: false,
      persistence: 'memory',
      person_profiles: 'identified_only',
      rageclick: false,
      save_referrer: false,
    });
    expect(options).not.toHaveProperty('ui_host');
  });
});

describe('before_send PII stripping', () => {
  it('removes query/hash from URLs and drops referrers', async () => {
    const { initAnalytics } = await load();
    initAnalytics();
    const { before_send: beforeSend } = posthogMock.init.mock.calls[0][1];
    const result = beforeSend({
      $set_once: {
        $initial_current_url: 'https://h/p#h',
        $initial_referrer: 'https://x.com/?a=1',
      },
      event: '$pageview',
      properties: {
        $current_url: 'https://name.hullowurld.com/path?email=a@b.c#frag',
        $initial_referrer: 'https://google.com/?q=x',
        $initial_referring_domain: 'google.com',
        $pathname: '/path?x=1',
        $referrer: 'https://example.com/secret?token=1',
        $referring_domain: 'example.com',
        keep: 'me',
      },
    });

    expect(result.properties).toEqual({
      $current_url: 'https://name.hullowurld.com/path',
      $pathname: '/path',
      keep: 'me',
    });
    expect(result.$set_once).toEqual({ $initial_current_url: 'https://h/p' });
  });

  it('passes null through', async () => {
    const { sanitizeEvent } = await load();

    expect(sanitizeEvent(null)).toBeNull();
  });
});

describe('graceful failure', () => {
  it('does not throw when init throws and stays disabled', async () => {
    posthogMock.init.mockImplementation(() => {
      throw new Error('storage');
    });
    const { capture, capturePageView, initAnalytics } = await load();

    expect(() => initAnalytics()).not.toThrow();
    expect(initAnalytics()).toBeNull();
    expect(() => capture('x')).not.toThrow();
    expect(() => capturePageView()).not.toThrow();
    expect(posthogMock.init).toHaveBeenCalledTimes(1);
    expect(posthogMock.capture).not.toHaveBeenCalled();
  });

  it('does not throw when capture throws', async () => {
    posthogMock.capture.mockImplementation(() => {
      throw new Error('network');
    });
    const { capture, capturePageView, initAnalytics } = await load();
    initAnalytics();

    expect(() => capture('x', { a: 1 })).not.toThrow();
    expect(() => capturePageView()).not.toThrow();
  });

  it('capture works lazily and sends events when healthy', async () => {
    const { capture, capturePageView } = await load();
    capture('evt', { a: 1 });
    capturePageView({ b: 2 });

    expect(posthogMock.init).toHaveBeenCalledTimes(1);

    const calls = posthogMock.capture.mock.calls.map((call) =>
      call.slice(0, 2),
    );

    expect(calls).toEqual([
      ['evt', { a: 1 }],
      ['$pageview', { b: 2 }],
    ]);
  });
});
