"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function CoordinatorDashboardPage() {
  return (
    <DashboardLayout
      role="coordinator"
      title="Home"
      subtitle="Manage rides, drivers, patients, and transportation routes"
      userName="Coordinator"
    >
      <div className="cp-space-y-4">
        <section
          style={{
            padding: 24,
            borderRadius: 16,
            background: "#ffffff",
            border: "1px solid #e3d9e8",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: 22,
              color: "#59436b",
            }}
          >
            Welcome to the Coordinator Hub
          </h2>

          <p
            style={{
              marginTop: 10,
              marginBottom: 0,
              color: "#64748b",
            }}
          >
            Review ride requests, assign drivers, organize routes, and help
            patients reach their appointments.
          </p>
        </section>
      </div>
    </DashboardLayout>
  );
}