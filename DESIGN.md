# Todo Frontend Design System

## 1. Atmosphere & Identity

The Todo frontend feels like a calm control surface: dark, glass-tinted panels over a deep night background, with cool cyan accents reserved for actions and status. The signature is layered clarity — the UI should feel focused and readable even as filters, counts, and result states update.

## 2. Color

### Palette

| Role | Token | Light | Dark | Usage |
|------|-------|-------|------|-------|
| Surface/primary | `--surface-primary` | `#ffffff` | `#0f172a` | Main panel background |
| Surface/secondary | `--surface-secondary` | `#f8fafc` | `#111c34` | Nested cards and toolbars |
| Surface/elevated | `--surface-elevated` | `#ffffff` | `#16233f` | Interactive controls |
| Text/primary | `--text-primary` | `#0f172a` | `#f8fafc` | Primary copy |
| Text/secondary | `--text-secondary` | `#475569` | `#cbd5e1` | Supporting copy |
| Text/tertiary | `--text-tertiary` | `#64748b` | `#94a3b8` | Muted metadata |
| Border/default | `--border-default` | `#cbd5e1` | `rgba(148, 163, 184, 0.18)` | Card outlines |
| Border/strong | `--border-strong` | `#94a3b8` | `rgba(125, 211, 252, 0.34)` | Selected states |
| Accent/primary | `--accent-primary` | `#0ea5e9` | `#38bdf8` | Active filters, focus, highlights |
| Accent/secondary | `--accent-secondary` | `#0284c7` | `#7dd3fc` | Hover and code accents |
| Status/success | `--status-success` | `#16a34a` | `#22c55e` | Healthy backend badge |
| Status/error | `--status-error` | `#dc2626` | `#f87171` | Error badges and messages |
| Status/warning | `--status-warning` | `#d97706` | `#fbbf24` | Empty or attention states |

### Rules

- Use accent colors only for selected or actionable states.
- Keep text contrast high against the dark surfaces.
- New colors must be added here before they appear in CSS.

## 3. Typography

### Scale

| Level | Size | Weight | Line Height | Tracking | Usage |
|-------|------|--------|-------------|----------|-------|
| Display | `clamp(2.25rem, 4vw, 3.75rem)` | 700 | 1.05 | `-0.02em` | Page title |
| H1 | `1.75rem` | 600 | 1.2 | `-0.01em` | Primary panel headings |
| H2 | `1.05rem` | 600 | 1.4 | `0` | Section titles |
| Body/lg | `1.1rem` | 400 | 1.7 | `0` | Lead paragraph |
| Body | `1rem` | 400 | 1.6 | `0` | Default copy |
| Body/sm | `0.875rem` | 400 | 1.5 | `0` | Supportive text |
| Caption | `0.8rem` | 600 | 1.3 | `0.12em` | Eyebrows and labels |

### Font Stack

- Primary: `Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
- Mono: `'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace`

### Rules

- Keep body text at `0.875rem` or larger.
- Use the mono stack only for code and environment values.
- Headings can clamp, but should remain within the documented scale.

## 4. Spacing & Layout

### Base Unit

All spacing derives from **4px**.

| Token | Value | Usage |
|-------|-------|-------|
| `--space-1` | `4px` | Tight inline gaps |
| `--space-2` | `8px` | Compact control spacing |
| `--space-3` | `12px` | Input padding and stacks |
| `--space-4` | `16px` | Standard gaps |
| `--space-5` | `20px` | Comfortable group spacing |
| `--space-6` | `24px` | Card padding |
| `--space-8` | `32px` | Section spacing |
| `--space-12` | `48px` | Page padding |

### Grid

- Max content width: `960px`
- Breakpoints: `sm 640px`, `md 768px`, `lg 1024px`, `xl 1280px`
- Layout pattern: centered stack with nested responsive grids

### Rules

- Primary content must collapse to one readable column on mobile.
- Filters and search can wrap, but must keep alignment and hierarchy.
- Spacing intent should come from the token set; intrinsic layout mechanics may stay raw.

## 5. Components

### Surface Card
- **Structure**: panel wrapper with heading, supporting copy, and inner sections
- **Variants**: hero card, nested section card
- **Spacing**: `--space-6`, `--space-8`
- **States**: default only
- **Accessibility**: semantic headings and landmarks
- **Motion**: none required
- **Layout**: stack

### Filter Chip
- **Structure**: text button in a horizontal group
- **Variants**: default, active
- **Spacing**: `--space-2`, `--space-3`
- **States**: default, hover, focus-visible, active
- **Accessibility**: keyboard reachable, `aria-pressed` reflects state
- **Motion**: 160ms transform/color transition
- **Layout**: cluster

### Search Field
- **Structure**: labeled input with helper label above the control
- **Variants**: default
- **Spacing**: `--space-2`, `--space-3`, `--space-4`
- **States**: default, focus-visible, placeholder
- **Accessibility**: persistent label and visible focus ring
- **Motion**: 160ms border/background transition
- **Layout**: stack

### Todo List Item
- **Structure**: title/meta block with trailing status badge
- **Variants**: active todo, completed todo
- **Spacing**: `--space-4`, `--space-5`
- **States**: default only
- **Accessibility**: readable text contrast, no information conveyed by color alone
- **Motion**: none required
- **Layout**: responsive cluster

### Status Badge
- **Structure**: compact pill
- **Variants**: success, error, active, completed
- **Spacing**: `--space-1`, `--space-3`
- **States**: default only
- **Accessibility**: text label always present
- **Motion**: none required
- **Layout**: inline cluster

## 6. Motion & Interaction

### Timing

| Type | Duration | Easing | Usage |
|------|----------|--------|-------|
| Micro | `160ms` | `ease-out` | Filter chip and input transitions |
| Standard | `220ms` | `ease-in-out` | Card and state color changes |

### Rules

- Animate only `transform`, `opacity`, `border-color`, or `background-color`.
- Every interactive control needs hover and focus-visible states.
- Reduced-motion users should still get instant, readable state changes.

## 7. Depth & Surface

### Strategy

Use a **mixed** depth system: soft borders plus tinted shadows.

| Level | Value | Usage |
|-------|-------|-------|
| Subtle | `0 16px 40px rgba(15, 23, 42, 0.28)` | Nested sections |
| Default | `0 24px 60px rgba(15, 23, 42, 0.35)` | Primary cards |

## 8. Accessibility Constraints & Accepted Debt

### Constraints

- Target WCAG 2.2 AA contrast for copy and controls.
- Every filter button and input must be keyboard reachable.
- Filter state cannot rely on color alone; active state uses contrast, border, and `aria-pressed`.

### Accepted Debt

| Item | Location | Why accepted | Owner / Exit |
|------|----------|--------------|--------------|
| None currently | — | — | — |
