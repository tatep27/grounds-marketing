## Frontend architecture (Grounds marketing site)

This document describes the folder structure, design-token layering, and the rules for using the design system in the Next.js frontend.

### Scope
- Design system source of truth: **Figma variables + components**, accessed via **Figma MCP**.

---

## Folder structure

### App routes (Next.js App Router)
- `app/layout.tsx`: root layout and shared shell
- `app/globals.css`: global styles + token imports
- `app/page.tsx`: Home
- `app/about/page.tsx`: About

### UI composition
- `app/components/`: shared UI primitives (Button, Text, Section, Header, Footer)
- `app/sections/`: page-level composition blocks that assemble primitives into sections; keeps routes thin
- `app/lib/`: non-UI config/copy/helpers

### Design system / tokens
- `design-system/tokens/`
  - `base.tokens.json`
  - `aliases.tokens.json`
  - `typography.tokens.json`
- `design-system/generated/`
  - `tokens.css` (CSS variables consumed by the app)
  - `tokens.ts` (optional typed token names)

### Assets
- `public/brand/*`
- `public/images/*`

---

## Design token model (must match Figma)

The design system is organized into three variable collections:

### 1) Base (raw tokens; single source of truth)
- Raw, uncontextualized values:
  - Color shades (100–900 scale)
  - Scale values (all dimensions on an 8pt grid)
  - Type primitives (font family, weights)
- **Rule**: Base tokens are not consumed directly by UI components.

### 2) Aliases (semantic tokens; primary consumption layer)
- Semantic tokens like `surface-button`, `spacing-16`, etc.
- **Rule**: Every alias must link back to Base (no hard-coded numbers in aliases).
- **Rule**: UI components should consume Aliases for color/spacing/surfaces.

### 3) Typography (text styles; derived from Base)
- Text properties like H1 size, body line-height, paragraph spacing, etc.
- **Rule**: Typography values must link back to Base Scale/Type values.

---

## Token usage rules in code (strict)

### Layering rules
- **Components may reference only**:
  - `--alias-*` (semantic tokens)
  - `--typography-*` (typography tokens)
- **Components must not reference**:
  - `--base-*` (raw tokens)

### Naming conventions (CSS variables)
- Prefix variables by layer:
  - `--base-*`
  - `--alias-*`
  - `--typography-*`

### Where tokens live
- `design-system/generated/tokens.css` is the canonical runtime token source.
- `app/globals.css` imports `design-system/generated/tokens.css` before other styling rules.

---

## Figma MCP workflow (how we keep design and code aligned)

### What MCP is used for
- Pulling authoritative design context from Figma (variables/tokens and component details)
- Preventing divergence between Figma and the codebase

### Update discipline
- Token changes must be treated as code changes:
  - Proposed first
  - Reviewed/approved explicitly
  - Then applied in small, reviewable steps

---

## How the design system works (files + data flow)

This repo uses a **three-layer token model** where **Base** is the single source of truth and both **Aliases** and **Typography** reference Base.

### Source of truth (Figma)

We use three dedicated “token bridge” frames in the Grounds Figma file so Figma MCP can reliably return the full variable sets referenced by each collection:

- **Base frame**: `node-id=55-72` (node `55:72`)
- **Alias frame**: `node-id=56-74` (node `56:74`)
- **Typography frame**: `node-id=55-73` (node `55:73`)

### Source files (checked-in)

These are the canonical token sources in this repo:

- `design-system/tokens/base.tokens.json`
  - Contains **raw values** only (hex colors, scale numbers, font families, weights).
- `design-system/tokens/aliases.tokens.json`
  - Contains **no raw values**.
  - Every token value is `{ "$ref": "<path-in-base>" }`.
- `design-system/tokens/typography.tokens.json`
  - Contains **no raw values**.
  - Every token value is `{ "$ref": "scale/<n>" }` (and/or other Base type primitives if introduced later).

### Generated output (runtime)

- `design-system/generated/tokens.css`
  - This is what the app actually consumes at runtime.
  - It exposes CSS variables in three namespaces:
    - `--base-*` (raw literals)
    - `--alias-*` (`var(--base-...)` references only)
    - `--typography-*` (`var(--base-...)` references only)

### Build step (sync)

The sync script regenerates `tokens.css` from the checked-in JSON sources and enforces the layering rules:

- Script: `scripts/tokens/sync.mjs`
- Command: `npm run tokens:sync`

If an Alias or Typography token contains a raw value (instead of `$ref`), or if a `$ref` points to a Base token path that doesn’t exist, the sync script fails.

### App wiring

- `app/globals.css` imports `design-system/generated/tokens.css` immediately after Tailwind, making the CSS variables available everywhere.
- Components should use:
  - `var(--alias-...)` for semantic colors/surfaces/spacing/radius
  - `var(--typography-...)` for font sizes/line heights/paragraph spacing
- Components must not use `--base-*` directly (Base is for token definitions, not consumption).

---

## DESIGN SYSTEM USAGE GUIDELINES

**This is the authoritative reference for all agents building UI.** All rules describe semantic intent and UX meaning, not visual preference. If a value cannot be justified by these rules, it should not be used.

### 1. BASE COLLECTION (RAW VALUES)

The Base Collection contains uncontextualized, raw values. These tokens define the underlying system primitives and are the single source of truth. **Base tokens must NEVER be used directly in UI components.** Their only purpose is to be referenced by Alias or Typography tokens.

#### 1.1 Color (Base)

**What it represents:**
- Raw color values organized by hue and shade (e.g., 100–900 scale)

**When to use:**
- ONLY when defining or modifying Alias tokens
- NEVER in components, layouts, or pages

**Rules:**
- Base colors do not encode meaning, state, or role
- Changing a Base color should cascade through aliases
- Base colors are descriptive, not semantic

#### 1.2 Scale (Base)

**What it represents:**
- Raw numerical dimensions based on an 8-point grid
- Used for spacing, sizing, radius, borders, and typography metrics

**When to use:**
- ONLY when defining Alias or Typography tokens
- NEVER directly in UI components

**Rules:**
- No arbitrary numbers in UI
- Scale values exist to ensure rhythm and consistency
- All spacing, radius, and sizing must trace back to Scale

#### 1.3 Type (Base)

**What it represents:**
- Raw typographic primitives such as font families and font weights

**When to use:**
- ONLY when defining Typography styles or type-related aliases

**Rules:**
- Base Type values are not styles
- They should never be applied directly to text nodes in UI
- Typography styles are the only approved consumer

### 2. ALIASES COLLECTION (SEMANTIC VALUES)

The Aliases Collection provides meaning and intent. **Aliases are the ONLY tokens allowed to be used directly in UI components.**

Aliases are defined by:
- **A Role Category** (what part of the UI)
- **A Semantic State Modifier** (what condition or meaning)

#### 2A. Role Categories

These define *what part of the UI* the token affects.

**Text**

Used for:
- All textual content
- Labels, headings, body copy, helper text

Rules:
- Text color must always come from Text aliases
- Text aliases communicate readability and hierarchy
- Never use surface or border tokens for text

**Surface**

Used for:
- Backgrounds of components and layouts
- Containers, cards, buttons, sections

Rules:
- Surfaces define spatial structure
- Surface tokens should not be used for text or borders
- Surface contrast should support text readability

**Border**

Used for:
- Outlines, dividers, input boundaries

Rules:
- Borders communicate structure and state
- Border tokens should not be decorative
- Borders should change primarily based on state (focus, error, disabled)

**Headers / Headings**

Used for:
- High-level structural text (page titles, section headers)

Rules:
- Headings should have clear semantic hierarchy
- Heading tokens should not be reused for body text
- Visual emphasis must follow hierarchy, not preference

#### 2B. Semantic State Modifiers

These define *why* a token is used. State modifiers communicate interaction, feedback, or system status. **States must never be chosen for aesthetics alone.**

**Default**

When to use:
- The resting, neutral state
- No interaction or feedback is occurring

Rules:
- Default is the baseline
- If no state applies, use Default

**Primary**

When to use:
- The main action or emphasis within a context
- The most important interactive element

Rules:
- Only one primary action per context
- Primary does not mean "bright," it means "priority"

**Hover**

When to use:
- Pointer-based interaction only
- Element is interactive and currently hovered

Rules:
- Hover must never convey essential information
- Hover is reinforcement, not meaning
- Disabled elements never have hover states

**Active**

When to use:
- Element is focused, selected, or pressed
- Keyboard focus or current selection

Rules:
- Active indicates engagement
- Active is not success or confirmation

**Disabled**

When to use:
- Element exists but cannot be interacted with

Rules:
- Disabled elements should not appear interactive
- No hover or active states when disabled
- Disabled does not imply error

**Success**

When to use:
- Action completed correctly
- Positive confirmation after user action

Rules:
- Never use preemptively
- Success is feedback, not a default state

**Information**

When to use:
- Neutral guidance or contextual help
- Non-blocking messages

Rules:
- Informational states should not demand action
- Should never block progress

**Warning**

When to use:
- Potential risk or important notice
- Action may have consequences but is still allowed

Rules:
- Warnings require attention
- Not used for validation errors
- Often paired with explanatory text

**Error**

When to use:
- Action failed
- Input is invalid
- System cannot proceed

Rules:
- Errors block progress
- Must be explicit and clear
- Never combined with success or warning

**Dark / Light**

When to use:
- To specify contrast variants within the same semantic role

Rules:
- Used only when contrast requirements differ
- Should not introduce new meaning
- Dark/Light modifies visibility, not state

### 3. TYPOGRAPHY COLLECTION

The Typography Collection defines complete, ready-to-use text styles. These styles bundle multiple variables into opinionated presets.

**Text Styles**

What they represent:
- Fully defined text packages (e.g., Heading 1, Body Medium)

Includes:
- Font family (from Base Type)
- Font weight (from Base Type)
- Font size (from Base Scale)
- Line height (from Base Scale)
- Paragraph spacing (from Base Scale)

Rules:
- Typography styles must be used as-is
- No manual overrides of font size, line height, or weight
- If a style is missing, propose a new one rather than modifying an existing style

**Implicit Typography Categories**

- `font_size`
- `line_height`
- `paragraph_spacing`

Rules:
- These exist only to support Typography styles
- They should never be applied independently
- All numeric values must trace back to Base Scale

### GLOBAL ENFORCEMENT RULE

**If a UI value cannot be traced to Base → (Alias or Typography), it is invalid.**

- Design intent lives in aliases
- Consistency lives in base
- Text lives in typography
- **Components consume, they do not decide**

### Component Implementation Conventions

When building UI components, agents must follow these rules:

**Layout:**
- Use Tailwind utilities for flex/grid/positioning/responsive breakpoints
- Use `className` prop for layout composition

**Token Application:**
- Inline `style={{ ... }}` values must use ONLY `var(--alias-*)` or `var(--typography-*)`
- Never reference `--base-*` in components or pages
- Token-driven values (colors, spacing, radius, typography) should be applied via inline style when they need to be dynamic or token-specific

**Avoid Hydration Issues:**
- Prefer class-based styling for static styles
- When inline styles use CSS variables, keep them stable and server-rendered
- Add `suppressHydrationWarning` only when unavoidable (e.g., browser normalizes CSS differently than server)

**Accessibility:**
- Use semantic HTML elements (`button`, `a`, proper heading hierarchy)
- Ensure interactive elements are keyboard-accessible
- Provide focus states using alias tokens

---

## Frontend execution rules (agent workflow)

- Always ask before proceeding  
  The agent must pause after each proposal and wait for explicit user approval before continuing.
- Propose before executing  
  For any non-trivial work, the agent must first state what it plans to do next and why.
- Surface gaps and assumptions  
  The agent must call out missing information, ambiguities, or potential holes instead of filling them silently.
- Explain actions briefly  
  The agent should include a short explanation of why it is taking an action, to support learning and alignment.
- Work in small, reviewable steps  
  Favor incremental outputs over large, final solutions.
- Do not expand scope  
  Do not add features, details, or directions beyond what is explicitly requested.


