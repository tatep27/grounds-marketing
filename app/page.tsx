import Link from "next/link";
import { Container } from "./components/Container";
import { Stack } from "./components/Stack";
import { Row } from "./components/Row";
import { Text } from "./components/Text";
import { Button } from "./components/Button";
import { Card } from "./components/Card";

export default function Home() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--alias-color-surface-background-primary)",
      }}
      suppressHydrationWarning
    >
      {/* Nav */}
      <nav
        style={{
          backgroundColor: "var(--alias-color-surface-background-default)",
        }}
        suppressHydrationWarning
      >
        <Container>
          <Row justify="between" align="center" className="py-6">
            <Text as="span" variant="body-large" weight={600} color="heading">
              Grounds
            </Text>
            <Row gap="32">
              <Link href="/" style={{ textDecoration: "none" }}>
                <Text as="span" variant="body-medium" color="body">
                  Home
                </Text>
              </Link>
              <Link href="/about" style={{ textDecoration: "none" }}>
                <Text as="span" variant="body-medium" color="body">
                  About
                </Text>
              </Link>
            </Row>
          </Row>
        </Container>
      </nav>

      {/* Hero */}
      <Container as="section" className="py-20">
        <Stack gap="32">
          <Text as="h1" variant="h1" color="heading" weight={400}>
            What Makes A <em style={{ fontStyle: "normal" }}>Library</em> Feel
            Like Home?
          </Text>
          <Text
            as="p"
            variant="body-large"
            color="body"
            className="max-w-2xl"
          >
            Build belonging with the digital counterpart to your physical
            community
          </Text>
          <Button variant="primary">Join our waitlist</Button>
        </Stack>
      </Container>

      {/* Section 1 */}
      <Container as="section" className="py-10">
        <Stack gap="32">
          <Text
            as="p"
            variant="body-large"
            color="body"
            className="text-center"
          >
            An all-in-one member outreach tool that gives you back your time…
          </Text>
          <Row gap="24">
            <Card
              className="flex-[2]"
              padding="none"
              style={{ aspectRatio: "16/9" }}
            />
            <Card
              className="flex-1"
              padding="none"
              style={{ aspectRatio: "4/5" }}
            />
          </Row>
        </Stack>
      </Container>

      {/* Section 2 */}
      <Container as="section" className="py-10">
        <Stack gap="32">
          <Text
            as="p"
            variant="body-large"
            color="body"
            className="text-center"
          >
            …Paired with digital community features that help members
            participate, connect, and belong.
          </Text>
          <Card padding="none" style={{ aspectRatio: "16/9" }} />
        </Stack>
      </Container>
    </div>
  );
}
