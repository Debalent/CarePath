import React, { useMemo, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import Screen from '@/components/Screen';
import TextField from '@/components/TextField';
import DateTimeField from '@/components/DateTimeField';
import Button from '@/components/Button';
import { colors, spacing, typography } from '@/theme';
import { createRideRequestApi } from '@/api/rides';
import { useAuth } from '@/auth/AuthContext';

const pad2 = (n: number) => String(n).padStart(2, '0');

// Format suitable for <input type="datetime-local"> (no seconds/timezone)
const toLocalDateTimeInputValue = (d: Date) => {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}T${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
};

const defaultLocalDateTimePlusDays = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return toLocalDateTimeInputValue(d);
};

const toIsoFromLocalInput = (value: string) => {
  // value is like 2026-08-08T14:30
  // new Date(value) interprets as local time in JS.
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) throw new Error('Invalid date/time');
  return d.toISOString();
};

export default function RequestRideScreen() {
  const { user } = useAuth();

  // Minimal fields required by controller
  const [appointmentType, setAppointmentType] = useState('Specialist appointment');
  const [clinicName, setClinicName] = useState('Care Clinic');
  const [clinicCity, setClinicCity] = useState('');
  const [clinicState, setClinicState] = useState('AR');
  const [appointmentDateLocal, setAppointmentDateLocal] = useState(defaultLocalDateTimePlusDays(7));
  const [estimatedMiles, setEstimatedMiles] = useState('');
  const [pickupAddress, setPickupAddress] = useState('');
  const [pickupTimeLocal, setPickupTimeLocal] = useState(defaultLocalDateTimePlusDays(7));
  const [appointmentNotes, setAppointmentNotes] = useState('');

  const [loading, setLoading] = useState(false);

  const canSubmit = useMemo(() => {
    return Boolean(clinicCity && clinicState && pickupAddress);
  }, [clinicCity, clinicState, pickupAddress]);

  const onSubmit = async () => {
    if (user?.role !== 'PATIENT') {
      Alert.alert('Not allowed', 'Only PATIENT accounts can request rides.');
      return;
    }

    try {
      setLoading(true);
      const miles = estimatedMiles.trim() ? Number(estimatedMiles) : null;

      const appointmentDate = toIsoFromLocalInput(appointmentDateLocal);
      const pickupTime = toIsoFromLocalInput(pickupTimeLocal);

      const body = {
        appointmentType,
        clinicName,
        clinicCity,
        clinicState,
        appointmentDate,
        estimatedMiles: miles,
        isRecurring: false,
        recurrenceNote: null,
        appointmentNotes: appointmentNotes.trim() || null,
        pickupAddress,
        pickupTime,
        creditId: null,
        urgencyLevel: 'NORMAL' as const,
        needsSameDayFallback: false,
        allowsCommunityVolunteer: false,
        requestedAdvanceWindowHours: null,
      };

      const created = await createRideRequestApi(body);
      Alert.alert('Ride request submitted', `Ride id: ${created?.id ?? 'created'}`);
    } catch (e: any) {
      const msg = e?.response?.data?.error || e?.response?.data?.message || e?.message || 'Request failed';
      Alert.alert('Request failed', String(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen scroll>
      <Text style={styles.title}>Ride request</Text>
      <Text style={styles.subtitle}>All fields below are sent to your API on port 3001.</Text>

      <View style={{ height: spacing.lg }} />

      <TextField label="Appointment type" value={appointmentType} onChangeText={setAppointmentType} />
      <TextField label="Clinic name" value={clinicName} onChangeText={setClinicName} />
      <TextField label="Clinic city" value={clinicCity} onChangeText={setClinicCity} />
      <TextField label="Clinic state (2-letter)" value={clinicState} onChangeText={setClinicState} autoCapitalize="characters" />
      <DateTimeField
        label="Appointment date/time"
        value={appointmentDateLocal}
        onChangeText={setAppointmentDateLocal}
        helperText="On web you get a picker. On mobile, type like 2026-08-08T14:30"
      />
      <TextField label="Estimated miles (optional)" value={estimatedMiles} onChangeText={setEstimatedMiles} keyboardType="numeric" />
      <TextField label="Pickup address" value={pickupAddress} onChangeText={setPickupAddress} />
      <DateTimeField
        label="Pickup date/time"
        value={pickupTimeLocal}
        onChangeText={setPickupTimeLocal}
        helperText="On web you get a picker. On mobile, type like 2026-08-08T12:30"
      />
      <TextField label="Notes (optional)" value={appointmentNotes} onChangeText={setAppointmentNotes} />

      <View style={{ height: spacing.md }} />

      <Button title="Submit ride request" onPress={onSubmit} loading={loading} disabled={!canSubmit} />

      <View style={{ height: spacing.lg }} />

      <Text style={styles.noteTitle}>Common backend error</Text>
      <Text style={styles.note}>
        If you see: "Patient profile required before requesting a ride" — your backend expects a Patient profile row for this user.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { color: colors.text, fontSize: typography.h2, fontWeight: '800' },
  subtitle: { color: colors.muted, marginTop: spacing.xs },
  noteTitle: { color: colors.text, fontWeight: '800' },
  note: { color: colors.muted, marginTop: spacing.xs, lineHeight: 20 },
});
