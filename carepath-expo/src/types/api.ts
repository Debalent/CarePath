export type UserRole = "PATIENT" | "DRIVER" | "COORDINATOR" | "ADVOCATE" | "PARTNER" | "ADMIN";

export type AuthUser = {
  id: string;
  email: string;
  role?: UserRole;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  role?: UserRole;
  organization?: string;
};

export type AuthResponse = {
  success: boolean;
  message?: string;
  token?: string;
  user?: AuthUser;
};

export type UrgencyLevel = "NORMAL" | "URGENT" | "SAME_DAY";

export type RideRequestInput = {
  appointmentType: string;
  clinicName: string;
  clinicCity: string;
  clinicState: string;
  appointmentDate: string;
  estimatedMiles: number;
  pickupAddress: string;
  pickupTime: string;
  urgencyLevel: UrgencyLevel;
  appointmentNotes?: string;
};

export type RideRequestResponse = {
  success: boolean;
  message?: string;
  ride?: {
    id: string;
    status: string;
  };
};

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}
