'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

import {
  AlertCircle,
  Car,
  CheckCircle2,
  Clock3,
  MapPin,
  Navigation,
  Route,
  ToggleLeft,
  ToggleRight,
  UserRound,
} from 'lucide-react'

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'

import type {
  EventClickArg,
  EventContentArg,
  EventInput,
} from '@fullcalendar/core'

import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { StatCard } from '@/components/ui/StatCard'

import {
  demoRides,
  RideRow,
  statusVariant,
  toDisplayDate,
} from '@/lib/portal'

const DEFAULT_API_BASE =
  process.env.NEXT_PUBLIC_CAREPATH_API_URL ??
  'http://localhost:3001/api'

type DataMode = 'demo' | 'live'

function formatStatus(status: string): string {
  return status
    .toLowerCase()
    .split('_')
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join(' ')
}

function calendarColors(status: string) {
  switch (status) {
    case 'MATCHED':
      return {
        background: '#e6caef',
        border: '#9b72ad',
      }

    case 'CONFIRMED':
      return {
        background: '#c8def4',
        border: '#6f9fc9',
      }

    case 'IN_PROGRESS':
      return {
        background: '#f7dfc2',
        border: '#c58d4a',
      }

    case 'COMPLETED':
      return {
        background: '#cfe9dd',
        border: '#6ca88d',
      }

    case 'CANCELLED':
      return {
        background: '#f4ccd9',
        border: '#bd7189',
      }

    default:
      return {
        background: '#ece1f6',
        border: '#a783b8',
      }
  }
}

function patientName(ride: RideRow): string {
  if (!ride.patient) {
    return 'Patient'
  }

  return `${ride.patient.user.firstName} ${ride.patient.user.lastName}`
}

function DriverCalendarEvent(
  eventInfo: EventContentArg,
) {
  const name =
    eventInfo.event.extendedProps.patientName ??
    eventInfo.event.title

  return (
    <div className="carepath-calendar-event">
      <Car
        size={13}
        className="carepath-calendar-event-icon"
        aria-hidden="true"
      />

      <div className="carepath-calendar-event-text">
        {eventInfo.timeText && (
          <span className="carepath-calendar-event-time">
            {eventInfo.timeText}
          </span>
        )}

        <span className="carepath-calendar-event-title">
          {name}
        </span>
      </div>
    </div>
  )
}

export default function DriverDashboardPage() {
  const [mode, setMode] =
    useState<DataMode>('demo')

  const [apiBase, setApiBase] =
    useState(DEFAULT_API_BASE)

  const [token, setToken] = useState('')

  const [rides, setRides] = useState<RideRow[]>(
    demoRides.filter((ride) => ride.driver !== null),
  )

  const [selectedRideId, setSelectedRideId] =
    useState(
      demoRides.find((ride) => ride.driver !== null)
        ?.id ?? '',
    )

  const [isAvailableNow, setIsAvailableNow] =
    useState(false)

  const [isSmallScreen, setIsSmallScreen] =
    useState(false)

  const [loading, setLoading] = useState(false)

  const [actionLoading, setActionLoading] =
    useState(false)

  const [message, setMessage] =
    useState<string | null>(null)

  const [error, setError] =
    useState<string | null>(null)

  useEffect(() => {
    const savedToken = window.localStorage.getItem(
      'carepath.driver.token',
    )

    if (savedToken) {
      setToken(savedToken)
    }
  }, [])

  useEffect(() => {
    const updateScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 720)
    }

    updateScreenSize()

    window.addEventListener(
      'resize',
      updateScreenSize,
    )

    return () => {
      window.removeEventListener(
        'resize',
        updateScreenSize,
      )
    }
  }, [])

  const selectedRide = useMemo(() => {
    return (
      rides.find(
        (ride) => ride.id === selectedRideId,
      ) ?? null
    )
  }, [rides, selectedRideId])

  const activeRides = useMemo(() => {
    return rides.filter((ride) =>
      [
        'MATCHED',
        'CONFIRMED',
        'IN_PROGRESS',
      ].includes(ride.status),
    )
  }, [rides])

  const completedRides = useMemo(() => {
    return rides.filter(
      (ride) => ride.status === 'COMPLETED',
    )
  }, [rides])

  const confirmedRides = useMemo(() => {
    return rides.filter(
      (ride) => ride.status === 'CONFIRMED',
    )
  }, [rides])

  const calendarEvents = useMemo<EventInput[]>(
    () =>
      rides.map((ride) => {
        const colors = calendarColors(
          ride.status,
        )

        return {
          id: ride.id,
          title: patientName(ride),
          start: ride.pickupTime,
          backgroundColor: colors.background,
          borderColor: colors.border,
          textColor: '#3f3150',
          extendedProps: {
            patientName: patientName(ride),
            clinicName:
              ride.appointment.clinicName,
            clinicCity:
              ride.appointment.clinicCity,
            appointmentType:
              ride.appointment.appointmentType,
            status: ride.status,
          },
        }
      }),
    [rides],
  )

  const headers = useMemo(() => {
    return {
      'Content-Type': 'application/json',
      ...(token.trim()
        ? {
            Authorization: `Bearer ${token.trim()}`,
          }
        : {}),
    }
  }, [token])

  const switchToDemo = () => {
    const demoDriverRides = demoRides.filter(
      (ride) => ride.driver !== null,
    )

    setMode('demo')
    setRides(demoDriverRides)
    setSelectedRideId(
      demoDriverRides[0]?.id ?? '',
    )
    setError(null)
    setMessage('Demo driver schedule loaded.')
  }

  const loadRides = async () => {
    if (mode === 'demo') {
      switchToDemo()
      return
    }

    if (!token.trim()) {
      setError('Driver JWT token required.')
      return
    }

    setLoading(true)
    setError(null)
    setMessage(null)

    try {
      const response = await fetch(
        `${apiBase}/rides/my-driver-rides`,
        {
          headers,
          cache: 'no-store',
        },
      )

      if (!response.ok) {
        throw new Error(
          `Failed to load rides (${response.status}).`,
        )
      }

      const data =
        (await response.json()) as RideRow[]

      setRides(data)
      setSelectedRideId(data[0]?.id ?? '')

      setMessage(
        data.length > 0
          ? 'Driver schedule loaded.'
          : 'No rides are currently assigned.',
      )
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'Failed to load driver rides.',
      )
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (
    rideId: string,
    status: string,
  ) => {
    if (mode === 'demo') {
      setRides((currentRides) =>
        currentRides.map((ride) =>
          ride.id === rideId
            ? {
                ...ride,
                status,
              }
            : ride,
        ),
      )

      setMessage(
        `Demo: ride updated to ${formatStatus(status)}.`,
      )

      return
    }

    if (!token.trim()) {
      setError('Driver JWT token required.')
      return
    }

    setActionLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `${apiBase}/rides/${rideId}/status`,
        {
          method: 'PATCH',
          headers,
          body: JSON.stringify({ status }),
        },
      )

      if (!response.ok) {
        throw new Error(
          `Status update failed (${response.status}).`,
        )
      }

      await loadRides()

      setMessage(
        `Ride updated to ${formatStatus(status)}.`,
      )
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : 'Failed to update ride status.',
      )
    } finally {
      setActionLoading(false)
    }
  }

  const confirmRide = async (
    rideId: string,
  ) => {
    if (mode === 'demo') {
      setRides((currentRides) =>
        currentRides.map((ride) =>
          ride.id === rideId
            ? {
                ...ride,
                status: 'CONFIRMED',
              }
            : ride,
        ),
      )

      setMessage('Demo: ride confirmed.')
      return
    }

    if (!token.trim()) {
      setError('Driver JWT token required.')
      return
    }

    setActionLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `${apiBase}/rides/${rideId}/confirm`,
        {
          method: 'PATCH',
          headers,
        },
      )

      if (!response.ok) {
        throw new Error(
          `Ride confirmation failed (${response.status}).`,
        )
      }

      await loadRides()
      setMessage('Ride confirmed.')
    } catch (confirmError) {
      setError(
        confirmError instanceof Error
          ? confirmError.message
          : 'Failed to confirm ride.',
      )
    } finally {
      setActionLoading(false)
    }
  }

  const toggleAvailability = async () => {
    const nextAvailability = !isAvailableNow

    if (mode === 'demo') {
      setIsAvailableNow(nextAvailability)

      setMessage(
        nextAvailability
          ? 'Demo: you are available for rides.'
          : 'Demo: you are unavailable for rides.',
      )

      return
    }

    if (!token.trim()) {
      setError('Driver JWT token required.')
      return
    }

    setActionLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `${apiBase}/drivers/availability`,
        {
          method: 'PATCH',
          headers,
          body: JSON.stringify({
            isAvailableNow: nextAvailability,
          }),
        },
      )

      if (!response.ok) {
        throw new Error(
          `Availability update failed (${response.status}).`,
        )
      }

      setIsAvailableNow(nextAvailability)

      setMessage(
        nextAvailability
          ? 'You are now available for rides.'
          : 'You are now unavailable for rides.',
      )
    } catch (availabilityError) {
      setError(
        availabilityError instanceof Error
          ? availabilityError.message
          : 'Failed to update availability.',
      )
    } finally {
      setActionLoading(false)
    }
  }

  const saveToken = () => {
    window.localStorage.setItem(
      'carepath.driver.token',
      token,
    )

    setError(null)
    setMessage('Driver token saved.')
  }

  const loadSavedToken = () => {
    const savedToken = window.localStorage.getItem(
      'carepath.driver.token',
    )

    if (!savedToken) {
      setError('No saved driver token was found.')
      return
    }

    setToken(savedToken)
    setError(null)
    setMessage('Driver token loaded.')
  }

  const selectRide = (rideId: string) => {
    setSelectedRideId(rideId)

    window.setTimeout(() => {
      document
        .getElementById('driver-selected-ride')
        ?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
    }, 100)
  }

  const handleCalendarClick = (
    clickInfo: EventClickArg,
  ) => {
    selectRide(clickInfo.event.id)
  }

  return (
    <DashboardLayout
      role="driver"
      title="Driver Dashboard"
      subtitle="Manage today’s schedule, rides, and availability"
      userName="Driver"
    >
      <div className="cp-space-y-4">
        <section
          style={{
            padding: 20,
            borderRadius: 16,
            background:
              'linear-gradient(135deg, #71769c 0%, #e6caef 50%, #694f81 100%)',
            color: '#ffffff',
          }}
        >
          <p
            style={{
              marginBottom: 6,
              color: '#f8effb',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
            }}
          >
            Driver schedule
          </p>

          <h2
            style={{
              margin: 0,
              color: '#ffffff',
              fontSize: 20,
              fontWeight: 800,
              lineHeight: 1.4,
            }}
          >
            View assigned pickups and keep each
            medical ride moving safely.
          </h2>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 12,
              marginTop: 16,
            }}
          >
            <Badge
              variant={
                mode === 'live'
                  ? 'success'
                  : 'warning'
              }
            >
              {mode === 'live' ? 'Live' : 'Demo'}
            </Badge>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 9,
                padding: '8px 11px',
                borderRadius: 10,
                background:
                  'rgba(255, 255, 255, 0.18)',
              }}
            >
              <span
                style={{
                  color: '#ffffff',
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                {isAvailableNow
                  ? 'Available'
                  : 'Unavailable'}
              </span>

              <button
                type="button"
                onClick={toggleAvailability}
                disabled={actionLoading}
                aria-label="Toggle driver availability"
                style={{
                  padding: 0,
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                }}
              >
                {isAvailableNow ? (
                  <ToggleRight
                    size={35}
                    color="#d8fff5"
                  />
                ) : (
                  <ToggleLeft
                    size={35}
                    color="#ffffff"
                  />
                )}
              </button>
            </div>
          </div>
        </section>

        <Card>
          <div className="cp-space-y-3">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 8,
              }}
            >
              <Badge
                variant={
                  mode === 'live'
                    ? 'success'
                    : 'warning'
                }
              >
                {mode === 'live'
                  ? 'Live'
                  : 'Demo'}
              </Badge>

              <Button
                size="sm"
                variant="secondary"
                onClick={switchToDemo}
              >
                Demo
              </Button>

              <Button
                size="sm"
                style={{
                  background: '#b72898',
                }}
                onClick={() => {
                  setMode('live')
                  setMessage(
                    'Live mode selected. Press Refresh to load rides.',
                  )
                }}
              >
                Live
              </Button>
            </div>

            <input
              value={apiBase}
              onChange={(event) =>
                setApiBase(event.target.value)
              }
              placeholder="API base URL"
              className="cp-input"
            />

            <input
              value={token}
              onChange={(event) =>
                setToken(event.target.value)
              }
              placeholder="Driver JWT token"
              className="cp-input"
            />

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 8,
              }}
            >
              <Button
                size="sm"
                variant="secondary"
                onClick={loadSavedToken}
              >
                Load token
              </Button>

              <Button
                size="sm"
                style={{
                  background: '#b72898',
                }}
                onClick={saveToken}
              >
                Save token
              </Button>

              <Button
                size="sm"
                variant="secondary"
                onClick={loadRides}
                disabled={loading}
              >
                {loading
                  ? 'Loading…'
                  : 'Refresh'}
              </Button>
            </div>
          </div>
        </Card>

        {message && (
          <div className="cp-alert cp-alert-success">
            <CheckCircle2 size={16} />
            {message}
          </div>
        )}

        {error && (
          <div className="cp-alert cp-alert-error">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <div className="cp-grid-3">
          <StatCard
            label="Active rides"
            value={activeRides.length}
            icon={Car}
            color="blue"
          />

          <StatCard
            label="Confirmed"
            value={confirmedRides.length}
            icon={CheckCircle2}
            color="teal"
          />

          <StatCard
            label="Completed"
            value={completedRides.length}
            icon={Route}
            color="purple"
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              Driver Calendar
            </CardTitle>
          </CardHeader>

          <p
            style={{
              marginBottom: 16,
              color: '#64748b',
              fontSize: 13,
              lineHeight: 1.6,
            }}
          >
            Select a scheduled pickup to see the
            patient, destination, and ride controls.
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 14,
              marginBottom: 18,
              color: '#64748b',
              fontSize: 12,
            }}
          >
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
              }}
            >
              <span
                style={{
                  width: 11,
                  height: 11,
                  border: '1px solid #9b72ad',
                  borderRadius: 3,
                  background: '#e6caef',
                }}
              />
              Matched
            </span>

            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
              }}
            >
              <span
                style={{
                  width: 11,
                  height: 11,
                  border: '1px solid #6f9fc9',
                  borderRadius: 3,
                  background: '#c8def4',
                }}
              />
              Confirmed
            </span>

            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
              }}
            >
              <span
                style={{
                  width: 11,
                  height: 11,
                  border: '1px solid #c58d4a',
                  borderRadius: 3,
                  background: '#f7dfc2',
                }}
              />
              In progress
            </span>

            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
              }}
            >
              <span
                style={{
                  width: 11,
                  height: 11,
                  border: '1px solid #6ca88d',
                  borderRadius: 3,
                  background: '#cfe9dd',
                }}
              />
              Completed
            </span>
          </div>

          <div className="carepath-calendar driver-calendar">
            <FullCalendar
              plugins={[
                dayGridPlugin,
                timeGridPlugin,
                listPlugin,
              ]}
              initialView={
                isSmallScreen
                  ? 'listMonth'
                  : 'dayGridMonth'
              }
              headerToolbar={
                isSmallScreen
                  ? {
                      left: 'prev,next',
                      center: 'title',
                      right: 'today',
                    }
                  : {
                      left: 'prev,next today',
                      center: 'title',
                      right:
                        'dayGridMonth,timeGridWeek,listMonth',
                    }
              }
              footerToolbar={
                isSmallScreen
                  ? {
                      left: '',
                      center:
                        'dayGridMonth,timeGridWeek,listMonth',
                      right: '',
                    }
                  : false
              }
              buttonText={{
                today: 'Today',
                month: 'Month',
                week: 'Week',
                list: 'List',
              }}
              events={calendarEvents}
              eventContent={DriverCalendarEvent}
              eventClick={handleCalendarClick}
              height="auto"
              contentHeight="auto"
              dayMaxEvents={3}
              nowIndicator
              eventDisplay="block"
              eventTimeFormat={{
                hour: 'numeric',
                minute: '2-digit',
                meridiem: 'short',
              }}
              slotMinTime="05:00:00"
              slotMaxTime="22:00:00"
              allDayText="Rides"
              noEventsContent="No assigned rides."
            />
          </div>
        </Card>

        {selectedRide && (
          <div id="driver-selected-ride">
            <Card>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent:
                    'space-between',
                  flexWrap: 'wrap',
                  gap: 14,
                }}
              >
                <div>
                  <p
                    style={{
                      marginBottom: 5,
                      color: '#8b6da0',
                      fontSize: 11,
                      fontWeight: 800,
                      letterSpacing: '0.12em',
                      textTransform:
                        'uppercase',
                    }}
                  >
                    Selected ride
                  </p>

                  <h3
                    style={{
                      margin: 0,
                      color: '#46345d',
                      fontSize: 22,
                      fontWeight: 800,
                    }}
                  >
                    {patientName(selectedRide)}
                  </h3>

                  <p
                    style={{
                      marginTop: 5,
                      color: '#64748b',
                      fontSize: 14,
                    }}
                  >
                    {
                      selectedRide.appointment
                        .appointmentType
                    }
                  </p>
                </div>

                <Badge
                  variant={statusVariant(
                    selectedRide.status,
                  )}
                >
                  {formatStatus(
                    selectedRide.status,
                  )}
                </Badge>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: 14,
                  marginTop: 22,
                }}
              >
                <div className="carepath-detail-row">
                  <Clock3 size={19} />

                  <div>
                    <strong>
                      Pickup time
                    </strong>

                    <span>
                      {toDisplayDate(
                        selectedRide.pickupTime,
                      )}
                    </span>
                  </div>
                </div>

                <div className="carepath-detail-row">
                  <MapPin size={19} />

                  <div>
                    <strong>
                      Pickup address
                    </strong>

                    <span>
                      {selectedRide.pickupAddress ||
                        'Pickup address not provided'}
                    </span>
                  </div>
                </div>

                <div className="carepath-detail-row">
                  <Navigation size={19} />

                  <div>
                    <strong>
                      Destination
                    </strong>

                    <span>
                      {
                        selectedRide.appointment
                          .clinicName
                      }
                      {' · '}
                      {
                        selectedRide.appointment
                          .clinicCity
                      }
                      ,{' '}
                      {
                        selectedRide.appointment
                          .clinicState
                      }
                    </span>
                  </div>
                </div>

                <div className="carepath-detail-row">
                  <UserRound size={19} />

                  <div>
                    <strong>
                      Patient contact
                    </strong>

                    <span>
                      {selectedRide.patient
                        ? `${patientName(selectedRide)} · ${selectedRide.patient.user.phone}`
                        : 'Patient information unavailable'}
                    </span>
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 10,
                  marginTop: 20,
                }}
              >
                {selectedRide.status ===
                  'MATCHED' && (
                  <Button
                    size="sm"
                    style={{
                      background: '#b72898',
                    }}
                    onClick={() =>
                      confirmRide(selectedRide.id)
                    }
                    disabled={actionLoading}
                  >
                    Confirm ride
                  </Button>
                )}

                {selectedRide.status ===
                  'CONFIRMED' && (
                  <Button
                    size="sm"
                    style={{
                      background: '#b72898',
                    }}
                    onClick={() =>
                      updateStatus(
                        selectedRide.id,
                        'IN_PROGRESS',
                      )
                    }
                    disabled={actionLoading}
                  >
                    Start ride
                  </Button>
                )}

                {selectedRide.status ===
                  'IN_PROGRESS' && (
                  <Button
                    size="sm"
                    style={{
                      background: '#527a73',
                    }}
                    onClick={() =>
                      updateStatus(
                        selectedRide.id,
                        'COMPLETED',
                      )
                    }
                    disabled={actionLoading}
                  >
                    Complete ride
                  </Button>
                )}

                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() =>
                    setSelectedRideId('')
                  }
                >
                  Clear selection
                </Button>
              </div>
            </Card>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>
              Assigned rides
            </CardTitle>
          </CardHeader>

          <div className="cp-space-y-3">
            {rides.length === 0 && (
              <p
                style={{
                  padding: '12px 0',
                  color: '#64748b',
                  fontSize: 14,
                }}
              >
                No rides assigned.
              </p>
            )}

            {rides.map((ride) => {
              const isSelected =
                ride.id === selectedRideId

              return (
                <button
                  key={ride.id}
                  type="button"
                  className={`cp-ride-item${
                    isSelected
                      ? ' selected'
                      : ''
                  }`}
                  onClick={() =>
                    selectRide(ride.id)
                  }
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent:
                        'space-between',
                      flexWrap: 'wrap',
                      gap: 8,
                    }}
                  >
                    <p
                      style={{
                        color: '#0f172a',
                        fontSize: 15,
                        fontWeight: 700,
                      }}
                    >
                      {patientName(ride)}
                    </p>

                    <Badge
                      variant={statusVariant(
                        ride.status,
                      )}
                    >
                      {formatStatus(
                        ride.status,
                      )}
                    </Badge>
                  </div>

                  <p
                    style={{
                      marginTop: 5,
                      color: '#64748b',
                      fontSize: 13,
                    }}
                  >
                    {
                      ride.appointment
                        .clinicName
                    }
                    {' · '}
                    {
                      ride.appointment
                        .clinicCity
                    }
                    ,{' '}
                    {
                      ride.appointment
                        .clinicState
                    }
                  </p>

                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 6,
                      marginTop: 9,
                    }}
                  >
                    <Badge variant="neutral">
                      <Clock3
                        size={11}
                        style={{
                          marginRight: 3,
                        }}
                      />
                      Pickup:{' '}
                      {toDisplayDate(
                        ride.pickupTime,
                      )}
                    </Badge>
                  </div>
                </button>
              )
            })}
          </div>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 10,
              marginTop: 18,
            }}
          >
            <Link href="/driver/rides">
              <Button
                size="sm"
                style={{
                  background: '#b72898',
                }}
              >
                Open My Rides
              </Button>
            </Link>

            <Link href="/driver/navigation">
              <Button
                size="sm"
                variant="secondary"
              >
                Open navigation
              </Button>
            </Link>

            <Link href="/driver/profile">
              <Button
                size="sm"
                variant="secondary"
              >
                Driver profile
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}