import Link from "next/link";
import { Container } from "../components/Container";
import { Stack } from "../components/Stack";
import { Row } from "../components/Row";
import { Text } from "../components/Text";

export default function About() {
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

      {/* Content */}
      <Container as="section" className="py-20">
        <Stack gap="24">
          <Text as="h1" variant="h1" color="heading" weight={400}>
            About
          </Text>
          <Text as="p" variant="body-large" color="body">
            About page coming soon.
          </Text>
        </Stack>
      </Container>
    </div>
  );
}
