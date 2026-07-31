"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";

const DEFAULT_API_BASE =
  process.env.NEXT_PUBLIC_CAREPATH_API_URL ??
  "http://localhost:3001/api";

const roleRedirect: Record<string, string> = {
  DRIVER: "/driver/dashboard",
  COORDINATOR: "/coordinator/pooling",
  ADMIN: "/admin/credits",
  PARTNER: "/partner/dashboard",
  ADVOCATE: "/advocate/dashboard",
};

export default function LoginPage() {
  const router = useRouter();

  const [apiBase] = useState(DEFAULT_API_BASE);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogin(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch(`${apiBase}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));

        throw new Error(
          body?.message ?? `Login failed (${response.status}).`,
        );
      }

      const { token, user } = await response.json();
      const role: string = user?.role ?? "PATIENT";

      window.localStorage.setItem(
        `carepath.${role.toLowerCase()}.token`,
        token,
      );

      if (role === "PATIENT") {
        const intakeCompleted =
          user?.intakeCompleted ??
          user?.profileCompleted ??
          false;

        router.push(
          intakeCompleted
            ? "/patient"
            : "/patient/intake",
        );

        return;
      }

      router.push(roleRedirect[role] ?? "/");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Login failed. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#71769c] via-[#e6caef] to-[#694f81] px-5 py-10">
      <section className="w-full max-w-[950px] rounded-[22px] border border-slate-200 bg-white px-6 py-10 shadow-[0_18px_50px_rgba(69,4,102,0.14)] sm:px-10 sm:py-12 md:px-16 md:py-12">
        {/* Logo */}
        <div className="mb-5 flex justify-center">
          <Image
            src="/carepath-logo.png"
            alt="CarePath"
            width={90}
            height={90}
            priority
            className="rounded-[10px] object-contain"
          />
        </div>

        {/* Heading */}
        <div className="mb-8 text-center">
          <h1 className="mb-3 text-4xl font-extrabold leading-tight text-slate-900 md:text-5xl">
            Welcome back
          </h1>

          <p className="text-base leading-relaxed text-[#766d7c] md:text-lg">
            Sign in to manage rides and transportation services.
          </p>
        </div>

        {/* Form and links */}
        <div
          style={{
            width: "100%",
            maxWidth: "660px",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          {error && (
            <div
              role="alert"
              className="mb-6 flex w-full items-start gap-2 rounded-[10px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              <AlertCircle
                size={18}
                className="mt-0.5 shrink-0"
              />

              <span>{error}</span>
            </div>
          )}

          <form
            onSubmit={handleLogin}
            className="flex w-full flex-col gap-6"
          >
            <div className="w-full">
              <label
                htmlFor="email"
                className="mb-2 block text-left text-[15px] font-bold text-slate-700"
              >
                Email address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="name@example.com"
                className="min-h-[58px] w-full rounded-[11px] border border-slate-300 bg-white px-5 py-4 text-[17px] text-slate-900 outline-none transition focus:border-[#ae5a8b] focus:ring-2 focus:ring-[#ae5a8b]/20"
              />
            </div>

            <div className="w-full">
              <label
                htmlFor="password"
                className="mb-2 block text-left text-[15px] font-bold text-slate-700"
              >
                Password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="Enter your password"
                className="min-h-[58px] w-full rounded-[11px] border border-slate-300 bg-white px-5 py-4 text-[17px] text-slate-900 outline-none transition focus:border-[#ae5a8b] focus:ring-2 focus:ring-[#ae5a8b]/20"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 min-h-[58px] w-full rounded-[12px] bg-[#ae5a8b] px-6 py-4 text-[17px] font-extrabold text-white shadow-[0_6px_16px_rgba(174,90,139,0.28)] transition hover:bg-[#9d4f7d] disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {isSubmitting ? "Signing in…" : "Sign In"}
            </button>
          </form>

          {/* Links */}
          <div
            className="flex w-full flex-col items-center gap-5 text-center"
            style={{ marginTop: 28 }}
          >
            <p className="text-base text-slate-500">
              Need an account?{" "}
              <Link
                href="/register"
                className="font-bold text-[#0c6bc2] hover:underline"
              >
                Register here
              </Link>
            </p>

            <Link
              href="/"
              className="text-base text-[#0c6bc2] hover:underline"
            >
              Return to the CarePath home page
            </Link>

            <p className="pt-1 text-sm leading-relaxed text-slate-400">
              You will be redirected to the correct dashboard after login.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}