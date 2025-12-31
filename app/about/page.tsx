import { Container } from "../components/Container";
import { Stack } from "../components/Stack";
import { Text } from "../components/Text";
import { NavBar } from "../components/NavBar";

export default function About() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--alias-color-surface-background-primary)",
      }}
      suppressHydrationWarning
    >
      <NavBar />

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
