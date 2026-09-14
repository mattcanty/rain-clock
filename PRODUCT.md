# Product

## Register

product

## Platform

web

## Users

Anyone who lands on rainclock.mattcanty.com — a public, anonymous visitor with no account and no return-visit assumption. The job to be done is narrow and immediate: check whether it's about to rain, right now, without reading a forecast or navigating a weather app.

## Product Purpose

Rain Clock overlays a hyper-local, next-hour rain forecast onto a familiar analog clock face, so a visitor can tell whether rain is coming in the next hour from a single glance — no numbers to parse, no screens to navigate, nothing to tap. Success is a visitor getting their answer without needing to think about the interface at all.

## Positioning

It answers "will it rain soon" in the time it takes to glance at a clock — where a normal weather app asks for a tap, a load, and a scroll through numbers first.

## Brand Personality

Calm and ambient rather than alarming; **instrument-like** rather than app-like — it should read as a well-made analog dial (a watch, a barometer, a gauge) that happens to show rain, not as software wearing a clock skin. Precision belongs in the craft of the ticks and hands, not in dense data on screen.

## Anti-references

No specific bad-example sites were named. The standing rule instead comes from the purpose itself: anything that turns this into a data-app — menus, numeric read-outs, settings screens, dashboard chrome — undercuts the one-glance premise and should be treated as the thing to avoid, even if it would be normal in a weather app.

## Design Principles

- **One glance, zero interaction.** Every change should shorten time-to-answer, not add controls, copy, or reading.
- **Reads like an instrument, not an app.** Favor the visual grammar of a real analog dial — bezel, ticks, hands — over dashboard or card-based software conventions.
- **Calm by default.** The face stays legible and quiet at rest; visual weight (heavier rings, bolder marks) should only increase when the forecast genuinely warrants it, never as decoration.
- **No login, no memory.** Every visitor is a first-time, anonymous visitor. Nothing should assume a returning user or a saved state.
- **Public and unowned.** This is a shared tool a stranger lands on cold, not a personal dashboard for its author.

## Accessibility & Inclusion

WCAG AA is a real target, not a nice-to-have. Because rain intensity is encoded in the blue rings, intensity must stay distinguishable by more than hue alone (the current light/moderate/heavy rings already differ by dash pattern, not just color — keep that). Text labels and tick marks need to hold contrast against the background at rest and against the forecast fill when it overlaps them. Any future motion (hand ticks, transitions) should have a reduced-motion fallback.
