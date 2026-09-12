import posthogJs, { type CaptureOptions, type PostHog, type Properties } from 'posthog-js';

const POSTHOG_HOST = 'https://analytics.wolfe.family';
const POSTHOG_KEY = 'phc_qwmTbmBYEBvZfpK8L8wZNmMsknSu2itJDpQjJ5FfndE4';

let posthogInstance: PostHog | null = null;

export function initAnalytics(): PostHog {
  posthogJs.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    autocapture: false,
    capture_pageview: false,
    disable_session_recording: true,
    persistence: 'memory',
    person_profiles: 'identified_only',
  });
  posthogInstance = posthogJs;
  return posthogJs;
}

function getInstance(): PostHog {
  if (posthogInstance === null) {
    initAnalytics();
  }
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return posthogInstance!;
}

export function capture(event: string, properties?: Properties, options?: CaptureOptions): void {
  getInstance().capture(event, properties, options);
}

export function capturePageView(properties?: Properties): void {
  getInstance().capture('$pageview', properties);
}
