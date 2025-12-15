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


