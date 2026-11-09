# Analytics events

Telemetry follows the Wolfe telemetry standard v2 (action trail): the shared
loader tag in `public/index.html` (`data-site="name-generator"`) handles
pageviews, page leave, clicks, errors and web vitals, cookie-free, with a
replayable trail of actions. Every control carries a `data-testid` or label so
an action can be replayed as a Playwright test. The app adds the custom events
below through `window.wolfeTelemetry.capture` (`src/lib/analytics.ts`).
Properties are enumerated values only; never names, birthdays, animals or fruits.

The app has no sign-up. The main task is a three-step flow, then the outcome.

| Event | Trigger | Props |
| --- | --- | --- |
| `name_step {step}` | A form step becomes complete: 1 birthday chosen, 2 animal recognized, 3 fruit recognized | `step` (1, 2 or 3) |
| `name_generated` | Generate button clicked (the flow outcome) | `cache_hit` (boolean) |
| `name_copied` | Result clicked and copied to clipboard (share/export) | `mode` (`normal` or `emo`) |
| `name_copy_failed` | Clipboard write was refused (recoverable: click again) | `mode` (`normal` or `emo`) |
| `emo_mode_toggled` | Emo toggle flipped while a result is showing | `enabled` (boolean) |
| `result_reset` | An input changed and cleared the shown result | `field` (`birthday`, `animal`, `fruit`) |
| `input_unrecognized` | Animal or fruit entry became an unrecognized value (recoverable: edit the entry) | `field` (`animal`, `fruit`) |

Test hooks for replaying the trail: `birthday-month`, `birthday-day`,
`animal-input`, `fruit-input`, `generate-button`, `result-card`, `emo-toggle`.

Keep telemetry on in any future e2e tests; the loader tags those events `e2e`.
