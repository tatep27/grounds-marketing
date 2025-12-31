"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Row } from "./Row";
import { Text } from "./Text";
import { Button } from "./Button";

interface NavBarProps {
  onOpenWaitlist?: () => void;
}

export function NavBar({ onOpenWaitlist }: NavBarProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backgroundColor: "var(--alias-color-surface-background-primary)",
        borderBottom: "1px solid var(--alias-color-borders-primary-default)",
        boxShadow: isScrolled ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
        paddingTop: 12,
        paddingBottom: 12,
        paddingLeft: "var(--alias-sizes-spacing-sp-32)",
        paddingRight: "var(--alias-sizes-spacing-sp-32)",
        transition: "box-shadow 0.2s ease-in-out",
      }}
      suppressHydrationWarning
    >
      <Row justify="between" align="center">
        {/* Brand */}
        <Link href="/" style={{ textDecoration: "none" }}>
          <Row gap="16" align="center">
            <Image 
              src="/images/logo.png" 
              alt="Grounds logo" 
              width={32} 
              height={32}
              style={{ marginTop: "-2px" }}
            />
            <span
              style={{
                fontFamily: "var(--base-type-font-family-headings)",
                fontSize: "var(--typography-fontsize-body-large)",
                lineHeight: "var(--typography-line-height-body-large)",
                color: "var(--alias-color-text-brand-default)",
                fontWeight: 600,
              }}
            >
              Grounds
            </span>
          </Row>
        </Link>

        {/* Nav links + CTA */}
        <Row gap="24" align="center">
          <Link href="/about" style={{ textDecoration: "none" }}>
            <span
              style={{
                fontFamily: "var(--base-type-font-family-headings)",
                fontSize: 14,
                lineHeight: "var(--typography-line-height-body-medium)",
                color: "var(--alias-color-text-heading-default)",
                fontWeight: 400,
              }}
            >
              About
            </span>
          </Link>
          <Button 
            variant="primary" 
            size="small"
            onClick={onOpenWaitlist}
            style={{ 
              fontFamily: "var(--base-type-font-family-headings)",
              fontSize: 14,
              lineHeight: "var(--typography-line-height-body-medium)",
              fontWeight: 400,
              paddingTop: 10,
              paddingBottom: 10,
              paddingLeft: "var(--alias-sizes-spacing-sp-24)",
              paddingRight: "var(--alias-sizes-spacing-sp-24)",
            }}
          >
            Join our waitlist
          </Button>
        </Row>
      </Row>
    </nav>
  );
}

