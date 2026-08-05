export type GpsRole = 'driver' | 'patient' | 'coordinator' | 'advocate' | 'partner'

export type GpsCapability = {
  label: string
  description: string
  available: boolean
  status: 'ready' | 'planned' | 'beta'
}

export type GpsTrackerSnapshot = {
  title: string
  subtitle: string
  etaMinutes: number
  statusLabel: string
  locationLabel: string
  visibilityLabel: string
  participants: Array<{ name: string; role: string; access: 'Owner' | 'Viewer' | 'Shared' }>
  timeline: Array<{ label: string; detail: string; active: boolean }>
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

export function buildGpsTrackerSnapshot(role: GpsRole): GpsTrackerSnapshot {
  switch (role) {
    case 'driver':
      return {
        title: 'North Shore Clinic route',
        subtitle: 'Pickup confirmed and approaching the care facility.',
        etaMinutes: 12,
        statusLabel: 'En route',
        locationLabel: 'Near 47th St and Cicero Ave',
        visibilityLabel: 'Visible to dispatch and the assigned patient contact',
        participants: [
          { name: 'You', role: 'Driver', access: 'Owner' },
          { name: 'Dispatch', role: 'Coordinator', access: 'Viewer' },
          { name: 'Patient', role: 'Rider', access: 'Shared' },
        ],
        timeline: [
          { label: 'Pickup confirmed', detail: 'The rider is ready and the trip is active.', active: true },
          { label: 'On route', detail: 'Traffic is moving smoothly with one detour warning.', active: true },
          { label: 'Arriving soon', detail: 'Expected arrival is within the next 12 minutes.', active: false },
        ],
      }

    case 'patient':
      return {
        title: 'Your ride is moving',
        subtitle: 'Your driver is on the way and your care team can follow progress.',
        etaMinutes: 15,
        statusLabel: 'Arriving soon',
        locationLabel: 'Approaching the appointment destination',
        visibilityLabel: 'Shared with your caregiver and the clinic contact',
        participants: [
          { name: 'You', role: 'Patient', access: 'Owner' },
          { name: 'Caregiver', role: 'Support', access: 'Viewer' },
          { name: 'Clinic', role: 'Medical provider', access: 'Viewer' },
        ],
        timeline: [
          { label: 'Trip requested', detail: 'Your transportation request was accepted.', active: true },
          { label: 'Driver assigned', detail: 'The transport partner is on the way.', active: true },
          { label: 'Arrival window', detail: 'The vehicle should arrive within 15 minutes.', active: false },
        ],
      }

    case 'coordinator':
    case 'advocate':
    case 'partner':
      return {
        title: 'Care-team trip board',
        subtitle: 'Dispatch can monitor an active route and escalate delay risks.',
        etaMinutes: 10,
        statusLabel: 'Monitoring',
        locationLabel: 'Live map view is ready for the current trip',
        visibilityLabel: 'Shared with the assigned coordinator and support contacts',
        participants: [
          { name: 'Coordinator', role: 'Dispatch', access: 'Owner' },
          { name: 'Advocate', role: 'Support', access: 'Viewer' },
          { name: 'Provider', role: 'Medical team', access: 'Viewer' },
        ],
        timeline: [
          { label: 'Ride assigned', detail: 'The driver and rider were matched successfully.', active: true },
          { label: 'Track active', detail: 'Location sharing is available for the current leg.', active: true },
          { label: 'Escalate if delayed', detail: 'A prompt can be sent if the route stalls.', active: false },
        ],
      }

    default:
      return {
        title: 'Tracking preview',
        subtitle: 'A live view will appear here once a route is active.',
        etaMinutes: 0,
        statusLabel: 'Waiting',
        locationLabel: 'No active trip yet',
        visibilityLabel: 'Visibility is not enabled until a ride starts',
        participants: [],
        timeline: [],
      }
  }
}
