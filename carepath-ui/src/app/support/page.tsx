"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ChangeEvent,
  FormEvent,
  useState,
} from "react";

type TechnicalReportForm = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  userType: string;
  pageName: string;
  issueType: string;
  problemDescription: string;
  expectedResult: string;
  actualResult: string;
  deviceType: string;
  browser: string;
  mayContact: boolean;
};

const initialFormData: TechnicalReportForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  userType: "",
  pageName: "",
  issueType: "",
  problemDescription: "",
  expectedResult: "",
  actualResult: "",
  deviceType: "",
  browser: "",
  mayContact: true,
};

export default function ReportProblemPage() {
  const [formData, setFormData] =
    useState<TechnicalReportForm>(initialFormData);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function handleChange(
    event: ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    const { name, value, type } = event.target;

    const nextValue =
      type === "checkbox"
        ? (event.target as HTMLInputElement).checked
        : value;

    setFormData((currentData) => ({
      ...currentData,
      [name]: nextValue,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSubmitting(true);
    setSubmitted(false);
    setError("");

    try {
      /*
        We will replace this temporary delay with the real API request later:

        const response = await fetch(
          "http://localhost:3001/api/technical-reports",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );

        if (!response.ok) {
          throw new Error("Unable to submit technical report.");
        }
      */

      await new Promise((resolve) => setTimeout(resolve, 800));

      setSubmitted(true);
      setFormData(initialFormData);
    } catch (submissionError) {
      console.error(
        "Technical report submission error:",
        submissionError
      );

      setError(
        "We could not submit your report. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #c5c4f6 0%, #e1f0f7 50%, #e1bff6 100%)",
        padding: "36px 20px 60px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 900,
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
            boxShadow:
              "0 18px 50px rgba(48, 35, 86, 0.12)",
            border:
              "1px solid rgba(95, 35, 108, 0.1)",
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
                color: "#d89161",
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
              Report a Technical Problem
            </h1>

            <p
              style={{
                maxWidth: 620,
                margin: "0 auto",
                color: "#615f72",
                fontSize: 16,
                lineHeight: 1.7,
              }}
            >
              Something not working correctly with this site? Tell us what
              happened so the CarePath team can investigate
              and fix the problem.
            </p>
          </div>

          <div
            style={{
              marginBottom: 28,
              padding: "15px 17px",
              borderRadius: 10,
              background: "#f3e1fc",
              border: "1px solid #ddc6db",
              color: "#5f236c",
              fontSize: 14,
              lineHeight: 1.6,
            }}
          >
            For emergencies or immediate transportation
            concerns, please contact your coordinator directly.
            Do not include passwords, financial information, or
            private medical details in this report.
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
              <strong>Report submitted!</strong> Thank you for
              letting us know. The CarePath team will review the
              problem.
            </div>
          )}

          {error && (
            <div
              role="alert"
              style={{
                marginBottom: 26,
                padding: "16px 18px",
                borderRadius: 10,
                background: "#fff1f1",
                border: "1px solid #efb1b1",
                color: "#9b2727",
                fontSize: 15,
                lineHeight: 1.6,
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={twoColumnGridStyle}>
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

            <div style={twoColumnGridStyle}>
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
                <span style={optionalTextStyle}>
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

            <div style={twoColumnGridStyle}>
              <label style={labelStyle}>
                I Am a...
                <select
                  name="userType"
                  value={formData.userType}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                >
                  <option value="">
                    Select your user type
                  </option>
                  <option value="patient">Patient</option>
                  <option value="caregiver">
                    Caregiver
                  </option>
                  <option value="driver">Driver</option>
                  <option value="volunteer">
                    Volunteer
                  </option>
                  <option value="coordinator">
                    Coordinator
                  </option>
                  <option value="partner">
                    Community or Healthcare Partner
                  </option>
                  <option value="visitor">
                    Website Visitor
                  </option>
                  <option value="other">Other</option>
                </select>
              </label>

              <label style={labelStyle}>
                Type of Problem
                <select
                  name="issueType"
                  value={formData.issueType}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                >
                  <option value="">
                    Select the problem type
                  </option>
                  <option value="login">
                    Login or Registration
                  </option>
                  <option value="page-not-loading">
                    Page Will Not Load
                  </option>
                  <option value="broken-link">
                    Link or Button Not Working
                  </option>
                  <option value="form-error">
                    Form or Submission Error
                  </option>
                  <option value="display-problem">
                    Page Display or Layout Problem
                  </option>
                  <option value="incorrect-information">
                    Incorrect Information
                  </option>
                  <option value="messages">
                    Messages or Notifications
                  </option>
                  <option value="other">
                    Other Technical Problem
                  </option>
                </select>
              </label>
            </div>

            <label
              style={{
                ...labelStyle,
                marginBottom: 20,
              }}
            >
              Page Where the Problem Happened
              <input
                type="text"
                name="pageName"
                value={formData.pageName}
                onChange={handleChange}
                required
                style={inputStyle}
                placeholder="Example: Login page, Patient Dashboard, Request a Ride"
              />
            </label>

            <label
              style={{
                ...labelStyle,
                marginBottom: 20,
              }}
            >
              Describe the Problem
              <textarea
                name="problemDescription"
                value={formData.problemDescription}
                onChange={handleChange}
                required
                rows={6}
                maxLength={2000}
                style={textareaStyle}
                placeholder="Tell us what happened and include any error message you saw."
              />
            </label>

            <p style={characterCountStyle}>
              {formData.problemDescription.length} / 2000
              characters
            </p>

            <label
              style={{
                ...labelStyle,
                marginBottom: 20,
              }}
            >
              What Did You Expect to Happen?
              <textarea
                name="expectedResult"
                value={formData.expectedResult}
                onChange={handleChange}
                rows={4}
                maxLength={1000}
                style={textareaStyle}
                placeholder="Describe what you expected the page, button, or form to do."
              />
            </label>

            <label
              style={{
                ...labelStyle,
                marginBottom: 20,
              }}
            >
              What Actually Happened?
              <textarea
                name="actualResult"
                value={formData.actualResult}
                onChange={handleChange}
                rows={4}
                maxLength={1000}
                style={textareaStyle}
                placeholder="Describe what happened instead."
              />
            </label>

            <div style={twoColumnGridStyle}>
              <label style={labelStyle}>
                Device Type
                <select
                  name="deviceType"
                  value={formData.deviceType}
                  onChange={handleChange}
                  style={inputStyle}
                >
                  <option value="">
                    Select a device
                  </option>
                  <option value="desktop">
                    Desktop Computer
                  </option>
                  <option value="laptop">
                    Laptop Computer
                  </option>
                  <option value="android">
                    Android Phone or Tablet
                  </option>
                  <option value="iphone">
                    iPhone or iPad
                  </option>
                  <option value="other">Other</option>
                </select>
              </label>

              <label style={labelStyle}>
                Browser
                <select
                  name="browser"
                  value={formData.browser}
                  onChange={handleChange}
                  style={inputStyle}
                >
                  <option value="">
                    Select a browser
                  </option>
                  <option value="chrome">
                    Google Chrome
                  </option>
                  <option value="edge">
                    Microsoft Edge
                  </option>
                  <option value="safari">Safari</option>
                  <option value="firefox">Firefox</option>
                  <option value="other">Other</option>
                </select>
              </label>
            </div>

            <label
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 11,
                marginBottom: 26,
                color: "#4f4b5c",
                fontSize: 14,
                lineHeight: 1.6,
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                name="mayContact"
                checked={formData.mayContact}
                onChange={handleChange}
                style={{
                  width: 18,
                  height: 18,
                  marginTop: 2,
                  accentColor: "#ae5a8b",
                }}
              />

              The CarePath team may contact me if more
              information is needed to investigate this problem.
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: "100%",
                minHeight: 52,
                border: "none",
                borderRadius: 11,
                background: isSubmitting
                  ? "#b8a3b3"
                  : "#ae5a8b",
                color: "#ffffff",
                fontSize: 16,
                fontWeight: 800,
                cursor: isSubmitting
                  ? "not-allowed"
                  : "pointer",
                boxShadow: isSubmitting
                  ? "none"
                  : "0 6px 16px rgba(174, 90, 139, 0.28)",
              }}
            >
              {isSubmitting
                ? "Submitting Report..."
                : "Submit Technical Report"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}

const twoColumnGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(230px, 1fr))",
  gap: 20,
  marginBottom: 20,
};

const labelStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 8,
  color: "#322e43",
  fontSize: 14,
  fontWeight: 700,
};

const optionalTextStyle: React.CSSProperties = {
  color: "#888493",
  fontWeight: 500,
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

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  minHeight: 120,
  resize: "vertical",
  lineHeight: 1.6,
};

const characterCountStyle: React.CSSProperties = {
  margin: "-12px 0 20px",
  color: "#888493",
  fontSize: 12,
  textAlign: "right",
};