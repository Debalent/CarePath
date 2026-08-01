"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import PatientProfileForm from "@/components/patient/PatientProfileForm";

export default function PatientProfilePage() {
  return (
    <DashboardLayout
      role="patient"
      title="My Profile"
      subtitle="Review and update your personal information"
      userName="Patient"
    >
      <PatientProfileForm mode="profile" />
    </DashboardLayout>
  );
}