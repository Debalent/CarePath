'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'

import {
  AlertCircle,
  AlertTriangle,
  CalendarDays,
  Car,
  CheckCircle2,
  Clock3,
  MapPin,
  Route,
  ShieldCheck,
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
  demoPendingRides,
  PendingRide,
} from '@/lib/pooling'

type DataMode = 'demo' | 'live'

const DEFAULT_API_BASE =
  process.env.NEXT_PUBLIC_CAREPATH_API_URL ??
  'http://localhost:3001/api'

function fullName(ride: PendingRide): string {
  return `${ride.patient.user.firstName} ${ride.patient.user.lastName}`
}

function toDisplayDate(value: string): string {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return date.toLocaleString([], {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function statusLabel(status: string): string {
  return status
    .toLowerCase()
    .split('_')
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join(' ')
}

function statusBadgeVariant(
  status: string,
): 'error' | 'warning' | 'info' | 'success' | 'neutral' {
  switch (status) {
    case 'FALLBACK_NEEDED':
      return 'error'

    case 'PENDING':
      return 'warning'

    case 'MATCHED':
      return 'info'

    case 'CONFIRMED':
    case 'COMPLETED':
      return 'success'

    default:
      return 'neutral'
  }
}

function calendarColors(status: string) {
  switch (status) {
    case 'FALLBACK_NEEDED':
      return {
        background: '#f4ccd9',
        border: '#bd7189',
      }

    case 'MATCHED':
      return {
        background: '#c8def4',
        border: '#6f9fc9',
      }

    case 'CONFIRMED':
      return {
        background: '#cfe9dd',
        border: '#6ca88d',
      }

    case 'IN_PROGRESS':
      return {
        background: '#f7dfc2',
        border: '#c58d4a',
      }

    case 'COMPLETED':
      return {
        background: '#b9ddd5',
        border: '#5b9688',
      }

    case 'PENDING':
    default:
      return {
        background: '#e6caef',
        border: '#9b72ad',
      }
  }
}

function CoordinatorCalendarEvent(
  eventInfo: EventContentArg,
) {
  const patientName =
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
          {patientName}
        </span>
      </div>
    </div>
  )
}

export default function CoordinatorDispatchPage() {
  const [mode, setMode] =
    useState<DataMode>('demo')

  const [apiBaseUrl, setApiBaseUrl] =
    useState(DEFAULT_API_BASE)

  const [token, setToken] = useState('')

  const [rides, setRides] =
    useState<PendingRide[]>(demoPendingRides)

  const [selectedRideId, setSelectedRideId] =
    useState(demoPendingRides[0]?.id ?? '')

  const [isLoading, setIsLoading] =
    useState(false)

  const [isSmallScreen, setIsSmallScreen] =
    useState(false)

  const [message, setMessage] =
    useState<string | null>(null)

  const [error, setError] =
    useState<string | null>(null)

  useEffect(() => {
    const savedToken = window.localStorage.getItem(
      'carepath.coordinator.token',
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

  const fallbackCount = useMemo(() => {
    return rides.filter(
      (ride) =>
        ride.status === 'FALLBACK_NEEDED',
    ).length
  }, [rides])

  const matchedCount = useMemo(() => {
    return rides.filter((ride) =>
      ['MATCHED', 'CONFIRMED'].includes(
        ride.status,
      ),
    ).length
  }, [rides])

  const calendarEvents = useMemo<EventInput[]>(
    () =>
      rides.map((ride) => {
        const colors = calendarColors(
          ride.status,
        )

        return {
          id: ride.id,
          title: fullName(ride),
          start: ride.pickupTime,
          backgroundColor: colors.background,
          borderColor: colors.border,
          textColor: '#3f3150',
          extendedProps: {
            patientName: fullName(ride),
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

  const switchToDemo = () => {
    setMode('demo')
    setRides(demoPendingRides)
    setSelectedRideId(
      demoPendingRides[0]?.id ?? '',
    )
    setError(null)
    setMessage('Demo dispatch data loaded.')
  }

  const loadLiveRides = async () => {
    if (!token.trim()) {
      setError(
        'A coordinator JWT token is required for live mode.',
      )
      return
    }

    setMode('live')
    setIsLoading(true)
    setError(null)
    setMessage(null)

    try {
      const response = await fetch(
        `${apiBaseUrl}/rides/pending`,
        {
          headers: {
            'Content-Type':
              'application/json',
            Authorization: `Bearer ${token.trim()}`,
          },
          cache: 'no-store',
        },
      )

      if (!response.ok) {
        throw new Error(
          `Unable to load rides (${response.status}).`,
        )
      }

      const data =
        (await response.json()) as PendingRide[]

      setRides(data)
      setSelectedRideId(data[0]?.id ?? '')

      setMessage(
        data.length > 0
          ? 'Live dispatch data loaded.'
          : 'No pending rides are currently available.',
      )
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'Unable to load live dispatch data.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  const saveToken = () => {
    window.localStorage.setItem(
      'carepath.coordinator.token',
      token,
    )

    setError(null)
    setMessage('Coordinator token saved.')
  }

  const selectRide = (rideId: string) => {
    setSelectedRideId(rideId)

    window.setTimeout(() => {
      document
        .getElementById(
          'dispatch-selected-ride',
        )
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
      role="coordinator"
      title="Dispatch"
      subtitle="Coordinate ride requests and driver assignments"
      userName="Coordinator"
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
            Coordinator scheduling center
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
            Review pickup demand and identify
            rides that still need attention.
          </h2>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent:
                'space-between',
              flexWrap: 'wrap',
              gap: 10,
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
              {mode === 'live'
                ? 'Live API'
                : 'Demo'}
            </Badge>

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
                onClick={switchToDemo}
              >
                Demo
              </Button>

              <Button
                size="sm"
                style={{
                  background: '#b72898',
                }}
                onClick={loadLiveRides}
                disabled={isLoading}
              >
                {isLoading
                  ? 'Loading…'
                  : 'Live'}
              </Button>
            </div>
          </div>
        </section>

        <Card>
          <CardHeader>
            <CardTitle>
              Live coordinator setup
            </CardTitle>
          </CardHeader>

          <div className="cp-space-y-3">
            <input
              value={apiBaseUrl}
              onChange={(event) =>
                setApiBaseUrl(
                  event.target.value,
                )
              }
              placeholder="http://localhost:3001/api"
              className="cp-input"
            />

            <input
              value={token}
              onChange={(event) =>
                setToken(event.target.value)
              }
              placeholder="Coordinator JWT token"
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
                onClick={loadLiveRides}
                disabled={isLoading}
              >
                {isLoading
                  ? 'Loading…'
                  : 'Refresh live data'}
              </Button>
            </div>
          </div>

          <p
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              marginTop: 10,
              color: '#94a3b8',
              fontSize: 12,
            }}
          >
            <ShieldCheck size={13} />
            Stored locally in your browser
            only.
          </p>
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
            label="Pending rides"
            value={rides.length}
            icon={CalendarDays}
            color="amber"
          />

          <StatCard
            label="Matched rides"
            value={matchedCount}
            icon={Car}
            color="teal"
          />

          <StatCard
            label="Need fallback"
            value={fallbackCount}
            icon={AlertTriangle}
            color="blue"
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              Dispatch calendar
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
            Each calendar event represents a
            requested pickup. Select one to see
            the ride details.
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
              Pending
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
                  border: '1px solid #bd7189',
                  borderRadius: 3,
                  background: '#f4ccd9',
                }}
              />
              Fallback needed
            </span>
          </div>

          <div className="carepath-calendar">
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
              eventContent={
                CoordinatorCalendarEvent
              }
              eventClick={
                handleCalendarClick
              }
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
              noEventsContent="No rides scheduled."
            />
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              Ride queue
            </CardTitle>
          </CardHeader>

          <div className="cp-space-y-3">
            {rides.length === 0 && (
              <p
                style={{
                  padding: '14px 0',
                  color: '#64748b',
                  fontSize: 14,
                }}
              >
                No pending rides are currently
                available.
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
                      {fullName(ride)}
                    </p>

                    <Badge
                      variant={statusBadgeVariant(
                        ride.status,
                      )}
                    >
                      {statusLabel(ride.status)}
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
                    ,{' '}
                    {
                      ride.appointment
                        .clinicCity
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
                      {toDisplayDate(
                        ride.pickupTime,
                      )}
                    </Badge>
                  </div>
                </button>
              )
            })}
          </div>
        </Card>

        {selectedRide && (
          <div id="dispatch-selected-ride">
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
                    {fullName(selectedRide)}
                  </h3>
                </div>

                <Badge
                  variant={statusBadgeVariant(
                    selectedRide.status,
                  )}
                >
                  {statusLabel(
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
                      Destination
                    </strong>

                    <span>
                      {
                        selectedRide
                          .appointment
                          .clinicName
                      }
                      {' · '}
                      {
                        selectedRide
                          .appointment
                          .clinicCity
                      }
                    </span>
                  </div>
                </div>

                <div className="carepath-detail-row">
                  <UserRound size={19} />

                  <div>
                    <strong>Patient</strong>

                    <span>
                      {fullName(
                        selectedRide,
                      )}
                    </span>
                  </div>
                </div>

                <div className="carepath-detail-row">
                  <Route size={19} />

                  <div>
                    <strong>
                      Appointment
                    </strong>

                    <span>
                      {
                        selectedRide
                          .appointment
                          .appointmentType
                      }
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
                <Link href="/coordinator/pooling">
                  <Button
                    size="sm"
                    style={{
                      background: '#b72898',
                    }}
                  >
                    Open pooling options
                  </Button>
                </Link>

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
      </div>
    </DashboardLayout>
  )
}