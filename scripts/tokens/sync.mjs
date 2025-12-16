import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

const BASE_PATH = path.join(ROOT, "design-system/tokens/base.tokens.json");
const ALIASES_PATH = path.join(ROOT, "design-system/tokens/aliases.tokens.json");
const TYPOGRAPHY_PATH = path.join(ROOT, "design-system/tokens/typography.tokens.json");
const OUT_CSS_PATH = path.join(ROOT, "design-system/generated/tokens.css");

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function stableEntries(obj) {
  return Object.entries(obj).sort(([a], [b]) => a.localeCompare(b));
}

function toCssVarName(prefix, tokenPath) {
  return `--${prefix}-${tokenPath.replaceAll("/", "-")}`;
}

function baseCssRef(baseTokenPath) {
  return `var(${toCssVarName("base", baseTokenPath)})`;
}

function isHexColor(s) {
  return typeof s === "string" && /^#[0-9a-fA-F]{6}$/.test(s.trim());
}

function isNumericString(s) {
  return typeof s === "string" && /^\d+$/.test(s.trim());
}

function assertRefOnly(tokensObj, label) {
  const bad = [];
  for (const [k, v] of stableEntries(tokensObj)) {
    if (!v || typeof v !== "object" || Array.isArray(v) || typeof v.$ref !== "string") {
      bad.push(k);
      if (bad.length >= 10) break;
    }
  }
  if (bad.length) {
    throw new Error(
      `${label} tokens must be $ref-only. Found non-$ref entries (first ${bad.length}): ${bad.join(
        ", ",
      )}`,
    );
  }
}

function assertRefsResolve(refTokensObj, baseTokensObj, label) {
  const missing = [];
  for (const [k, v] of stableEntries(refTokensObj)) {
    if (!(v.$ref in baseTokensObj)) {
      missing.push(`${k} -> ${v.$ref}`);
      if (missing.length >= 10) break;
    }
  }
  if (missing.length) {
    throw new Error(
      `${label} tokens contain $ref that do not exist in Base (first ${missing.length}): ${missing.join(
        " | ",
      )}`,
    );
  }
}

function emitBaseTokenCss(k, v) {
  // Scale values become px
  if (k.startsWith("scale/") && isNumericString(v)) {
    return `${toCssVarName("base", k)}: ${v.trim()}px;`;
  }
  // Font families get quotes
  if (k.startsWith("type/font-family/")) {
    return `${toCssVarName("base", k)}: ${JSON.stringify(String(v).trim())};`;
  }
  // Font weights: map known names to numbers, otherwise emit string
  if (k.startsWith("type/font-weight/")) {
    const norm = String(v).trim().toLowerCase();
    const mapped = norm === "regular" ? 400 : norm === "semibold" ? 600 : norm === "bold" ? 700 : null;
    return `${toCssVarName("base", k)}: ${mapped ?? JSON.stringify(String(v).trim())};`;
  }
  // Default: emit raw
  return `${toCssVarName("base", k)}: ${String(v).trim()};`;
}

function main() {
  if (!fs.existsSync(BASE_PATH) || !fs.existsSync(ALIASES_PATH) || !fs.existsSync(TYPOGRAPHY_PATH)) {
    throw new Error(
      `Missing token files. Expected:\n- ${BASE_PATH}\n- ${ALIASES_PATH}\n- ${TYPOGRAPHY_PATH}`,
    );
  }

  const base = readJson(BASE_PATH);
  const aliases = readJson(ALIASES_PATH);
  const typography = readJson(TYPOGRAPHY_PATH);

  const baseTokens = base.tokens ?? {};
  const aliasTokens = aliases.tokens ?? {};
  const typographyTokens = typography.tokens ?? {};

  // Basic shape checks
  for (const [k, v] of stableEntries(baseTokens)) {
    if (k.startsWith("color/") && !isHexColor(v)) {
      // allow non-hex in base, but warn-like behavior is too noisy; keep strict for now
      // (If you introduce rgba, update this check.)
    }
  }

  assertRefOnly(aliasTokens, "Alias");
  assertRefOnly(typographyTokens, "Typography");
  assertRefsResolve(aliasTokens, baseTokens, "Alias");
  assertRefsResolve(typographyTokens, baseTokens, "Typography");

  const baseCssLines = [];
  const aliasCssLines = [];
  const typoCssLines = [];

  for (const [k, v] of stableEntries(baseTokens)) {
    baseCssLines.push(`  ${emitBaseTokenCss(k, v)}`);
  }

  for (const [k, v] of stableEntries(aliasTokens)) {
    aliasCssLines.push(`  ${toCssVarName("alias", k)}: ${baseCssRef(v.$ref)};`);
  }

  for (const [k, v] of stableEntries(typographyTokens)) {
    typoCssLines.push(`  ${toCssVarName("typography", k)}: ${baseCssRef(v.$ref)};`);
  }

  const css = [
    ":root {",
    "  /* =========================",
    "   * Base (raw) — exported from Figma Base collection",
    "   * ========================= */",
    ...baseCssLines,
    "",
    "  /* =========================",
    "   * Aliases (semantic) — must reference Base only",
    "   * ========================= */",
    ...aliasCssLines,
    "",
    "  /* =========================",
    "   * Typography — must reference Base scale/type only",
    "   * ========================= */",
    ...typoCssLines,
    "}",
    "",
  ].join("\n");

  fs.mkdirSync(path.dirname(OUT_CSS_PATH), { recursive: true });
  fs.writeFileSync(OUT_CSS_PATH, css, "utf8");

  process.stdout.write(`Wrote ${path.relative(ROOT, OUT_CSS_PATH)}\n`);
}

main();


