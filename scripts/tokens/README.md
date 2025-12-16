# Token sync script

This folder contains the token sync script used to regenerate the runtime CSS variables for the site from the checked-in token JSON files.

## What it does

Running the sync script will:

- Read token sources:
  - `design-system/tokens/base.tokens.json`
  - `design-system/tokens/aliases.tokens.json`
  - `design-system/tokens/typography.tokens.json`
- Validate layering rules:
  - **Aliases** must be **`$ref`-only** and every `$ref` must exist in **Base**
  - **Typography** must be **`$ref`-only** and every `$ref` must exist in **Base**
- Generate runtime output:
  - `design-system/generated/tokens.css`

## How to run

From the repo root:

```bash
npm run tokens:sync
```

## Expected output

On success you should see something like:

```text
Wrote design-system/generated/tokens.css
```

## Common failures

- **Missing token files**: One of the JSON token source files is missing.
- **Non-`$ref` entries**: Aliases or Typography contain raw values instead of `{ "$ref": "..." }`.
- **Broken `$ref`**: A `$ref` points to a Base token path that doesn’t exist.


