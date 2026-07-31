"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  HeartHandshake,
  Home,
  Heart,
} from "lucide-react";

export default function RegisterChoicePage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#71769c] via-[#e6caef] to-[#694f81]px-5 py-10">
      {/* Decorative background shapes */}
      <div className="pointer-events-none absolute -left-28 top-20 h-80 w-80 rounded-full bg-[#d8b5e7]/40 blur-2xl" />

      <div className="pointer-events-none absolute -right-24 bottom-12 h-96 w-96 rounded-full bg-[#cdb3e8]/40 blur-3xl" />

      <section className="relative z-10 w-full max-w-[1170px] rounded-[28px] border border-white/70 bg-white px-6 py-10 shadow-[0_24px_70px_rgba(72,36,96,0.18)] sm:px-10 md:px-14 lg:px-20 lg:py-12">
        {/* Logo and heading */}
        <div className="mb-14 flex flex-col items-center text-center">
          <Image
            src="/carepath-logo.png"
            alt="CarePath"
            width={135}
            height={135}
            priority
            className="mb-5 rounded-[12px] object-contain"
          />

          <h1 className="mb-4 text-3xl font-extrabold leading-tight text-slate-950 sm:text-4xl md:text-5xl">
            Create your CarePath account
          </h1>

          <p className="text-base text-slate-600 sm:text-lg">
            Select the type of account you need.
          </p>
        </div>

        {/* Account cards */}
       <div className="flex w-full justify-center px-8 sm:px-10 lg:px-12">
  <div className="grid w-full max-w-[1040px] gap-8 md:grid-cols-2">
          {/* Patient card */}
          <Link
            href="/register/patient"
            className="group flex min-h-[400px] flex-col items-center justify-center rounded-[24px] border-2 border-[#dfc5e5] bg-gradient-to-br from-[#fcf7fd] to-[#f5eaf8] px-7 py-9 text-center shadow-[0_8px_20px_rgba(122,68,135,0.10)] transition duration-200 hover:-translate-y-1 hover:border-[#ae5a8b] hover:shadow-[0_16px_30px_rgba(122,68,135,0.18)]"
          >
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#ead8ee] text-[#9b4688]">
              <HeartHandshake size={46} strokeWidth={2} />
            </div>

            <div className="mb-5 flex w-full items-center justify-center gap-5">
              <span className="h-px w-12 bg-[#d7aedc]" />

              <h2 className="text-3xl font-extrabold text-[#913b87]">
                I am a patient
              </h2>

              <span className="h-px w-12 bg-[#d7aedc]" />
            </div>

            <p className="mb-8 max-w-[360px] text-[17px] leading-8 text-slate-700">
              Create a patient account to request rides, manage appointments,
              and complete your transportation profile.
            </p>

            <span className="inline-flex min-h-[58px] w-full max-w-[330px] items-center justify-center gap-3 rounded-[12px] bg-[#a33a9d] px-6 py-4 text-lg font-extrabold text-white shadow-[0_7px_16px_rgba(163,58,157,0.25)] transition group-hover:bg-[#8f3189]">
              Register as a patient
              <ArrowRight size={23} />
            </span>
          </Link>

          {/* Worker card */}
          <Link
            href="/register/worker"
            className="group flex min-h-[400px] flex-col items-center justify-center rounded-[24px] border-2 border-[#b9dfdc] bg-gradient-to-br from-[#f5fcfb] to-[#eaf7f6] px-7 py-9 text-center shadow-[0_8px_20px_rgba(31,135,125,0.10)] transition duration-200 hover:-translate-y-1 hover:border-[#159a91] hover:shadow-[0_16px_30px_rgba(31,135,125,0.18)]"
          >
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#d4efed] text-[#078a83]">
              <BriefcaseBusiness size={46} strokeWidth={2} />
            </div>

            <div className="mb-5 flex w-full items-center justify-center gap-5">
              <span className="h-px w-12 bg-[#abd9d5]" />

              <h2 className="text-3xl font-extrabold text-[#078a83]">
                I work with CarePath
              </h2>

              <span className="h-px w-12 bg-[#abd9d5]" />
            </div>

            <p className="mb-8 max-w-[370px] text-[17px] leading-8 text-slate-700">
              Register as a driver, coordinator, partner, or advocate. Worker
              accounts may require approval.
            </p>

            <span className="inline-flex min-h-[58px] w-full max-w-[330px] items-center justify-center gap-3 rounded-[12px] bg-[#078f88] px-6 py-4 text-lg font-extrabold text-white shadow-[0_7px_16px_rgba(7,143,136,0.24)] transition group-hover:bg-[#057b75]">
              Register as a worker
              <ArrowRight size={23} />
            </span>
          </Link>
        </div>
</div>
      
        {/* Divider */}
        <div className="mx-auto my-10 flex w-full max-w-[960px] items-center gap-5">
          <div className="h-px flex-1 bg-[#dfcce8]" />

          <Heart
            size={27}
            className="text-[#9e43b0]"
          />

          <div className="h-px flex-1 bg-[#dfcce8]" />
        </div>

        {/* Bottom links */}
        <div className="flex flex-col items-center gap-5 text-center">
          <p className="text-base text-slate-700 sm:text-lg">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-extrabold text-[#164ad8] hover:underline"
            >
              Sign in here
            </Link>
          </p>

          <Link
            href="/"
            className="inline-flex items-center gap-2 text-base font-medium text-[#164ad8] hover:underline sm:text-lg"
          >
            <Home size={22} />
            Return to the CarePath home page
          </Link>
        </div>
      </section>
    </main>
  );
}