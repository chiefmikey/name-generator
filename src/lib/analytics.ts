import posthogJs, { type CaptureOptions, type PostHog, type Properties } from 'posthog-js';

// Kill switch. The self-hosted PostHog backend was frozen on
// 2026-09-28. While false, init and capture are no-ops: no SDK load, no network
// requests, no console errors. Flip to true only after POSTHOG_HOST/KEY point
// at a live backend.
const ANALYTICS_ENABLED = false as boolean;
// Intentionally empty: the backend address is private and must not be committed.
const POSTHOG_HOST = '';
const POSTHOG_KEY = '';

let posthogInstance: PostHog | null = null;

export function initAnalytics(): PostHog {
  if (ANALYTICS_ENABLED) {
    posthogJs.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      autocapture: false,
      capture_pageview: false,
      disable_session_recording: true,
      persistence: 'memory',
      person_profiles: 'identified_only',
    });
  }
  posthogInstance = posthogJs;
  return posthogJs;
}

function getInstance(): PostHog {
  if (posthogInstance === null) {
    return initAnalytics();
  }
  return posthogInstance;
}

export function capture(event: string, properties?: Properties, options?: CaptureOptions): void {
  if (!ANALYTICS_ENABLED) {
    return;
  }
  getInstance().capture(event, properties, options);
}

export function capturePageView(properties?: Properties): void {
  if (!ANALYTICS_ENABLED) {
    return;
  }
  getInstance().capture('$pageview', properties);
}
