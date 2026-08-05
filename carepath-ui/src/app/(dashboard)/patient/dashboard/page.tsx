'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'

import {
  Calendar,
  CalendarDays,
  Car,
  Clock3,
  ClipboardList,
  MapPin,
  MessageSquare,
  User,
} from 'lucide-react'

import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Badge } from '@/components/ui/Badge'
import {
  demoRides,
  statusVariant,
  toDisplayDate,
} from '@/lib/portal'

export default function PatientDashboardPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const nextRide = useMemo(() => {
    const upcomingStatuses = [
      'PENDING',
      'MATCHED',
      'CONFIRMED',
      'IN_PROGRESS',
    ]

    return [...demoRides]
      .filter((ride) =>
        upcomingStatuses.includes(ride.status),
      )
      .sort(
        (firstRide, secondRide) =>
          new Date(
            firstRide.appointment.appointmentDate,
          ).getTime() -
          new Date(
            secondRide.appointment.appointmentDate,
          ).getTime(),
      )[0]
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <DashboardLayout
      role="patient"
      title="Home"
      subtitle="Manage rides, appointments, messages, and profile information"
      userName="Patient"
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        {/* Welcome banner */}
        <section
          style={{
            padding: '30px',
            borderRadius: '16px',
            background:
              'linear-gradient(135deg, #a10e97 0%, #36717d 100%)',
            boxShadow:
              '0 10px 24px rgba(9, 79, 145, 0.18)',
          }}
        >
          <p
            style={{
              margin: 0,
              marginBottom: '8px',
              color: '#c8f7ee',
              fontSize: '12px',
              fontWeight: 800,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
            }}
          >
            Welcome to CarePath
          </p>

          <h2
            style={{
              margin: 0,
              color: '#ffffff',
              fontSize: '26px',
              fontWeight: 800,
              lineHeight: 1.35,
            }}
          >
            What would you like to do today?
          </h2>

          <p
            style={{
              maxWidth: '700px',
              marginTop: '10px',
              marginBottom: 0,
              color: '#e0f2fe',
              fontSize: '15px',
              lineHeight: 1.6,
            }}
          >
            Request transportation, review upcoming rides,
            check messages, or update your patient profile.
          </p>
        </section>

        {/* Upcoming schedule preview */}
        <section
          style={{
            padding: '26px',
            border: '1px solid #ddd2e6',
            borderRadius: '16px',
            background:
              'linear-gradient(135deg, #faf7fc 0%, #f1e7f5 100%)',
            boxShadow:
              '0 7px 20px rgba(77, 54, 93, 0.08)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '13px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '46px',
                  height: '46px',
                  flexShrink: 0,
                  borderRadius: '11px',
                  backgroundColor: '#e6caef',
                  color: '#694f81',
                }}
              >
                <CalendarDays size={24} />
              </div>

              <div>
                <p
                  style={{
                    margin: 0,
                    marginBottom: '4px',
                    color: '#8b6da0',
                    fontSize: '11px',
                    fontWeight: 800,
                    letterSpacing: '0.13em',
                    textTransform: 'uppercase',
                  }}
                >
                  Upcoming schedule
                </p>

                <h2
                  style={{
                    margin: 0,
                    color: '#46345d',
                    fontSize: '21px',
                    fontWeight: 800,
                  }}
                >
                  Your next appointment
                </h2>
              </div>
            </div>

            <Link
              href="/patient/tracking"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '42px',
                padding: '0 18px',
                borderRadius: '9px',
                backgroundColor: '#ffffff',
                color: '#694f81',
                fontSize: '13px',
                fontWeight: 800,
                textDecoration: 'none',
                boxShadow: '0 4px 12px rgba(105, 79, 129, 0.16)',
              }}
            >
              View Tracking
            </Link>

            <Link
              href="/patient/appointments"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '42px',
                padding: '0 18px',
                borderRadius: '9px',
                backgroundColor: '#694f81',
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: 800,
                textDecoration: 'none',
                boxShadow:
                  '0 4px 12px rgba(105, 79, 129, 0.22)',
              }}
            >
              View Calendar
            </Link>
          </div>

          {nextRide ? (
            <>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    'repeat(auto-fit, minmax(210px, 1fr))',
                  gap: '14px',
                  marginTop: '22px',
                }}
              >
                <div style={scheduleDetailStyle}>
                  <Calendar size={19} />

                  <div>
                    <strong style={detailTitleStyle}>
                      Appointment
                    </strong>

                    <span style={detailTextStyle}>
                      {nextRide.appointment.appointmentType}
                    </span>

                    <span style={detailSecondaryStyle}>
                      {toDisplayDate(
                        nextRide.appointment.appointmentDate,
                      )}
                    </span>
                  </div>
                </div>

                <div style={scheduleDetailStyle}>
                  <Clock3 size={19} />

                  <div>
                    <strong style={detailTitleStyle}>
                      Pickup
                    </strong>

                    <span style={detailTextStyle}>
                      {toDisplayDate(nextRide.pickupTime)}
                    </span>

                    <span style={detailSecondaryStyle}>
                      Transportation pickup time
                    </span>
                  </div>
                </div>

                <div style={scheduleDetailStyle}>
                  <MapPin size={19} />

                  <div>
                    <strong style={detailTitleStyle}>
                      Clinic
                    </strong>

                    <span style={detailTextStyle}>
                      {nextRide.appointment.clinicName}
                    </span>

                    <span style={detailSecondaryStyle}>
                      {nextRide.appointment.clinicCity},{' '}
                      {nextRide.appointment.clinicState}
                    </span>
                  </div>
                </div>

                <div style={scheduleDetailStyle}>
                  <Car size={19} />

                  <div>
                    <strong style={detailTitleStyle}>
                      Ride status
                    </strong>

                    <div style={{ marginTop: '4px' }}>
                      <Badge
                        variant={statusVariant(nextRide.status)}
                      >
                        {nextRide.status
                          .toLowerCase()
                          .split('_')
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() +
                              word.slice(1),
                          )
                          .join(' ')}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '10px',
                  marginTop: '20px',
                }}
              >
                <Link
                  href="/patient/appointments"
                  style={primaryLinkStyle}
                >
                  View Full Calendar
                </Link>

                <Link
                  href="/patient/rides"
                  style={secondaryLinkStyle}
                >
                  View My Rides
                </Link>
              </div>
            </>
          ) : (
            <div
              style={{
                padding: '24px 8px 6px',
                textAlign: 'center',
              }}
            >
              <CalendarDays
                size={34}
                style={{
                  margin: '0 auto 10px',
                  color: '#8b6da0',
                }}
              />

              <p
                style={{
                  margin: 0,
                  color: '#334155',
                  fontSize: '15px',
                  fontWeight: 800,
                }}
              >
                No upcoming appointments
              </p>

              <p
                style={{
                  marginTop: '5px',
                  marginBottom: '16px',
                  color: '#858b64',
                  fontSize: '13px',
                }}
              >
                New appointments and transportation details
                will appear here.
              </p>

              <Link
                href="/patient/request-ride"
                style={primaryLinkStyle}
              >
                Request a Ride
              </Link>
            </div>
          )}
        </section>

        {/* Main action cards */}
        <section
          style={{
            display: 'grid',
            gap: '20px',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(230px, 1fr))',
          }}
        >
         <Link href="/patient/request-ride" style={cardStyle}>
  <div
    style={{
      ...iconWrapperStyle,
      backgroundColor: '#fff3c7',
      color: '#d99b00',
    }}
  >
    <Car size={26} />
  </div>

  <h2 style={cardTitleStyle}>Request a Ride</h2>

  <p style={cardTextStyle}>
    Schedule transportation for an upcoming medical appointment.
  </p>
</Link>

          <Link href="/patient/rides" style={cardStyle}>
            <div
              style={{
                ...iconWrapperStyle,
                backgroundColor: '#e8f0ff',
                color: '#4a73c9',
              }}
            >
              <Calendar size={26} />
            </div>

            <h2 style={cardTitleStyle}>My Rides</h2>

            <p style={cardTextStyle}>
              Review upcoming, completed, and previous
              ride requests.
            </p>
          </Link>

          <Link
            href="/patient/messages"
            style={cardStyle}
          >
            <div
              style={{
                ...iconWrapperStyle,
                backgroundColor: '#ffe6e2',
                color: '#d96b55',
              }}
            >
              <MessageSquare size={26} />
            </div>

            <h2 style={cardTitleStyle}>Messages</h2>

            <p style={cardTextStyle}>
              View updates from coordinators and
              transportation providers.
            </p>
          </Link>

          <Link href="/patient/profile" style={cardStyle}>
            <div
              style={{
                ...iconWrapperStyle,
                backgroundColor: '#efe7ff',
                color: '#7b57c9',
              }}
            >
              <User size={26} />
            </div>

            <h2 style={cardTitleStyle}>My Profile</h2>

            <p style={cardTextStyle}>
              Update contact, accessibility, insurance,
              and ride preferences.
            </p>
          </Link>
        </section>

        {/* Intake reminder */}
        <section
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '18px',
            padding: '24px 28px',
            border: '1px solid #ded5eb',
            borderRadius: '14px',
            background:
              'linear-gradient(135deg, #e6d0b4 0%, #c394c8 100%)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '14px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '42px',
                height: '42px',
                flexShrink: 0,
                borderRadius: '10px',
                backgroundColor: '#f5eae3',
                color: '#703c91',
              }}
            >
              <ClipboardList size={22} />
            </div>

            <div>
              <h2
                style={{
                  margin: 0,
                  marginBottom: '6px',
                  color: '#052b56',
                  fontSize: '18px',
                  fontWeight: 800,
                }}
              >
                Patient Intake Profile
              </h2>

              <p
                style={{
                  margin: 0,
                  color: '#6d8b64',
                  fontSize: '14px',
                  lineHeight: 1.5,
                }}
              >
                Complete or update your detailed
                transportation and care information.
              </p>
            </div>
          </div>

          <Link
            href="/patient/intake"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '46px',
              padding: '0 22px',
              borderRadius: '10px',
              backgroundColor: '#703c91',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: 800,
              textDecoration: 'none',
              boxShadow:
                '0 5px 14px rgba(112, 60, 145, 0.22)',
            }}
          >
            Open Intake Form
          </Link>
        </section>
      </div>
    </DashboardLayout>
  )
}

const cardStyle = {
  display: 'block',
  minHeight: '210px',
  padding: '26px',
  border: '1px solid #dbe7ee',
  borderRadius: '14px',
  backgroundColor: '#ffffff',
  color: '#136e5e',
  textDecoration: 'none',
  boxShadow: '0 6px 18px rgba(5, 43, 86, 0.06)',
  transition:
    'transform 0.15s ease, box-shadow 0.15s ease',
}

const iconWrapperStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '48px',
  height: '48px',
  borderRadius: '12px',
  backgroundColor: '#e5f5f2',
  color: '#137d6b',
}

const cardTitleStyle = {
  marginTop: '18px',
  marginBottom: '8px',
  color: '#052b56',
  fontSize: '19px',
  fontWeight: 800,
}

const cardTextStyle = {
  margin: 0,
  color: '#64748b',
  fontSize: '14px',
  lineHeight: 1.55,
}

const scheduleDetailStyle = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '11px',
  padding: '15px',
  border: '1px solid #e5dce9',
  borderRadius: '11px',
  backgroundColor: 'rgba(255, 255, 255, 0.72)',
  color: '#694f81',
}

const detailTitleStyle = {
  display: 'block',
  color: '#334155',
  fontSize: '13px',
  fontWeight: 800,
}

const detailTextStyle = {
  display: 'block',
  marginTop: '3px',
  color: '#475569',
  fontSize: '13px',
  fontWeight: 600,
  lineHeight: 1.45,
}

const detailSecondaryStyle = {
  display: 'block',
  marginTop: '2px',
  color: '#7c8798',
  fontSize: '12px',
  lineHeight: 1.45,
}

const primaryLinkStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '42px',
  padding: '0 18px',
  borderRadius: '9px',
  backgroundColor: '#694f81',
  color: '#ffffff',
  fontSize: '13px',
  fontWeight: 800,
  textDecoration: 'none',
}

const secondaryLinkStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '42px',
  padding: '0 18px',
  border: '1px solid #bca9c7',
  borderRadius: '9px',
  backgroundColor: '#ffffff',
  color: '#694f81',
  fontSize: '13px',
  fontWeight: 800,
  textDecoration: 'none',
}