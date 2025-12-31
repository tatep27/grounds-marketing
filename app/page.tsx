"use client";

import { useState } from "react";
import Image from "next/image";
import { Container } from "./components/Container";
import { Stack } from "./components/Stack";
import { Row } from "./components/Row";
import { Text } from "./components/Text";
import { Card } from "./components/Card";
import { RotatingWord } from "./components/RotatingWord";
import { NavBar } from "./components/NavBar";
import { Button } from "./components/Button";
import { WaitlistModal } from "./components/WaitlistModal";
import { ContactModal } from "./components/ContactModal";
import { heroWords } from "./lib/wordBank";

export default function Home() {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--alias-color-surface-background-primary)",
      }}
      suppressHydrationWarning
    >
      <NavBar onOpenWaitlist={() => setIsWaitlistOpen(true)} />

      {/* Hero section */}
      <Container 
        as="section" 
        className="py-20" 
        style={{ 
          marginLeft: "0",
          marginRight: "auto",
          paddingLeft: "clamp(20px, 5vw, 80px)",
          paddingTop: "150px",
        }}
      >
        <div style={{ maxWidth: "700px" }}>
          <Stack gap="32" align="start">
            <Text as="h1" variant="title" color="heading" weight={400}>
              What Makes A <RotatingWord words={heroWords} intervalMs={2250} />
              <br />
              Feel Like Home?
            </Text>
            <Text
              as="p"
              variant="body-large"
              color="body"
              className="max-w-2xl"
              style={{ 
                fontFamily: "var(--base-type-font-family-headings)",
                fontSize: "clamp(1.25rem, 2.5vw, 1.5rem)",
              }}
            >
              Build belonging with the digital counterpart to your third space.
            </Text>
            <Button 
              variant="primary" 
              size="medium"
              onClick={() => setIsWaitlistOpen(true)}
              style={{
                fontFamily: "var(--base-type-font-family-headings)",
                fontSize: 14,
                fontWeight: 400,
              }}
            >
              Join our waitlist
            </Button>
          </Stack>
        </div>
      </Container>

      {/* Custom divider with logo */}
      <div style={{ width: "100%", height: "100px", position: "relative", overflow: "hidden" }}>
        <Image
          src="/images/logo_horizontal.png"
          alt="Section divider"
          fill
          style={{ objectFit: "cover", objectPosition: "right center" }}
          priority={false}
        />
      </div>

      {/* Contact section */}
      <Container as="section" className="py-20">
        <Stack gap="32" align="center">
          <Text as="h3" variant="h3" color="heading" className="text-center">
            Grounds is an all-in-one outreach solution that goes beyond mailing lists.
          </Text>
          <Text as="p" variant="body-large" color="body" className="text-center" style={{ maxWidth: "800px", fontFamily: "var(--base-type-font-family-headings)" }}>
            Give your members meaningful avenues for engagement through a community platform designed to help third spaces grow. Join our waitlist to add your community to our pilot run.
          </Text>
          <Button
            variant="primary"
            size="medium"
            onClick={() => setIsContactOpen(true)}
            style={{
              fontFamily: "var(--base-type-font-family-headings)",
              fontSize: 14,
              fontWeight: 400,
            }}
          >
            Get in contact
          </Button>
        </Stack>
      </Container>

      <WaitlistModal 
        isOpen={isWaitlistOpen} 
        onClose={() => setIsWaitlistOpen(false)} 
      />
      <ContactModal 
        isOpen={isContactOpen} 
        onClose={() => setIsContactOpen(false)} 
      />
    </div>
  );
}
