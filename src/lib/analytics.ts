// Telemetry comes from the shared Wolfe loader tag in public/index.html, which
// exposes window.wolfeTelemetry. Events are content-free: enumerated values only.
interface WolfeTelemetry {
  capture: (event: string, properties?: Record<string, unknown>) => void;
}

export function capture(
  event: string,
  properties?: Record<string, unknown>,
): void {
  try {
    (globalThis as { wolfeTelemetry?: WolfeTelemetry }).wolfeTelemetry?.capture(
      event,
      properties,
    );
  } catch {
    // Analytics must never break the app.
  }
}
