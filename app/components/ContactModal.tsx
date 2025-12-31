"use client";

import { useEffect, useState, FormEvent } from "react";
import { createPortal } from "react-dom";
import { Button } from "./Button";
import { Text } from "./Text";
import { Stack } from "./Stack";
import styles from "./ContactModal.module.css";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [joinWaitlist, setJoinWaitlist] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});
  const [mounted, setMounted] = useState(false);

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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const newErrors: { name?: string; email?: string; message?: string } = {};

    // Validate all required fields
    if (!name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!message.trim()) {
      newErrors.message = "Message is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Log to console
    console.log({
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
      joinWaitlist,
      timestamp: new Date().toISOString(),
      recipientEmail: "tatepark@gse.harvard.edu",
    });

    // Clear form and close
    setName("");
    setEmail("");
    setMessage("");
    setJoinWaitlist(false);
    setErrors({});
    onClose();
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
              Get in contact
            </Text>
            <Text as="p" variant="body-medium" color="body" style={{ marginTop: "8px" }}>
              Tell us about your space and how we can help.
            </Text>
          </div>

          <form onSubmit={handleSubmit}>
            <Stack gap="16">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className={styles.label}>
                  <Text as="span" variant="body-medium" color="heading" weight={500}>
                    Name *
                  </Text>
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={styles.input}
                  placeholder="Your name"
                  aria-required="true"
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "name-error" : undefined}
                />
                {errors.name && (
                  <Text
                    as="p"
                    variant="body-small"
                    style={{ color: "var(--base-color-red-500)", marginTop: "4px" }}
                    id="name-error"
                    role="alert"
                  >
                    {errors.name}
                  </Text>
                )}
              </div>

              {/* Email Field */}
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
                  placeholder="your@email.com"
                  aria-required="true"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
                {errors.email && (
                  <Text
                    as="p"
                    variant="body-small"
                    style={{ color: "var(--base-color-red-500)", marginTop: "4px" }}
                    id="email-error"
                    role="alert"
                  >
                    {errors.email}
                  </Text>
                )}
              </div>

              {/* Message Field */}
              <div>
                <label htmlFor="contact-message" className={styles.label}>
                  <Text as="span" variant="body-medium" color="heading" weight={500}>
                    Message *
                  </Text>
                </label>
                <textarea
                  id="contact-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className={styles.textarea}
                  placeholder="Tell us about your space and how we can help"
                  rows={6}
                  aria-required="true"
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? "message-error" : undefined}
                />
                {errors.message && (
                  <Text
                    as="p"
                    variant="body-small"
                    style={{ color: "var(--base-color-red-500)", marginTop: "4px" }}
                    id="message-error"
                    role="alert"
                  >
                    {errors.message}
                  </Text>
                )}
              </div>

              {/* Waitlist Checkbox */}
              <div className={styles.checkboxContainer}>
                <input
                  id="join-waitlist"
                  type="checkbox"
                  checked={joinWaitlist}
                  onChange={(e) => setJoinWaitlist(e.target.checked)}
                  className={styles.checkbox}
                />
                <label htmlFor="join-waitlist" className={styles.checkboxLabel}>
                  <Text as="span" variant="body-medium" color="body">
                    I'd also like to join the waitlist
                  </Text>
                </label>
              </div>

              <div className={styles.buttonGroup}>
                <Button
                  type="button"
                  variant="default"
                  size="medium"
                  onClick={onClose}
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
                  style={{
                    fontFamily: "var(--base-type-font-family-headings)",
                    fontSize: 14,
                    fontWeight: 400,
                  }}
                >
                  Send message
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

