import Link from "next/link";
import {
  getAliasTokenGroups,
  getBasePalette,
  getTypographyTokens,
} from "./preview-data";
import { Container } from "../components/Container";
import { Stack } from "../components/Stack";
import { Row } from "../components/Row";
import { Text } from "../components/Text";
import { Button } from "../components/Button";
import { Card } from "../components/Card";

function Swatch({
  label,
  value,
  sublabel,
}: {
  label: string;
  value: string;
  sublabel?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-black/10 bg-white px-3 py-2">
      <div className="min-w-0">
        <div className="truncate text-sm font-medium text-black">{label}</div>
        {sublabel ? (
          <div className="truncate text-xs text-black/60">{sublabel}</div>
        ) : null}
      </div>
      <div
        className="h-8 w-12 shrink-0 rounded-md border border-black/10"
        style={{ background: value }}
        title={value}
        suppressHydrationWarning
      />
    </div>
  );
}

function TypographySample({
  title,
  fontSize,
  lineHeight,
  paragraphSpacing,
  family,
}: {
  title: string;
  fontSize: string;
  lineHeight: string;
  paragraphSpacing: string;
  family: "headings" | "body";
}) {
  const fontFamily =
    family === "headings"
      ? "var(--base-type-font-family-headings)"
      : "var(--base-type-font-family-body)";

  return (
    <div className="rounded-lg border border-black/10 bg-white p-4">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <div className="text-sm font-medium text-black">{title}</div>
        <div className="text-xs text-black/60">
          fs {fontSize} · lh {lineHeight} · ps {paragraphSpacing}
        </div>
      </div>
      <div
        style={{
          fontFamily,
          fontSize,
          lineHeight,
        }}
        className="text-black"
        suppressHydrationWarning
      >
        <p style={{ marginBottom: paragraphSpacing }} suppressHydrationWarning>
          The quick brown fox jumps over the lazy dog.
        </p>
        <p>This is a second paragraph to validate paragraph spacing.</p>
      </div>
    </div>
  );
}

export default async function PreviewPage() {
  const [basePalette, aliasGroups, typographyTokens] = await Promise.all([
    getBasePalette(),
    getAliasTokenGroups(),
    getTypographyTokens(),
  ]);

  // Build a simple palette view: for each family, show sorted "shades".
  const paletteFamilies = Object.keys(basePalette).sort((a, b) => a.localeCompare(b));

  // Typography tokens are stored as a flat list; we pick the commonly expected ones for a clean preview.
  const t = Object.fromEntries(typographyTokens.map((x) => [x.name, x.cssVar])) as Record<string, string>;

  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-10 text-black">
      <div className="mx-auto w-full max-w-6xl space-y-10">
        <header className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">
              Design system preview
            </h1>
            <Link href="/" className="text-sm text-black/70 underline">
              Back to home
            </Link>
          </div>
          <p className="max-w-3xl text-sm text-black/60">
            This page renders Base, Alias, and Typography tokens via CSS variables from{" "}
            <code className="rounded bg-black/5 px-1 py-0.5">
              design-system/generated/tokens.css
            </code>
            .
          </p>
        </header>

        {/* Base palette */}
        <section className="space-y-3">
          <div>
            <h2 className="text-lg font-semibold">Base palette</h2>
            <p className="text-sm text-black/60">
              Swatches are rendered from <code className="rounded bg-black/5 px-1 py-0.5">--base-*</code> variables.
            </p>
          </div>

          <div className="space-y-6">
            {paletteFamilies.map((family) => {
              const shades = Object.keys(basePalette[family]).sort((a, b) => a.localeCompare(b));
              return (
                <div key={family} className="space-y-2">
                  <div className="text-sm font-medium uppercase tracking-wide text-black/70">
                    {family}
                  </div>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {shades.map((shade) => (
                      <Swatch
                        key={`${family}-${shade}`}
                        label={`${family}/${shade}`}
                        value={basePalette[family][shade]}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Alias tokens */}
        <section className="space-y-3">
          <div>
            <h2 className="text-lg font-semibold">Alias tokens</h2>
            <p className="text-sm text-black/60">
              Swatches are rendered from <code className="rounded bg-black/5 px-1 py-0.5">--alias-*</code> variables, which reference Base.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="space-y-2">
              <div className="text-sm font-medium text-black/70">Alias colors</div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {aliasGroups.colors.map((x) => (
                  <Swatch key={x.name} label={x.name} value={x.cssVar} sublabel={`$ref → ${x.ref}`} />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium text-black/70">Alias sizes</div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {aliasGroups.sizes.map((x) => (
                  <div
                    key={x.name}
                    className="rounded-lg border border-black/10 bg-white px-3 py-2"
                  >
                    <div className="truncate text-sm font-medium text-black">{x.name}</div>
                    <div className="truncate text-xs text-black/60">{`$ref → ${x.ref}`}</div>
                    <div className="mt-2 flex items-center gap-3">
                      <div
                        className="h-10 w-10 border border-black/10"
                        style={{
                          borderRadius: x.name.startsWith("sizes/radius/") ? x.cssVar : undefined,
                          borderWidth: x.name.startsWith("sizes/border/") ? x.cssVar : undefined,
                          padding: x.name.startsWith("sizes/spacing/") ? x.cssVar : undefined,
                        }}
                        title={x.cssVar}
                        suppressHydrationWarning
                      />
                      <div className="text-xs text-black/60">{x.cssVar}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Typography */}
        <section className="space-y-3">
          <div>
            <h2 className="text-lg font-semibold">Typography</h2>
            <p className="text-sm text-black/60">
              Samples render from <code className="rounded bg-black/5 px-1 py-0.5">--typography-*</code> variables (mapped to Base scale).
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <TypographySample
              title="Heading / H1"
              family="headings"
              fontSize={t["fontsize/headings/h1"]}
              lineHeight={t["line-height/headings/h1"]}
              paragraphSpacing={t["paragraph-spacing/headings/h1"]}
            />
            <TypographySample
              title="Heading / H2"
              family="headings"
              fontSize={t["fontsize/headings/h2"]}
              lineHeight={t["line-height/headings/h2"]}
              paragraphSpacing={t["paragraph-spacing/headings/h2"]}
            />
            <TypographySample
              title="Heading / H3"
              family="headings"
              fontSize={t["fontsize/headings/h3"]}
              lineHeight={t["line-height/headings/h3"]}
              paragraphSpacing={t["paragraph-spacing/headings/h3"]}
            />
            <TypographySample
              title="Body / Large"
              family="body"
              fontSize={t["fontsize/body/large"]}
              lineHeight={t["line-height/body/large"]}
              paragraphSpacing={t["paragraph-spacing/body/large"]}
            />
            <TypographySample
              title="Body / Medium"
              family="body"
              fontSize={t["fontsize/body/medium"]}
              lineHeight={t["line-height/body/medium"]}
              paragraphSpacing={t["paragraph-spacing/body/medium"]}
            />
            <TypographySample
              title="Body / Small"
              family="body"
              fontSize={t["fontsize/body/small"]}
              lineHeight={t["line-height/body/small"]}
              paragraphSpacing={t["paragraph-spacing/body/small"]}
            />
          </div>
        </section>

        {/* UI Components */}
        <section className="space-y-3">
          <div>
            <h2 className="text-lg font-semibold">UI Components</h2>
            <p className="text-sm text-black/60">
              Reusable primitives built with Tailwind layout + alias/typography tokens.
            </p>
          </div>

          <div className="space-y-8">
            {/* Text Component */}
            <Card>
              <Stack gap="16">
                <div className="text-sm font-medium text-black/70">Text Component</div>
                <Stack gap="8">
                  <Text as="h1" variant="h1" color="heading">Heading 1</Text>
                  <Text as="h2" variant="h2" color="heading">Heading 2</Text>
                  <Text as="h3" variant="h3" color="heading">Heading 3</Text>
                  <Text as="p" variant="body-large" color="body">Body Large</Text>
                  <Text as="p" variant="body-medium" color="body">Body Medium</Text>
                  <Text as="p" variant="body-small" color="body">Body Small</Text>
                  <Text as="p" variant="body-medium" color="disabled">Disabled Text</Text>
                  <Text as="p" variant="body-medium" color="error">Error Text</Text>
                  <Text as="p" variant="body-medium" color="information">Information Text</Text>
                </Stack>
              </Stack>
            </Card>

            {/* Button Component */}
            <Card>
              <Stack gap="16">
                <div className="text-sm font-medium text-black/70">Button Component</div>
                <Row gap="16" wrap>
                  <Button variant="primary" size="small">Primary Small</Button>
                  <Button variant="primary" size="medium">Primary Medium</Button>
                  <Button variant="primary" size="large">Primary Large</Button>
                </Row>
                <Row gap="16" wrap>
                  <Button variant="default" size="small">Default Small</Button>
                  <Button variant="default" size="medium">Default Medium</Button>
                  <Button variant="default" size="large">Default Large</Button>
                </Row>
                <Row gap="16" wrap>
                  <Button disabled size="small">Disabled Small</Button>
                  <Button disabled size="medium">Disabled Medium</Button>
                  <Button disabled size="large">Disabled Large</Button>
                </Row>
              </Stack>
            </Card>

            {/* Layout Components: Container, Stack, Row */}
            <Card>
              <Stack gap="16">
                <div className="text-sm font-medium text-black/70">Layout Components</div>
                
                <div>
                  <Text as="p" variant="body-small" color="body" className="mb-2">Stack (vertical layout with gap):</Text>
                  <div
                    className="rounded-lg border border-black/10 p-4"
                    style={{ backgroundColor: "var(--alias-color-surface-background-default)" }}
                    suppressHydrationWarning
                  >
                    <Stack gap="8">
                      <div className="rounded bg-white px-3 py-2 text-sm">Item 1</div>
                      <div className="rounded bg-white px-3 py-2 text-sm">Item 2</div>
                      <div className="rounded bg-white px-3 py-2 text-sm">Item 3</div>
                    </Stack>
                  </div>
                </div>

                <div>
                  <Text as="p" variant="body-small" color="body" className="mb-2">Row (horizontal layout with gap):</Text>
                  <div
                    className="rounded-lg border border-black/10 p-4"
                    style={{ backgroundColor: "var(--alias-color-surface-background-default)" }}
                    suppressHydrationWarning
                  >
                    <Row gap="8" wrap>
                      <div className="rounded bg-white px-3 py-2 text-sm">Item 1</div>
                      <div className="rounded bg-white px-3 py-2 text-sm">Item 2</div>
                      <div className="rounded bg-white px-3 py-2 text-sm">Item 3</div>
                    </Row>
                  </div>
                </div>

                <div>
                  <Text as="p" variant="body-small" color="body" className="mb-2">Container (max-width with padding):</Text>
                  <div
                    className="rounded-lg border border-black/10 p-4"
                    style={{ backgroundColor: "var(--alias-color-surface-background-default)" }}
                    suppressHydrationWarning
                  >
                    <Container maxWidth="md" className="bg-white rounded py-2">
                      <Text as="p" variant="body-small" color="body" className="text-center">
                        Container content (max-width: md)
                      </Text>
                    </Container>
                  </div>
                </div>
              </Stack>
            </Card>

            {/* Card Component */}
            <Card>
              <Stack gap="16">
                <div className="text-sm font-medium text-black/70">Card Component</div>
                <Row gap="16" wrap>
                  <Card padding="16" className="flex-1 min-w-[200px]">
                    <Text as="p" variant="body-small" color="body">Card with padding 16</Text>
                  </Card>
                  <Card padding="24" className="flex-1 min-w-[200px]">
                    <Text as="p" variant="body-small" color="body">Card with padding 24</Text>
                  </Card>
                  <Card padding="32" className="flex-1 min-w-[200px]">
                    <Text as="p" variant="body-small" color="body">Card with padding 32</Text>
                  </Card>
                </Row>
              </Stack>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}


