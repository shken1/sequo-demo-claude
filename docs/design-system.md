# Design system — Cyberpunk Vintage

Neon accents on a dark, worn retro background with chunky old-school typography for a gritty cyberpunk habit tracker.

This file is the single source of truth for how the app LOOKS. It was chosen by the founder during planning. Logic steps build working, functional UI; each design prompt then styles that UI with exactly these values. Never introduce a colour, font, radius or spacing that is not here — extend this file first, deliberately.

## Mode

Dark by default.

## Colours

| Token      | Hex       | Use                                                  |
| ---------- | --------- | ---------------------------------------------------- |
| background | `#0a0a0a` | The page                                             |
| surface    | `#1f1a17` | Cards, panels, inputs, menus                         |
| text       | `#e0e0e0` | Body text and headings                               |
| muted      | `#9a8e7f` | Secondary text, hints, captions, placeholders        |
| border     | `#3a2f28` | Dividers, input and card borders                     |
| primary    | `#00f3ff` | The main action: primary buttons, links, focus rings |
| on-primary | `#111111` | Text and icons drawn on primary                      |
| accent     | `#ff00aa` | Highlights, badges, charts, selected states          |

Error, warning and success colours are not part of the palette: use the UI library's defaults, adjusted only as far as needed to stay readable on this background.

## Typography

- Headings: **Press Start 2P**
- Body and UI: **VT323**
- Code, numbers, ids: **VT323**
- All three are on Google Fonts: https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap (or load them with the framework's own font loader).

## Shape and density

- Corner radius: 4px on buttons, inputs and cards.
- Density: **comfortable**. Spacing unit 4px; controls (buttons, inputs) about 40px tall; 12–16px between related items, 32px between sections.

## Style rules

- Heavy scanline and subtle CRT grain texture on all surfaces
- Chunky pixel-style headings with strong letter spacing
- Neon primary and accent colors glow with soft text-shadows
- Worn paper-like noise texture layered over dark surfaces
- Retro terminal-style body text with monospace feel
- Buttons have a slight 3D bevel and hover brightens the neon

## Tokens

Define these once, globally, and reference them everywhere — never repeat a raw value in a component.

```css
:root {
  --color-background: #0a0a0a;
  --color-surface: #1f1a17;
  --color-text: #e0e0e0;
  --color-muted: #9a8e7f;
  --color-border: #3a2f28;
  --color-primary: #00f3ff;
  --color-on-primary: #111111;
  --color-accent: #ff00aa;
  --font-heading: "Press Start 2P", ui-sans-serif, system-ui, sans-serif;
  --font-body: "VT323", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "VT323", ui-monospace, monospace;
  --radius: 4px;
  --space-unit: 4px;
  --control-height: 40px;
}
```

## How design work happens in this project

- Each step's main prompt covers logic and structure. Where a step adds or changes UI, Sequo provides a separate design prompt, run in a fresh agent session after the logic prompt has finished.
- A design prompt changes presentation only — styles, classes, layout polish, fonts, colours. It never changes behaviour, data, routes or tests.
- The first design prompt that runs also sets up the tokens above and loads the fonts, if they are not in place yet.
