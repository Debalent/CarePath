export type Role = 'PATIENT' | 'DRIVER' | 'COORDINATOR' | 'ADMIN';

export type AuthUser = {
  id: string;
  email: string;
  role: Role;
  firstName?: string;
  lastName?: string;
  phone?: string;
};

export type LoginResponse = {
  user: {
    id: string;
    email: string;
    role: Role;
    firstName: string;
    lastName: string;
  };
  token: string;
};

export type RegisterResponse = {
  user: {
    id: string;
    email: string;
    phone: string;
    role: Role;
    firstName: string;
    lastName: string;
  };
  token: string;
};

export type MeResponse = {
  id: string;
  email: string;
  phone: string;
  role: Role;
  firstName: string;
  lastName: string;
  createdAt: string;
};

export type CreateRideRequestBody = {
  appointmentType: 'ONCOLOGY' | 'CARDIOLOGY' | 'NEUROLOGY' | 'DIALYSIS' | 'MENTAL_HEALTH' | 'POST_SURGICAL' | 'SPECIALIST' | 'OTHER';
  clinicName: string;
  clinicCity: string;
  clinicState: string;
  appointmentDate: string; // ISO date/datetime string
  estimatedMiles: number;
  isRecurring?: boolean;
  recurrenceNote?: string | null;
  appointmentNotes?: string | null;
  pickupAddress: string;
  pickupTime: string; // ISO datetime string
  creditId?: string | null;
  urgencyLevel?: 'NORMAL' | 'HIGH' | 'CRITICAL';
  needsSameDayFallback?: boolean;
  allowsCommunityVolunteer?: boolean;
  requestedAdvanceWindowHours?: number | null;
};
