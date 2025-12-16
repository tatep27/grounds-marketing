import fs from "node:fs/promises";
import path from "node:path";

type TokenFile<TTokens> = {
  meta?: Record<string, unknown>;
  tokens: TTokens;
};

type RefToken = { $ref: string };

function repoPath(...parts: string[]) {
  return path.join(process.cwd(), ...parts);
}

async function readJson<T>(absolutePath: string): Promise<T> {
  const raw = await fs.readFile(absolutePath, "utf8");
  return JSON.parse(raw) as T;
}

export type BasePalette = Record<string, Record<string, string>>;

export async function getBasePalette(): Promise<BasePalette> {
  const base = await readJson<TokenFile<Record<string, string>>>(
    repoPath("design-system", "tokens", "base.tokens.json"),
  );

  // Group keys like `color/<family>/<shade>` (where shade is often 100-900).
  const palette: BasePalette = {};

  for (const [tokenPath] of Object.entries(base.tokens)) {
    const parts = tokenPath.split("/");
    if (parts[0] !== "color") continue;
    if (parts.length < 3) continue;

    const family = parts[1];
    const shade = parts.slice(2).join("/"); // supports `neutral/white`, `text/body/white`, etc.
    const cssVar = `var(--base-${tokenPath.replaceAll("/", "-")})`;

    palette[family] ??= {};
    palette[family][shade] = cssVar;
  }

  return palette;
}

export type AliasTokenGroups = {
  colors: Array<{ name: string; cssVar: string; ref: string }>;
  sizes: Array<{ name: string; cssVar: string; ref: string }>;
};

export async function getAliasTokenGroups(): Promise<AliasTokenGroups> {
  const aliases = await readJson<TokenFile<Record<string, RefToken>>>(
    repoPath("design-system", "tokens", "aliases.tokens.json"),
  );

  const colors: AliasTokenGroups["colors"] = [];
  const sizes: AliasTokenGroups["sizes"] = [];

  for (const [tokenPath, token] of Object.entries(aliases.tokens)) {
    const cssVar = `var(--alias-${tokenPath.replaceAll("/", "-")})`;
    const item = { name: tokenPath, cssVar, ref: token.$ref };

    if (tokenPath.startsWith("color/")) colors.push(item);
    else if (tokenPath.startsWith("sizes/")) sizes.push(item);
  }

  colors.sort((a, b) => a.name.localeCompare(b.name));
  sizes.sort((a, b) => a.name.localeCompare(b.name));

  return { colors, sizes };
}

export type TypographyTokens = Array<{ name: string; cssVar: string; ref: string }>;

export async function getTypographyTokens(): Promise<TypographyTokens> {
  const typography = await readJson<TokenFile<Record<string, RefToken>>>(
    repoPath("design-system", "tokens", "typography.tokens.json"),
  );

  const items: TypographyTokens = Object.entries(typography.tokens).map(([tokenPath, token]) => ({
    name: tokenPath,
    cssVar: `var(--typography-${tokenPath.replaceAll("/", "-")})`,
    ref: token.$ref,
  }));

  items.sort((a, b) => a.name.localeCompare(b.name));
  return items;
}


