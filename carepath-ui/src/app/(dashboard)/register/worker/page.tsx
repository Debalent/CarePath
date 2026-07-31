"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { registerUser } from "@/services/auth";

type WorkerRole = "DRIVER" | "COORDINATOR" | "PARTNER" | "ADVOCATE";

export default function WorkerRegisterPage() {
  const router = useRouter();

  const [role, setRole] = useState<WorkerRole>("DRIVER");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleRegister(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    setErrorMessage("");

    if (password !== confirmPassword) {
      setErrorMessage("The passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setErrorMessage("The password must contain at least 8 characters.");
      return;
    }

    setIsLoading(true);

    try {
      await registerUser({
        firstName,
        lastName,
        phone,
        email,
        password,
        role,
        ...(organization ? { organization } : {}),
      });

      router.push("/register/pending");
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong while creating your account.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  const inputClasses =
    "min-h-[56px] w-full rounded-[11px] border border-slate-300 bg-white px-4 py-3 text-[16px] text-slate-900 outline-none transition focus:border-[#ae5a8b] focus:ring-2 focus:ring-[#ae5a8b]/20";

  const labelClasses =
    "mb-2 block text-left text-[15px] font-bold text-slate-700";

  return (
    <main className="flex min-h-screen items-start justify-center bg-gradient-to-br from-[#71769c] via-[#e6caef] to-[#694f81] px-5 pt-8 pb-16">
      <section className="w-full max-w-[980px] rounded-[24px] border border-slate-200 bg-white px-6 pt-8 pb-3 shadow-[0_18px_50px_rgba(69,4,102,0.14)] sm:px-10 md:px-14 lg:px-16">
        <div className="mb-8 flex flex-col items-center text-center">
          <Image
            src="/carepath-logo.png"
            alt="CarePath"
            width={115}
            height={115}
            priority
            className="mb-5 rounded-[10px] object-contain"
          />

          <h1 className="mb-3 text-4xl font-extrabold leading-tight text-slate-900">
            Worker registration
          </h1>

          <p className="max-w-[620px] text-base leading-relaxed text-[#766d7c] md:text-lg">
            Create an account for your CarePath role. Your account may require
            approval before you can sign in.
          </p>
        </div>

        <div className="flex w-full justify-center">
          <form
            onSubmit={handleRegister}
            className="flex w-full max-w-[700px] flex-col gap-5"
          >
            <div>
              <label htmlFor="role" className={labelClasses}>
                CarePath role
              </label>

              <select
                id="role"
                name="role"
                value={role}
                onChange={(event) => setRole(event.target.value as WorkerRole)}
                className={inputClasses}
              >
                <option value="DRIVER">Driver</option>
                <option value="COORDINATOR">Transportation coordinator</option>
                <option value="PARTNER">Community partner</option>
                <option value="ADVOCATE">Patient advocate</option>
              </select>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="firstName" className={labelClasses}>
                  First name
                </label>

                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  autoComplete="given-name"
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  className={inputClasses}
                />
              </div>

              <div>
                <label htmlFor="lastName" className={labelClasses}>
                  Last name
                </label>

                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  autoComplete="family-name"
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                  className={inputClasses}
                />
              </div>
            </div>

            <div>
              <label htmlFor="organization" className={labelClasses}>
                Organization or agency
              </label>

              <input
                id="organization"
                name="organization"
                type="text"
                value={organization}
                onChange={(event) => setOrganization(event.target.value)}
                placeholder="CarePath, clinic, transportation provider, etc."
                className={inputClasses}
              />
            </div>

            <div>
              <label htmlFor="phone" className={labelClasses}>
                Phone number
              </label>

              <input
                id="phone"
                name="phone"
                type="tel"
                required
                autoComplete="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="(555) 555-5555"
                className={inputClasses}
              />
            </div>

            <div>
              <label htmlFor="email" className={labelClasses}>
                Work email address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="name@example.com"
                className={inputClasses}
              />
            </div>

            <div>
              <label htmlFor="password" className={labelClasses}>
                Password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="At least 8 characters"
                className={inputClasses}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className={labelClasses}>
                Confirm password
              </label>

              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Enter the password again"
                className={inputClasses}
              />
            </div>

            {errorMessage && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-[10px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                <AlertCircle size={18} className="mt-0.5 shrink-0" />

                <span>{errorMessage}</span>
              </div>
            )}

           <button
  type="submit"
  disabled={isLoading}
  className="mt-2 min-h-[58px] w-full rounded-[12px] bg-[#ae5a8b] px-6 py-4 text-[17px] font-extrabold text-white shadow-[0_6px_16px_rgba(174,90,139,0.28)] transition hover:bg-[#9d4f7d] disabled:cursor-not-allowed disabled:bg-slate-400"
>
  {isLoading
    ? "Creating account..."
    : "Submit Worker Registration"}
</button>
</form>
</div>

<div
  className="flex flex-col items-center text-center"
  style={{ marginTop: 25 }}
>
  <p
    className="text-base text-slate-500"
    style={{ marginBottom: 14 }}
  >
    Already have an account?{" "}
    <Link
      href="/login"
      className="font-bold text-[#0c6bc2] hover:underline"
    >
      Sign in here
    </Link>
  </p>

  <Link
    href="/register"
    className="relative -top-2 text-base text-[#0c6bc2] hover:underline"
    style={{ marginBottom: 6 }}
  >
    Choose a different account type
  </Link>

  <Link
  href="/"
  className="relative -top-3 text-base text-slate-500 hover:text-[#0c6bc2] hover:underline"
>
  Return to the CarePath home page
</Link>
</div>
      </section>
    </main>
  );
}
