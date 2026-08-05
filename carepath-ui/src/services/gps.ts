export type GpsRole = 'driver' | 'patient' | 'coordinator' | 'advocate' | 'partner'

export type GpsCapability = {
  label: string
  description: string
  available: boolean
  status: 'ready' | 'planned' | 'beta'
}

export function getGpsCapabilityPlan(role: GpsRole): GpsCapability[] {
  switch (role) {
    case 'driver':
      return [
        {
          label: 'Turn-by-turn guidance',
          description: 'Route prompts and arrival estimates for each scheduled trip.',
          available: true,
          status: 'ready',
        },
        {
          label: 'Live ride handoff',
          description: 'Share arrival timing with dispatch and coordinators in real time.',
          available: true,
          status: 'beta',
        },
        {
          label: 'Safety checkpoints',
          description: 'Flag route deviations or delays for fast care-team follow-up.',
          available: false,
          status: 'planned',
        },
      ]

    case 'patient':
      return [
        {
          label: 'Ride status updates',
          description: 'Receive live progress updates from pickup to arrival.',
          available: true,
          status: 'beta',
        },
        {
          label: 'Share location with care team',
          description: 'Let caregivers and advocates follow the trip securely.',
          available: true,
          status: 'planned',
        },
        {
          label: 'Provider visibility',
          description: 'Give clinicians a read-only view of transport progress.',
          available: false,
          status: 'planned',
        },
      ]

    case 'coordinator':
    case 'advocate':
    case 'partner':
      return [
        {
          label: 'Care-team tracking',
          description: 'Monitor active rides and patient movement from a shared dashboard.',
          available: true,
          status: 'beta',
        },
        {
          label: 'Provider notifications',
          description: 'Alert medical staff when a patient arrives or needs assistance.',
          available: true,
          status: 'planned',
        },
        {
          label: 'Route escalation',
          description: 'Escalate delays or detours to the correct support channel.',
          available: false,
          status: 'planned',
        },
      ]

    default:
      return []
  }
}
