import React, { useState } from "react";
import { StyleSheet, Text } from "react-native";
import { Screen } from "../components/Screen";
import { TextField } from "../components/TextField";
import { Button } from "../components/Button";
import { useAuth } from "../auth/AuthContext";
import { requestRide } from "../api/rides";
import { colors, spacing, typography } from "../theme";

export function RequestRideScreen() {
  const { token } = useAuth();
  const [appointmentType, setAppointmentType] = useState("");
  const [clinicName, setClinicName] = useState("");
  const [clinicCity, setClinicCity] = useState("");
  const [clinicState, setClinicState] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [estimatedMiles, setEstimatedMiles] = useState("");
  const [pickupAddress, setPickupAddress] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!token) return;
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);
    try {
      const response = await requestRide(
        {
          appointmentType,
          clinicName,
          clinicCity,
          clinicState,
          appointmentDate,
          estimatedMiles: Number(estimatedMiles) || 0,
          pickupAddress,
          pickupTime,
          urgencyLevel: "NORMAL",
        },
        token,
      );
      setSuccess(response.message ?? "Your ride request has been submitted.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to submit your ride request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Screen>
      <Text style={styles.title}>Appointment Details</Text>
      <TextField label="Appointment type" value={appointmentType} onChangeText={setAppointmentType} />
      <TextField label="Clinic name" value={clinicName} onChangeText={setClinicName} />
      <TextField label="Clinic city" value={clinicCity} onChangeText={setClinicCity} />
      <TextField label="Clinic state" value={clinicState} onChangeText={setClinicState} autoCapitalize="characters" />
      <TextField
        label="Appointment date/time (ISO)"
        value={appointmentDate}
        onChangeText={setAppointmentDate}
        placeholder="2026-08-15T09:00:00Z"
      />
      <TextField
        label="Estimated one-way miles"
        value={estimatedMiles}
        onChangeText={setEstimatedMiles}
        keyboardType="numeric"
      />
      <TextField label="Pickup address" value={pickupAddress} onChangeText={setPickupAddress} />
      <TextField label="Pickup time" value={pickupTime} onChangeText={setPickupTime} placeholder="08:30 AM" />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {success ? <Text style={styles.success}>{success}</Text> : null}
      <Button label="Submit Request" onPress={handleSubmit} loading={isSubmitting} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    ...typography.heading,
    marginBottom: spacing.lg,
  },
  error: {
    color: colors.danger,
    marginBottom: spacing.md,
  },
  success: {
    color: colors.success,
    marginBottom: spacing.md,
  },
});
