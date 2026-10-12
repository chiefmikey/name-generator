import posthogJs, {
  type CaptureOptions,
  type CaptureResult,
  type PostHog,
  type Properties,
} from 'posthog-js';

// Public event-intake host (capture-only proxy) and publishable project key.
// Both are safe to commit; the private PostHog dashboard host must never
// appear in this public repo (never set ui_host).
const ANALYTICS_ENABLED = true as boolean;
const POSTHOG_HOST = 'https://e.wolfe.works';
const POSTHOG_KEY = 'phc_qwmTbmBYEBvZfpK8L8wZNmMsknSu2itJDpQjJ5FfndE4';

// Properties holding a full URL or path: query string and hash are removed.
const URL_PROPERTIES = new Set([
  '$current_url',
  '$initial_current_url',
  '$pathname',
  '$initial_pathname',
  '$prev_pageview_pathname',
  '$prev_pageview_last_pathname',
]);

// Properties that reveal where the visitor came from: dropped entirely.
const REFERRER_PROPERTIES = new Set([
  '$referrer',
  '$referring_domain',
  '$initial_referrer',
  '$initial_referring_domain',
]);

let posthogInstance: PostHog | null = null;
let analyticsDisabled = false;

function stripQueryAndHash(value: unknown): unknown {
  if (typeof value !== 'string') {
    return value;
  }
  const end = value.search(/[#?]/u);
  return end === -1 ? value : value.slice(0, end);
}

function sanitizeProperties(properties: Properties): Properties {
  return Object.fromEntries<unknown>(
    Object.entries(properties)
      .filter(([key]) => !REFERRER_PROPERTIES.has(key))
      .map(([key, value]): [string, unknown] => [
        key,
        URL_PROPERTIES.has(key) ? stripQueryAndHash(value) : value,
      ]),
  );
}

export function sanitizeEvent(
  event: CaptureResult | null,
): CaptureResult | null {
  if (event === null) {
    return null;
  }
  const sanitized = {
    ...event,
    properties: sanitizeProperties(event.properties),
  };
  if (event.$set !== undefined) {
    sanitized.$set = sanitizeProperties(event.$set);
  }
  if (event.$set_once !== undefined) {
    sanitized.$set_once = sanitizeProperties(event.$set_once);
  }
  return sanitized;
}

export function initAnalytics(): PostHog | null {
  if (!ANALYTICS_ENABLED || analyticsDisabled) {
    return null;
  }
  try {
    posthogJs.init(POSTHOG_KEY, {
      advanced_disable_flags: true,
      api_host: POSTHOG_HOST,
      autocapture: false,
      before_send: sanitizeEvent,
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
  } catch {
    analyticsDisabled = true;
    posthogInstance = null;
    return null;
  }
  posthogInstance = posthogJs;
  return posthogJs;
}

function getInstance(): PostHog | null {
  return posthogInstance ?? initAnalytics();
}

export function capture(
  event: string,
  properties?: Properties,
  options?: CaptureOptions,
): void {
  try {
    getInstance()?.capture(event, properties, options);
  } catch {
    // Analytics must never break the app.
  }
}

export function capturePageView(properties?: Properties): void {
  capture('$pageview', properties);
}
