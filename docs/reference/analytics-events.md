# Analytics events

Telemetry follows the Wolfe telemetry standard v1: the shared loader tag in
`public/index.html` (`data-site="name-generator"`) handles pageviews, page
leave, clicks, errors and web vitals, cookie-free. The app adds the custom
events below through `window.wolfeTelemetry.capture` (`src/lib/analytics.ts`).
Properties are enumerated values only; never names, birthdays, animals or fruits.

| Event | Trigger | Props |
| --- | --- | --- |
| `name_generated` | Generate button clicked | `cache_hit` (boolean) |
| `name_copied` | Result clicked and copied to clipboard | `mode` (`normal` or `emo`) |
| `emo_mode_toggled` | Emo toggle flipped while a result is showing | `enabled` (boolean) |
| `result_reset` | An input changed and cleared the shown result | `field` (`birthday`, `animal`, `fruit`) |
| `input_unrecognized` | Animal or fruit entry became an unrecognized value | `field` (`animal`, `fruit`) |

Keep telemetry on in any future e2e tests; the loader tags those events `e2e`.
