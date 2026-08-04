"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const DEFAULT_API_BASE =
  process.env.NEXT_PUBLIC_CAREPATH_API_URL ??
  "http://localhost:3001/api";

type WorkerRole = "DRIVER" | "COORDINATOR" | "PARTNER" | "ADVOCATE";

export default function WorkerRegistrationPage() {
  const router = useRouter();

  const [role, setRole] = useState<WorkerRole>("DRIVER");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [organization, setOrganization] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccessMessage("");

    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !phone.trim() ||
      !email.trim() ||
      !password ||
      !confirmPassword
    ) {
      setError("Please complete all required fields.");
      return;
    }

    if (password.length < 8) {
      setError("Your password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${DEFAULT_API_BASE}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          phone: phone.trim(),
          email: email.trim(),
          password,

          // This can remain here for the form even if the backend
          // does not currently save organization information.
          organization: organization.trim(),
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.message ??
            data?.error ??
            "Worker registration could not be completed."
        );
      }

      setSuccessMessage(
        "Your worker account was created successfully. Redirecting you to sign in..."
      );

      window.setTimeout(() => {
        router.push("/login");
      }, 1200);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Worker registration could not be completed."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputStyle = {
    width: "100%",
    minHeight: "46px",
    border: "1px solid #cbd7e6",
    borderRadius: "9px",
    backgroundColor: "#ffffff",
    padding: "10px 12px",
    fontSize: "15px",
    color: "#18243b",
    outline: "none",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "6px",
    fontSize: "13px",
    fontWeight: 700,
    color: "#18243b",
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        overflowY: "auto",
        background:
          "linear-gradient(135deg, #71769c 0%, #e6caef 50%, #694f81 100%)",
        padding: "32px 18px",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: "790px",
          margin: "0 auto",
          borderRadius: "24px",
          backgroundColor: "#ffffff",
          padding: "28px 46px 32px",
          boxShadow: "0 14px 40px rgba(45, 35, 78, 0.18)",
        }}
      >
        {/* Header */}
        <div
          style={{
            marginBottom: "26px",
            textAlign: "center",
          }}
        >
          <Image
            src="/carepath-logo.png"
            alt="CarePath"
            width={100}
            height={100}
            priority
            style={{
              display: "block",
              width: "100px",
              height: "auto",
              margin: "0 auto 6px",
              objectFit: "contain",
            }}
          />

          <h1
            style={{
              margin: "0 0 6px",
              fontSize: "32px",
              lineHeight: 1.15,
              fontWeight: 800,
              color: "#101828",
            }}
          >
            Worker registration
          </h1>

          <p
            style={{
              maxWidth: "590px",
              margin: "0 auto",
              fontSize: "15px",
              lineHeight: 1.55,
              color: "#43516a",
            }}
          >
            Create an account for your CarePath role. Your account may require
            approval before you can sign in.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Role */}
          <div style={{ marginBottom: "18px" }}>
            <label htmlFor="role" style={labelStyle}>
              CarePath role
            </label>

            <select
              id="role"
              value={role}
              onChange={(event) =>
                setRole(event.target.value as WorkerRole)
              }
              style={inputStyle}
            >
              <option value="DRIVER">Driver</option>
              <option value="COORDINATOR">Coordinator</option>
              <option value="PARTNER">Partner</option>
              <option value="ADVOCATE">Advocate</option>
            </select>
          </div>

          {/* Name row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "18px",
              marginBottom: "18px",
            }}
          >
            <div>
              <label htmlFor="firstName" style={labelStyle}>
                First name
              </label>

              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                autoComplete="given-name"
                required
                style={inputStyle}
              />
            </div>

            <div>
              <label htmlFor="lastName" style={labelStyle}>
                Last name
              </label>

              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                autoComplete="family-name"
                required
                style={inputStyle}
              />
            </div>
          </div>

          {/* Organization */}
          <div style={{ marginBottom: "18px" }}>
            <label htmlFor="organization" style={labelStyle}>
              Organization or agency
            </label>

            <input
              id="organization"
              type="text"
              value={organization}
              onChange={(event) => setOrganization(event.target.value)}
              placeholder="CarePath, clinic, transportation provider, etc."
              autoComplete="organization"
              style={inputStyle}
            />
          </div>

          {/* Phone */}
          <div style={{ marginBottom: "18px" }}>
            <label htmlFor="phone" style={labelStyle}>
              Phone number
            </label>

            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="(555) 555-5555"
              autoComplete="tel"
              required
              style={inputStyle}
            />
          </div>

          {/* Email */}
          <div style={{ marginBottom: "18px" }}>
            <label htmlFor="email" style={labelStyle}>
              Work email address
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@example.com"
              autoComplete="email"
              required
              style={inputStyle}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: "18px" }}>
            <label htmlFor="password" style={labelStyle}>
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="At least 8 characters"
              autoComplete="new-password"
              minLength={8}
              required
              style={inputStyle}
            />
          </div>

          {/* Confirm password */}
          <div style={{ marginBottom: "18px" }}>
            <label htmlFor="confirmPassword" style={labelStyle}>
              Confirm password
            </label>

            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(event.target.value)
              }
              placeholder="Enter the password again"
              autoComplete="new-password"
              minLength={8}
              required
              style={inputStyle}
            />
          </div>

          {/* Error */}
          {error && (
            <div
              role="alert"
              style={{
                marginBottom: "16px",
                border: "1px solid #efb2b2",
                borderRadius: "9px",
                backgroundColor: "#fff2f2",
                padding: "11px 13px",
                fontSize: "14px",
                lineHeight: 1.45,
                color: "#9f2727",
              }}
            >
              {error}
            </div>
          )}

          {/* Success */}
          {successMessage && (
            <div
              role="status"
              style={{
                marginBottom: "16px",
                border: "1px solid #a8d8c4",
                borderRadius: "9px",
                backgroundColor: "#effaf5",
                padding: "11px 13px",
                fontSize: "14px",
                lineHeight: 1.45,
                color: "#176c4e",
              }}
            >
              {successMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: "100%",
              minHeight: "48px",
              border: "none",
              borderRadius: "10px",
              backgroundColor: isSubmitting ? "#c58caf" : "#ae5a8b",
              padding: "12px 18px",
              fontSize: "15px",
              fontWeight: 800,
              color: "#ffffff",
              cursor: isSubmitting ? "not-allowed" : "pointer",
              boxShadow: "0 5px 14px rgba(174, 90, 139, 0.25)",
            }}
          >
            {isSubmitting
              ? "Creating account..."
              : "Submit Worker Registration"}
          </button>
        </form>

        {/* Bottom links */}
        <div
          style={{
            marginTop: "25px",
            textAlign: "center",
            fontSize: "14px",
            lineHeight: 1.6,
            color: "#536178",
          }}
        >
          <p style={{ margin: "0 0 10px" }}>
            Already have an account?{" "}
            <Link
              href="/login"
              style={{
                fontWeight: 700,
                color: "#075fc7",
                textDecoration: "none",
              }}
            >
              Sign in here
            </Link>
          </p>

          <p style={{ margin: "0 0 10px" }}>
            <Link
              href="/register"
              style={{
                color: "#075fc7",
                textDecoration: "none",
              }}
            >
              Choose a different account type
            </Link>
          </p>

          <p style={{ margin: 0 }}>
            <Link
              href="/"
              style={{
                color: "#075fc7",
                textDecoration: "none",
              }}
            >
              Return to the CarePath home page
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}