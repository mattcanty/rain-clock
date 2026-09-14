---
name: Rain Clock
description: A hyper-local rain forecast read at a glance off an analog clock face.
colors:
  ink: "#161616"
  surface: "#ffffff"
  neutral-border: "#e0e0e0"
  neutral-quiet: "#c1c7cd"
  label-muted: "#525252"
  accent-instrument: "#0f62fe"
  rain-fill: "#b0c4de"
  rain-edge: "#4682b4"
  rain-light: "#a6c8ff"
  rain-moderate: "#4589ff"
  rain-heavy: "#0043ce"
typography:
  display:
    fontFamily: "HelveticaNeue-Light, 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif"
    fontSize: "0.032 (SVG user units, scaled to the dial)"
    fontWeight: 300
    lineHeight: normal
    letterSpacing: normal
  body:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: normal
    letterSpacing: normal
rounded:
  none: "0px"
  xsmall: "2px"
  small: "4px"
  medium: "8px"
  large: "16px"
  xlarge: "24px"
spacing:
  none: "0px"
  miniscule: "2px"
  xsmall: "4px"
  small: "8px"
  medium: "16px"
  large: "24px"
  xlarge: "32px"
components:
  quick-actions-toolbar:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.medium}"
    padding: "{spacing.small}"
---

# Design System: Rain Clock

## 1. Overview

**Creative North Star: "The Instrument on the Wall"**

Rain Clock reads as a well-made analog instrument that happens to know about rain, not as software wearing a clock skin. Everything on the dial — the bezel, the ticks, the hands, the intensity rings — belongs to the visual grammar of a real watch or barometer: thin metal, deliberate weight differences between major and minor marks, and restraint everywhere color could otherwise shout. The page around the dial stays out of the way: a quiet title bar, a quiet attribution strip, nothing that asks for a second look.

This system explicitly rejects the conventions of a weather app. No numeric read-outs competing with the dial, no settings screens, no card grids of forecast data, no dashboard chrome. If a change would make this look more like software and less like an instrument, it's the wrong change, per [[PRODUCT.md]]'s "reads like an instrument, not an app" principle.

**Key Characteristics:**
- One signature surface (the dial) carries almost the entire visual identity; page chrome is minimal by design, not by neglect.
- Two font stacks by role, not by accident: a light instrument face for anything drawn on the dial, plain system sans for page chrome.
- Color is functional before it's decorative — blue only appears where it's telling you about rain.
- Flat by default; the one shadow in the system is soft and ambient, never a card-style drop shadow.

## 2. Colors

The palette is two systems layered on one page: a small IBM Carbon–derived neutral/accent set for UI chrome, and a dedicated blue family reserved entirely for rain.

### Primary
- **Instrument Blue** (`#0f62fe`): the one accent color in the chrome layer. Used sparingly — today, only the clock's second hand and its center cap. Reserved for "this is the one moving, live thing," not for decoration.

### Secondary
- **Rain Fill** (`#b0c4de`) / **Rain Edge** (`#4682b4`): the forecast area itself — the filled shape sweeping around the dial that shows how close rain is, and its stroke. This exact pair already reappears as the footer's background and link color; treat that repetition as intentional, not coincidental, and keep using it as the project's "rain" identity rather than introducing a second blue for the same idea.

### Tertiary
- **Rain Light / Moderate / Heavy** (`#a6c8ff` / `#4589ff` / `#0043ce`): the three intensity-band rings on the dial, one step darker per step of severity. Each band is also differentiated by dash pattern (fine dots → dashes → solid), not color alone, so the bands stay legible without relying on hue — required by [[PRODUCT.md]]'s WCAG AA commitment.

### Neutral
- **Ink** (`#161616`): the hour/minute hands and the major (5-minute) ticks — the "always readable at a glance" marks.
- **Quiet Gray** (`#c1c7cd`): the bezel rim and the minor (1-minute) ticks — present but recessive.
- **Muted Label** (`#525252`): the Light/Moderate/Heavy text labels on the dial.
- **Surface** (`#ffffff`): the page background; there is no secondary/tinted surface anywhere yet.
- **Border** (`#e0e0e0`): the one hairline border in use, around the quick-actions toolbar.

### Named Rules
**The One Accent Rule.** Instrument Blue (`#0f62fe`) marks the single live, moving element (the second hand). It does not spread to buttons, links, or backgrounds — that would compete with the rain-blue system for meaning.

**The Two Blues Never Mix Rule.** Chrome accent blue (`#0f62fe`) and rain blue (`#b0c4de` → `#0043ce`) are different systems with different jobs — one says "this is interactive/live," the other says "this is how much rain." Don't reach for one where the other belongs.

## 3. Typography

**Display Font:** HelveticaNeue-Light (with Helvetica Neue, Helvetica, Arial, Lucida Grande fallbacks)
**Body Font:** Arial (with Helvetica, sans-serif fallback)

**Character:** The display face is used exclusively inside the dial's SVG — a light weight chosen for the same reason a real watch uses a thin engraved numeral: precision without shouting. The body face is a plain, unstyled system sans used wherever there's page chrome, because chrome isn't supposed to earn attention here.

### Hierarchy
- **Display** (weight 300, ≈0.032 SVG units, normal line-height): the Light / Moderate / Heavy band labels drawn on the dial. The only place this face is used.
- **Body** (weight 400, 16px, normal line-height): the page title ("Rain Clock"), the footer attribution text, and any link text. Currently rendered at browser defaults — no explicit type scale has been layered on top of it yet.

### Named Rules
**The Dial-Only Display Rule.** The light instrument face never leaves the SVG. Page chrome (the title, the footer) stays on the plain body stack — mixing the two outside the dial would blur the "instrument vs. page" distinction the system depends on.

## 4. Elevation

The system is flat almost everywhere, with exactly one exception: the header bar carries a soft, non-directional ambient shadow (`box-shadow: 0 0 8px 2px grey`) that separates it from the page without implying it's "lifted" or interactive. Nothing else — not the footer, not the quick-actions toolbar, not the dial itself — casts a shadow. Depth on the dial is conveyed by stroke weight and layering order (rim → bands → ticks → hands), not by elevation.

### Shadow Vocabulary
- **Ambient Separator** (`box-shadow: 0 0 8px 2px grey`): the header bar only. Marks "this is a fixed chrome region," not "this is elevated/interactive."

### Named Rules
**The Flat-Instrument Rule.** Nothing on the dial gets a drop shadow. A watch face doesn't cast a shadow on itself; depth comes from line weight and layering, matching the "instrument, not app" north star.

## 5. Components

### Header Bar
- **Layout:** flex row, space-between, vertically centered, `12px` horizontal padding (a pre-existing exception to the spacing scale — don't extend that pattern to new components; use `{spacing.small}`/`{spacing.medium}` instead).
- **Treatment:** white background, the one Ambient Separator shadow, a single GitHub icon-link on the right.
- **Content:** an unstyled `<h1>` at browser defaults — no custom type scale applied yet.

### Footer Bar
- **Background:** Rain Fill (`#b0c4de`), full-width.
- **Text:** default body text color; links in Rain Edge (`#4682b4`), no underline.
- **Padding:** `24px` (`{spacing.large}`).
- **Content:** attribution text, left-aligned, with a secondary link pushed to the far end via `justify-self: flex-end`.

### Quick Actions Toolbar
- **Shape:** `{rounded.medium}` (8px) corners.
- **Border:** `{colors.neutral-border}` hairline, `1px` solid — the only bordered surface in the system.
- **Layout:** flex row, `{spacing.small}` gap and padding, groups the location and simulate icon buttons.
- **Icon buttons inside it:** currently bare `<button>` elements with an inline SVG icon and no dedicated hover/focus/active/disabled treatment — a real gap against the WCAG AA target in [[PRODUCT.md]]. Any new icon button work should give these real states before adding more of them.

### The Clock Face (signature component)
The one component that carries the brand. Two SVGs stacked on the same square, sharing a viewBox:
- **Bezel:** a Quiet Gray (`#c1c7cd`) rim circle at the dial's outer radius.
- **Ticks:** 60 total, evenly spaced 6° apart. Major ticks (every 5th, Ink `#161616`, thicker) mark the 12 "hour" positions; minor ticks (Quiet Gray, thinner) fill the rest — deliberately dense so no position on the dial reads as a gap.
- **Rain bands:** three dashed/solid rings (Light → Heavy) positioned dynamically against the live forecast scale, each labeled in the display font.
- **Forecast fill:** the Rain Fill/Rain Edge area sweeping the dial, redrawn on a 400ms transition whenever new forecast data arrives.
- **Hands:** hour and minute in Ink with rounded caps; the second hand alone in Instrument Blue, ticking once a second.

## 6. Do's and Don'ts

### Do:
- **Do** keep every rain-intensity encoding doubled — color step *and* dash pattern (dots/dashes/solid) — never color alone.
- **Do** reuse Rain Fill/Rain Edge (`#b0c4de` / `#4682b4`) for anything else that represents "the forecast" itself, the same pair already shared by the footer and the dial fill.
- **Do** keep tick and hand stroke-width proportioned to their length (`stroke-linecap: round` on a mark shorter than its width renders as a blob, not a tick — this already happened once on the hour marks and was fixed).
- **Do** give the quick-action icon buttons real default/hover/focus/active states before shipping more of them, per [[PRODUCT.md]]'s WCAG AA commitment.

### Don't:
- **Don't** add menus, numeric read-outs, settings screens, or dashboard-style chrome — [[PRODUCT.md]]'s standing anti-reference is exactly this: anything that turns the dial into a data app undercuts the one-glance premise.
- **Don't** add card grids, drop shadows, or any "lifted" surface treatment. The only sanctioned shadow is the header's Ambient Separator; the dial itself never casts one.
- **Don't** let Instrument Blue (`#0f62fe`) spread beyond the second hand into buttons, links, or backgrounds — that's the rain-blue system's territory.
- **Don't** hardcode new one-off spacing values (the header's `12px` is a pre-existing exception, not a precedent) — use the `{spacing.*}` scale.
- **Don't** mix the display (dial) font into page chrome, or the body font into the dial. They mark different registers on purpose.
