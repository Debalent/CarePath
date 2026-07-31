"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import Image from "next/image";

type ContactFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  reason: string;
  message: string;
};

const initialFormData: ContactFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  reason: "",
  message: "",
};

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactFormData>(initialFormData);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function handleChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  }

async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSubmitting(true);
    setSubmitted(false);

    const API_BASE = process.env.NEXT_PUBLIC_CAREPATH_API_URL ?? "http://localhost:3001/api";

    try {
      const response = await fetch(`${API_BASE}/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.message ?? "Unable to send message");
      }

      setSubmitted(true);
      setFormData(initialFormData);
    } catch (error) {
      console.error("Contact form error:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #d1dff0 0%, #f4ecf8 50%, #f7d6e6 100%)",
        padding: "36px 20px 60px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 950,
          margin: "0 auto",
        }}
      >
        <Link
          href="/"
          style={{
            display: "inline-block",
            marginBottom: 20,
            color: "#18185c",
            fontSize: 14,
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          ← Back to Home
        </Link>
<section
  style={{
    background: "#ffffff",
    borderRadius: 18,
    padding: "clamp(24px, 5vw, 46px)",
    boxShadow: "0 18px 50px rgba(48, 35, 86, 0.12)",
    border: "1px solid rgba(95, 35, 108, 0.1)",
  }}
>
 <div
  style={{
    textAlign: "center",
    marginBottom: 34,
  }}
>
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      marginBottom: 18,
    }}
  >
    <Image
      src="/carepath-logo.png"
      alt="CarePath Logo"
      width={70}
      height={70}
      style={{
        objectFit: "contain",
      }}
    />
  </div>

  <p
    style={{
      margin: "0 0 8px",
      color: "#ae5a8b",
      fontSize: 16,
      fontWeight: 800,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
    }}
  >
    CarePath Support
  </p>

  <h1
    style={{
      margin: "0 0 12px",
      color: "#18185c",
      fontSize: "clamp(30px, 6vw, 44px)",
      fontWeight: 800,
      lineHeight: 1.15,
    }}
  >
    Contact Us
  </h1>

  <p
    style={{
      maxWidth: 580,
      margin: "0 auto",
      color: "#615f72",
      fontSize: 16,
      lineHeight: 1.7,
    }}
  >
    We&apos;d love to hear from you! Our team will respond as soon as
    possible.
  </p>
</div>

          {submitted && (
            <div
              role="status"
              style={{
                marginBottom: 26,
                padding: "16px 18px",
                borderRadius: 10,
                background: "#eaf8f2",
                border: "1px solid #9cd9bd",
                color: "#185c41",
                fontSize: 15,
                lineHeight: 1.6,
              }}
            >
              <strong>Thank you!</strong> Your message has been submitted.
              Someone from the CarePath team will contact you soon.
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
                gap: 20,
                marginBottom: 20,
              }}
            >
              <label style={labelStyle}>
                First Name
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  autoComplete="given-name"
                  style={inputStyle}
                  placeholder="Enter your first name"
                />
              </label>

              <label style={labelStyle}>
                Last Name
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  autoComplete="family-name"
                  style={inputStyle}
                  placeholder="Enter your last name"
                />
              </label>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
                gap: 20,
                marginBottom: 20,
              }}
            >
              <label style={labelStyle}>
                Email Address
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  style={inputStyle}
                  placeholder="name@example.com"
                />
              </label>

              <label style={labelStyle}>
                Phone Number
                <span
                  style={{
                    color: "#888493",
                    fontWeight: 500,
                  }}
                >
                  {" "}
                  (optional)
                </span>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  autoComplete="tel"
                  style={inputStyle}
                  placeholder="(555) 555-5555"
                />
              </label>
            </div>

            <label
              style={{
                ...labelStyle,
                marginBottom: 20,
              }}
            >
              Reason for Contacting Us
              <select
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                required
                style={inputStyle}
              >
                <option value="">Select a reason</option>
                <option value="general-question">General Question</option>
                <option value="patient-services">Patient Services</option>
                <option value="transportation-partnership">
                  Transportation Partnership
                </option>
                <option value="volunteer-interest">Volunteer Interest</option>
                <option value="employment-opportunity">
                  Employment Opportunity
                </option>
                <option value="feedback">Feedback</option>
                <option value="other">Other</option>
              </select>
            </label>

            {formData.reason === "employment-opportunity" && (
              <div
                style={{
                  marginBottom: 20,
                  padding: "14px 16px",
                  borderRadius: 10,
                  background: "#f7f1f7",
                  border: "1px solid #ddc6db",
                  color: "#5f236c",
                  fontSize: 14,
                  lineHeight: 1.6,
                }}
              >
                Tell us which type of position interests you and include a short
                description of your experience in the message below.
              </div>
            )}

            <label style={labelStyle}>
              Message
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={7}
                maxLength={2000}
                style={{
                  ...inputStyle,
                  resize: "vertical",
                  minHeight: 150,
                  lineHeight: 1.6,
                }}
                placeholder="How can we help?"
              />
            </label>

            <p
              style={{
                margin: "8px 0 24px",
                color: "#888493",
                fontSize: 12,
                textAlign: "right",
              }}
            >
              {formData.message.length} / 2000 characters
            </p>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: "100%",
                minHeight: 52,
                border: "none",
                borderRadius: 11,
                background: isSubmitting ? "#b8a3b3" : "#ae5a8b",
                color: "#ffffff",
                fontSize: 16,
                fontWeight: 800,
                cursor: isSubmitting ? "not-allowed" : "pointer",
                boxShadow: isSubmitting
                  ? "none"
                  : "0 6px 16px rgba(174, 90, 139, 0.28)",
              }}
            >
              {isSubmitting ? "Sending Message..." : "Send Message"}
            </button>
          </form>

          <p
            style={{
              margin: "24px 0 0",
              textAlign: "center",
              color: "#777383",
              fontSize: 13,
              lineHeight: 1.6,
            }}
          >
            Please do not include private medical information in this form.
          </p>
        </section>
      </div>
    </main>
  );
}

const labelStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 8,
  color: "#322e43",
  fontSize: 14,
  fontWeight: 700,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  minHeight: 48,
  padding: "12px 14px",
  border: "1px solid #d9d4df",
  borderRadius: 9,
  background: "#ffffff",
  color: "#282536",
  fontSize: 15,
  fontFamily: "inherit",
  boxSizing: "border-box",
  outlineColor: "#ae5a8b",
};
