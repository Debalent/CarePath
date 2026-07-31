const DEFAULT_API_BASE = process.env.NEXT_PUBLIC_CAREPATH_API_URL ?? "http://localhost:3000/api"

export type LoginCredentials = {
  email: string
  password: string
}

export type LoginResponse = {
  success: boolean
  message?: string
  token?: string
  user?: {
    id: string
    email: string
    role?: string
  }
}

export async function loginUser(
  credentials: LoginCredentials,
): Promise<LoginResponse> {
  const response = await fetch(`${DEFAULT_API_BASE}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  })

  const contentType = response.headers.get("content-type")

  const data: LoginResponse | null =
    contentType?.includes("application/json")
      ? ((await response.json()) as LoginResponse)
      : null

  if (!response.ok) {
    throw new Error(
      data?.message ??
        `Unable to log in. The server returned status ${response.status}.`,
    )
  }

  if (!data) {
    throw new Error(
"The login server returned an unexpected response. Make sure the API is running.",
    )
  }

  return data
}

export type RegistrationData = {
  firstName: string
  lastName: string
  phone: string
  email: string
  password: string
  role?: string
}

export type RegistrationResponse = {
  success: boolean
  message?: string
  token?: string
  user?: {
    id: string
    email: string
    role?: string
  }
}

export async function registerUser(
  registrationData: RegistrationData,
): Promise<RegistrationResponse> {
  const response = await fetch(`${DEFAULT_API_BASE}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(registrationData),
  })

  const contentType = response.headers.get("content-type")

  const data: RegistrationResponse | null =
    contentType?.includes("application/json")
      ? ((await response.json()) as RegistrationResponse)
      : null

  if (!response.ok) {
    throw new Error(
      data?.message ??
        `Unable to create the account. The server returned status ${response.status}.`,
    )
  }

  if (!data) {
    throw new Error(
"The registration server returned an unexpected response. Make sure the API is running.",
    )
  }

  return data
}