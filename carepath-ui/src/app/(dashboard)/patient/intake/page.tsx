import { DashboardLayout } from "@/components/layout/DashboardLayout";
import PatientProfileForm from "@/components/patient/PatientProfileForm";

export default function PatientIntakePage() {
  return (
    <DashboardLayout
      role="patient"
      title="Patient Intake"
      subtitle="Complete your transportation profile"
      userName="Patient"
    >
      <PatientProfileForm mode="intake" />
    </DashboardLayout>
  );
}