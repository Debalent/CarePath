import Link from "next/link";
import { Clock3 } from "lucide-react";

export default function RegistrationPendingPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        background:
          "linear-gradient(135deg, #f3edf7 0%, #eee7f4 50%, #dcc7e5 100%)",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: "560px",
          padding: "42px 46px",
          borderRadius: "24px",
          border: "1px solid rgba(255,255,255,0.75)",
          background: "#ffffff",
          textAlign: "center",
          boxShadow: "0 20px 60px rgba(74,45,89,0.18)",
        }}
      >
        <div
          style={{
            width: "64px",
            height: "64px",
            margin: "0 auto 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "999px",
            background: "#f1e3f0",
            color: "#ae5a8b",
          }}
        >
          <Clock3 size={32} />
        </div>

        <h1
          style={{
            margin: 0,
            fontSize: "30px",
            lineHeight: 1.2,
            fontWeight: 800,
            color: "#0f172a",
          }}
        >
          Registration received
        </h1>

        <p
          style={{
            maxWidth: "430px",
            margin: "18px auto 0",
            fontSize: "16px",
            lineHeight: 1.7,
            color: "#475569",
          }}
        >
          Your worker account has been submitted. A CarePath administrator will
          review your information before your account is activated.
        </p>

        <div
          style={{
            marginTop: "30px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <Link
            href="/login"
            style={{
              minHeight: "50px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "12px 28px",
              borderRadius: "11px",
              background: "#ae5a8b",
              color: "#ffffff",
              fontSize: "16px",
              fontWeight: 800,
              textDecoration: "none",
              boxShadow: "0 6px 16px rgba(174,90,139,0.28)",
            }}
          >
            Return to sign in
          </Link>

          <Link
            href="/"
            style={{
              display: "inline-block",
              color: "#0c6bc2",
              fontSize: "16px",
              fontWeight: 500,
              textDecoration: "none",
            }}
          >
            Return to the CarePath home page
          </Link>
        </div>
      </section>
    </main>
  );
}