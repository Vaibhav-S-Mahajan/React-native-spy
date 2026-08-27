# Design System — Dark Dev-Tool Theme

Layered-darkness dense design system (GitHub Dark / Linear / Vercel style) applied to this Electron + React devtools app.

---

## Surface Layers

Every panel uses a distinct shade. Adjacent areas never share the same surface color.

| Token              | Hex       | Usage                              |
| ------------------ | --------- | ---------------------------------- |
| `--bg-app`         | `#0a0a0c` | Outermost background, window       |
| `--bg-sidebar`     | `#0d0d10` | Nav, header bars                   |
| `--bg-panel-alt`   | `#0e0e11` | Toolbars, secondary panels         |
| `--bg-panel`       | `#111114` | Main content area                  |
| `--bg-card`        | `#17171b` | Rows, modals, menus                |
| `--bg-card-hover`  | `#1c1c21` | Hovered rows/cards                 |
| `--bg-input`       | `#18181c` | Input fields                       |
| `--bg-code-block`  | `#0c0c0f` | Code blocks, JSON bodies           |

---

## Borders

Three tiers — use the lightest touch needed for separation.

| Token              | Hex       | Usage                        |
| ------------------ | --------- | ---------------------------- |
| `--border-subtle`  | `#222226` | Row dividers, light lines    |
| `--border-default` | `#2a2a30` | Panel boundaries             |
| `--border-strong`  | `#3a3a42` | Focused inputs, emphasis     |

---

## Typography

Dense line-heights (1.3). Monospace only for data/code, never for UI labels.

| Token          | Size    | Usage                                |
| -------------- | ------- | ------------------------------------ |
| `--text-xs`    | 11px    | Badges, meta labels, section headers |
| `--text-sm`    | 12.5px  | Table cells, sidebar items, most UI  |
| `--text-base`  | 13.5px  | Body default (rarely used)           |
| `--text-md`    | 15px    | Section headers                      |
| `--text-lg`    | 20px    | Page titles                          |

**Fonts:**
- UI: `Inter, -apple-system, sans-serif`
- Mono: `JetBrains Mono, Menlo, monospace`

**Section labels:** uppercase, `letter-spacing: 0.06em`, `--text-tertiary` color.

---

## Text Colors

| Token               | Usage                              |
| ------------------- | ---------------------------------- |
| `--text-primary`    | Headings, active items, emphasis   |
| `--text-secondary`  | Body text, data values             |
| `--text-tertiary`   | Muted labels, placeholders         |

---

## Status Colors — Triplet Pattern

Each status has background + text + border:

| Status  | Background | Text       | Border     |
| ------- | ---------- | ---------- | ---------- |
| Success | `#10261b`  | `#4ade80`  | `#1e4530`  |
| Warning | `#2a1d0e`  | `#f5a623`  | `#4a3417`  |
| Danger  | `#2a1414`  | `#f87171`  | `#4a1f1f`  |
| Info    | `#12202e`  | `#60a5fa`  | `#1e3a5f`  |

Used as badge styles and row background tints for errors/warnings.

---

## Accent Colors

| Token               | Hex       | Usage                    |
| ------------------- | --------- | ------------------------ |
| `--accent-primary`  | `#22c55e` | CTA buttons, success     |
| `--accent-brand`    | `#a78bfa` | Brand marks              |
| `--accent-link`     | `#60a5fa` | Links, info highlights   |

**Rule:** Green is reserved for primary actions + success only.

---

## Spacing Scale

| Token        | Value |
| ------------ | ----- |
| `--space-1`  | 4px   |
| `--space-2`  | 6px   |
| `--space-3`  | 10px  |
| `--space-4`  | 14px  |
| `--space-5`  | 20px  |
| `--space-6`  | 28px  |

---

## Component Heights

| Element         | Height |
| --------------- | ------ |
| Header bar      | 40px   |
| Tab bar         | 32px   |
| Table rows      | 32px   |
| Filter toolbar  | 30px   |
| Buttons (CTA)   | 28px   |
| Buttons (ghost) | 24px   |
| Inputs          | 26–28px|

---

## Data Table Pattern

CSS Grid for alignment:

```
grid-template-columns: 56px 1fr 60px 60px 60px
```

- Column headers: uppercase, 10px, tracked, tertiary
- Rows: monospace for data values
- Hover: `--bg-card-hover`
- Selected: distinct highlight background

---

## Filter Chips (Log Levels)

Toggleable chips per level:

- **Active:** `border: 1px solid {levelColor}`, `background: {levelBg}`, `color: {levelColor}`
- **Inactive:** `border: 1px solid var(--border-subtle)`, `color: var(--text-tertiary)`

10px uppercase monospace with count badges.

---

## Electron Window Config

```js
{
  backgroundColor: '#0a0a0c',
  titleBarStyle: 'hiddenInset',
  // Traffic light spacer: 62px for macOS integration
}
```

---

## Light Theme (Dual-Theme Support)

Define both palettes under `[data-theme]` on `<html>`. Light theme inverts surfaces, darkens/saturates status colors for contrast on white (e.g. warning `#f5a623` → `#b4620a`). Add subtle `box-shadow` to cards since border-only separation reads flat on white.
