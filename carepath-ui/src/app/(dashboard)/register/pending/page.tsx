import Link from "next/link";
import { Clock3 } from "lucide-react";

export default function RegistrationPendingPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#e5dbea] via-[#ede9f7] to-[#d2b9d8] px-5 py-10">
      <section className="w-full max-w-[650px] rounded-[22px] border border-slate-200 bg-white px-8 py-12 text-center shadow-[0_18px_50px_rgba(69,4,102,0.14)]">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#eee4f1] text-[#ae5a8b]">
          <Clock3 size={38} />
        </div>

        <h1 className="mb-4 text-4xl font-extrabold text-slate-900">
          Registration received
        </h1>

        <p className="mx-auto mb-8 max-w-[520px] text-lg leading-relaxed text-slate-600">
          Your worker account has been submitted. A CarePath
          administrator will review your information before your
          account is activated.
        </p>

        <div className="flex flex-col items-center gap-4">
          <Link
            href="/login"
            className="inline-flex min-h-[52px] items-center justify-center rounded-[11px] bg-[#ae5a8b] px-8 font-extrabold text-white transition hover:bg-[#9d4f7d]"
          >
            Return to sign in
          </Link>

          <Link
            href="/"
            className="text-[#0c6bc2] hover:underline"
          >
            Return to the CarePath home page
          </Link>
        </div>
      </section>
    </main>
  );
}