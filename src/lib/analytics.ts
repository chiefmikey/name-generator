import posthogJs, { type CaptureOptions, type PostHog, type Properties } from 'posthog-js';

// Public event-intake host (capture-only proxy) and publishable project key.
// Both are safe to commit; the private PostHog dashboard host must never
// appear in this public repo (never set ui_host).
const ANALYTICS_ENABLED = true as boolean;
const POSTHOG_HOST = 'https://e.wolfe.works';
const POSTHOG_KEY = 'phc_qwmTbmBYEBvZfpK8L8wZNmMsknSu2itJDpQjJ5FfndE4';

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
