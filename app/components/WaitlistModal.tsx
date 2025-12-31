"use client";

import { useEffect, useState, FormEvent } from "react";
import { createPortal } from "react-dom";
import { Button } from "./Button";
import { Text } from "./Text";
import { Stack } from "./Stack";
import styles from "./WaitlistModal.module.css";

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Handle mounting for portal
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Handle escape key and body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    // Lock body scroll
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "unset";
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    // Submit to API
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          message: message.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to join waitlist');
      }

      // Show success
      setSubmitSuccess(true);
      
      // Clear form and close after delay
      setTimeout(() => {
        setEmail("");
        setMessage("");
        setError("");
        setSubmitSuccess(false);
        onClose();
      }, 2000);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to join waitlist');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <Stack gap="24">
          <div>
            <Text as="h2" variant="h2" color="heading" id="modal-title">
              Join our waitlist
            </Text>
            <Text as="p" variant="body-medium" color="body" style={{ marginTop: "8px" }}>
              Be the first to know when we launch.
            </Text>
          </div>

          <form onSubmit={handleSubmit}>
            <Stack gap="16">
              <div>
                <label htmlFor="email" className={styles.label}>
                  <Text as="span" variant="body-medium" color="heading" weight={500}>
                    Email address *
                  </Text>
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.input}
                  placeholder="you@example.com"
                  aria-required="true"
                  aria-invalid={!!error}
                  aria-describedby={error ? "email-error" : undefined}
                />
                {error && (
                  <Text
                    as="p"
                    variant="body-small"
                    style={{ color: "var(--base-color-red-500)", marginTop: "4px" }}
                    id="email-error"
                    role="alert"
                  >
                    {error}
                  </Text>
                )}
              </div>

              <div>
                <label htmlFor="message" className={styles.label}>
                  <Text as="span" variant="body-medium" color="heading" weight={500}>
                    Message (optional)
                  </Text>
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className={styles.textarea}
                  placeholder="Tell us what you're excited about..."
                  rows={4}
                  disabled={isSubmitting}
                />
              </div>

              {/* Success Message */}
              {submitSuccess && (
                <Text
                  as="p"
                  variant="body-medium"
                  style={{ color: "var(--base-color-forest-600)", textAlign: "center" }}
                  role="alert"
                >
                  ✓ Successfully joined the waitlist!
                </Text>
              )}

              <div className={styles.buttonGroup}>
                <Button
                  type="button"
                  variant="default"
                  size="medium"
                  onClick={onClose}
                  disabled={isSubmitting}
                  style={{
                    fontFamily: "var(--base-type-font-family-headings)",
                    fontSize: 14,
                    fontWeight: 400,
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="medium"
                  disabled={isSubmitting || submitSuccess}
                  style={{
                    fontFamily: "var(--base-type-font-family-headings)",
                    fontSize: 14,
                    fontWeight: 400,
                  }}
                >
                  {isSubmitting ? "Joining..." : submitSuccess ? "Joined!" : "Join waitlist"}
                </Button>
              </div>
            </Stack>
          </form>
        </Stack>
      </div>
    </div>,
    document.body
  );
}

