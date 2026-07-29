'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Car,
  CheckCircle2,
  Clock,
  DollarSign,
  MapPin,
  ShieldCheck,
  ToggleLeft,
  ToggleRight,
  Route,
  Calendar,
  Users,
  BarChart3,
  TrendingUp,
} from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { StatCard } from '@/components/ui/StatCard'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { useAuth } from '@/lib/auth'
import { getApi } from '@/lib/api'

// ── Types ──────────────────────────────────────────────────────────────────

type DriverProfile = {
  id: string
  userId: string
  county: string
  state: string
  vehicleCapacity: number
  isAvailableNow: boolean
  isInFallbackPool: boolean
  isWheelchairAccessible: boolean
  maxMilesOneWay: number
  reliabilityScore: number
  ridesCompleted: number
  providerType: string
  preferredDays: string | null
  communityNotes: string | null
  user: {
    firstName: string
    lastName: string
    email: string
    phone: string
  }
}

type DashboardRide = {
  id: string
  status: string
  pickupTime: string
  pickupAddress: string
  urgencyLevel: string
  appointment: {
    appointmentType: string
    clinicName: string
    clinicCity: string
    clinicState: string
    estimatedMiles: number
    appointmentDate: string
  }
  patient?: {
    user: { firstName: string; lastName: string; phone: string }
    county: string
    state: string
  }
}

// ── Demo data ──────────────────────────────────────────────────────────────

const DEMO_PROFILE: DriverProfile = {
  id: 'demo-driver-1',
  userId: 'demo-user-1',
  county: 'Pulaski',
  state: 'AR',
  vehicleCapacity: 3,
  isAvailableNow: true,
  isInFallbackPool: true,
  isWheelchairAccessible: false,
  maxMilesOneWay: 60,
  reliabilityScore: 4.8,
  ridesCompleted: 46,
  providerType: 'VOLUNTEER_DRIVER',
  preferredDays: 'Mon,Tue,Wed,Thu,Fri',
  communityNotes: 'Church volunteer and wheelchair route support.',
  user: {
    firstName: 'Samuel',
    lastName: 'R',
    email: 'samuel@example.com',
    phone: '501-555-0133',
  },
}

const DEMO_UPCOMING: DashboardRide[] = [
  {
    id: 'demo-ride-1',
    status: 'CONFIRMED',
    pickupTime: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
    pickupAddress: '412 Oak St, Newport, AR 72112',
    urgencyLevel: 'HIGH',
    appointment: {
      appointmentType: 'DIALYSIS',
      clinicName: 'Baptist Health Dialysis',
      clinicCity: 'Little Rock',
      clinicState: 'AR',
      estimatedMiles: 47,
      appointmentDate: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
    },
    patient: {
      user: { firstName: 'Churchie', lastName: 'B', phone: '501-555-0182' },
      county: 'Pulaski',
      state: 'AR',
    },
  },
  {
    id: 'demo-ride-2',
    status: 'MATCHED',
    pickupTime: new Date(Date.now() + 26 * 60 * 60 * 1000).toISOString(),
    pickupAddress: '88 Maple Ave, Springdale, AR 72764',
    urgencyLevel: 'NORMAL',
    appointment: {
      appointmentType: 'CARDIOLOGY',
      clinicName: 'Arkansas Heart Hospital',
      clinicCity: 'Little Rock',
      clinicState: 'AR',
      estimatedMiles: 35,
      appointmentDate: new Date(Date.now() + 27 * 60 * 60 * 1000).toISOString(),
    },
    patient: {
      user: { firstName: 'Alyssa', lastName: 'M', phone: '479-555-0144' },
      county: 'Washington',
      state: 'AR',
    },
  },
]

const DEMO_RECENT = [
  { id: 'hist-1', patient: 'Kevin D', clinic: 'VA Medical Center', miles: 22, date: 'Yesterday', status: 'COMPLETED' },
  { id: 'hist-2', patient: 'Michelle W', clinic: 'Baptist Health', miles: 18, date: '2 days ago', status: 'COMPLETED' },
  { id: 'hist-3', patient: 'Elijah R', clinic: 'AR Heart Hospital', miles: 31, date: '3 days ago', status: 'COMPLETED' },
]

function toDisplayDate(iso: string): string {
  const d = new Date(iso)
  if (isNaN(d.getTime())) return iso
  return d.toLocaleString([], { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
}

function statusVariant(s: string): 'success' | 'warning' | 'error' | 'info' | 'neutral' {
  if (s === 'COMPLETED') return 'success'
  if (s === 'CONFIRMED' || s === 'MATCHED') return 'info'
  if (s === 'PENDING') return 'warning'
  if (s === 'CANCELLED') return 'neutral'
  if (s === 'FALLBACK_NEEDED' || s === 'IN_PROGRESS') return 'error'
  return 'neutral'
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function DriverDashboardPage() {
  const { user, role, token, isLoading: authLoading } = useAuth()
  const [mode, setMode] = useState<'demo' | 'live'>('demo')

  // Profile state
  const [profile, setProfile] = useState<DriverProfile>(DEMO_PROFILE)
  const [profileLoading, setProfileLoading] = useState(false)
  const [togglingAvailability, setTogglingAvailability] = useState(false)

  // Rides state
  const [upcoming, setUpcoming] = useState<DashboardRide[]>(DEMO_UPCOMING)
  const [ridesLoading, setRidesLoading] = useState(false)

  // Error/message
  const [error, setError] = useState<string | null>(null)
  const [msg, setMsg] = useState<string | null>(null)

  const api = getApi(role ?? 'DRIVER')

  // ── Load live data ────────────────────────────────────────────────────
  const loadProfile = useCallback(async () => {
    if (mode === 'demo') return
    setProfileLoading(true)
    setError(null)
    try {
      const data = await api.get<DriverProfile>('/drivers/profile')
      setProfile(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load profile')
      setProfile(DEMO_PROFILE)
    } finally {
      setProfileLoading(false)
    }
  }, [mode, api])

  const loadRides = useCallback(async () => {
    if (mode === 'demo') {
      setUpcoming(DEMO_UPCOMING)
      return
    }
    setRidesLoading(true)
    setError(null)
    try {
      const data = await api.get<DashboardRide[]>('/rides/my-driver-rides')
      const now = new Date()
      const active = data.filter(r =>
        ['MATCHED', 'CONFIRMED', 'IN_PROGRESS'].includes(r.status) &&
        new Date(r.pickupTime) > now
      )
      setUpcoming(active.slice(0, 5))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load rides')
      setUpcoming(DEMO_UPCOMING)
    } finally {
      setRidesLoading(false)
    }
  }, [mode, api])

  useEffect(() => {
    if (mode === 'live' && token) {
      loadProfile()
      loadRides()
    } else if (mode === 'demo') {
      setProfile(DEMO_PROFILE)
      setUpcoming(DEMO_UPCOMING)
    }
  }, [mode, token, loadProfile, loadRides])

  // ── Availability toggle ───────────────────────────────────────────────
  const toggleAvailability = async () => {
    const next = !profile.isAvailableNow
    if (mode === 'demo') {
      setProfile(prev => ({ ...prev, isAvailableNow: next }))
      setMsg(`Demo: availability set to ${next ? 'available' : 'unavailable'}.`)
      return
    }
    setTogglingAvailability(true)
    setError(null)
    try {
      await api.patch('/drivers/availability', { isAvailableNow: next })
      setProfile(prev => ({ ...prev, isAvailableNow: next }))
      setMsg(`You are now ${next ? 'available' : 'unavailable'} for rides.`)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to update availability')
    } finally {
      setTogglingAvailability(false)
    }
  }

  // ── Derived stats ─────────────────────────────────────────────────────
  const activeRidesCount = upcoming.filter(r =>
    ['MATCHED', 'CONFIRMED', 'IN_PROGRESS'].includes(r.status)
  ).length
  const totalMilesThisWeek = upcoming.reduce((s, r) => s + r.appointment.estimatedMiles, 0)
  const weeklyEarnings = profile.ridesCompleted * 15 // rough demo calc

  return (
    <DashboardLayout
      role="driver"
      title="Driver Dashboard"
      subtitle="Manage your driving activity, rides, and availability"
      userName={profile?.user?.firstName ?? 'Driver'}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* ── Mode toggle ─────────────────────────────────────────────── */}
        {(authLoading || !token) && mode === 'live' && (
          <Card>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
              <Badge variant="warning">Demo mode</Badge>
              <p style={{ fontSize: 14, color: '#64748b', flex: 1 }}>
                Log in to connect live data. Showing demo data.
              </p>
              <div style={{ display: 'flex', gap: 8 }}>
                <Button size="sm" variant={mode === 'demo' ? 'primary' : 'secondary'} onClick={() => setMode('demo')}>
                  Demo
                </Button>
                <Button size="sm" variant={mode === 'live' ? 'primary' : 'secondary'} onClick={() => setMode('live')}>
                  Live
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* ── Welcome banner ──────────────────────────────────────────── */}
        <section
          style={{
            borderRadius: 16,
            padding: 30,
            background: 'linear-gradient(135deg, #0c6bc2 0%, #052b56 100%)',
            boxShadow: '0 10px 24px rgba(12, 107, 194, 0.18)',
          }}
        >
          <p style={{
            margin: 0, marginBottom: 8, color: '#93c5fd',
            fontSize: 12, fontWeight: 800, textTransform: 'uppercase',
            letterSpacing: '0.18em',
          }}>
            Driver Portal
          </p>
          <h2 style={{ margin: 0, color: '#ffffff', fontSize: 26, fontWeight: 800, lineHeight: 1.35 }}>
            Welcome back, {profile?.user?.firstName ?? 'Driver'}
          </h2>
          <p style={{ maxWidth: 700, marginTop: 10, marginBottom: 0, color: '#93c5fd', fontSize: 15, lineHeight: 1.6 }}>
            View your upcoming rides, manage availability, and track your impact on patient care.
          </p>
        </section>

        {/* ── Stats row ───────────────────────────────────────────────── */}
        <div className="cp-grid-4" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 16,
        }}>
          <StatCard
            label="Rides Completed"
            value={profile.ridesCompleted}
            icon={CheckCircle2}
            color="blue"
          />
          <StatCard
            label="Reliability"
            value={profile.reliabilityScore.toFixed(1)}
            icon={ShieldCheck}
            color="teal"
          />
          <StatCard
            label="Active Rides"
            value={activeRidesCount}
            icon={Car}
            color="purple"
          />
          <StatCard
            label="Est. Earnings"
            value={`$${weeklyEarnings}`}
            icon={DollarSign}
            color="amber"
          />
        </div>

        {/* ── Availability card ───────────────────────────────────────── */}
        <Card>
          <CardHeader>
            <CardTitle>Availability</CardTitle>
          </CardHeader>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{
                  width: 10, height: 10, borderRadius: '50%',
                  background: profile.isAvailableNow ? '#1b9c86' : '#94a3b8',
                  display: 'inline-block',
                }} />
                <p style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: 0 }}>
                  {profile.isAvailableNow ? 'Available for rides' : 'Not available'}
                </p>
              </div>
              <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>
                {profile.preferredDays
                  ? `Preferred days: ${profile.preferredDays}`
                  : 'No preferred days set'}
                {profile.maxMilesOneWay ? ` · Max ${profile.maxMilesOneWay} miles one way` : ''}
              </p>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <Badge variant={profile.isAvailableNow ? 'success' : 'neutral'}>
                {profile.isAvailableNow ? 'Online' : 'Offline'}
              </Badge>
              <button
                onClick={toggleAvailability}
                disabled={togglingAvailability || (mode === 'live' && !token)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                  opacity: (togglingAvailability || (mode === 'live' && !token)) ? 0.5 : 1,
                }}
                title={profile.isAvailableNow ? 'Go offline' : 'Go online'}
              >
                {profile.isAvailableNow
                  ? <ToggleRight size={44} color="#1b9c86" />
                  : <ToggleLeft size={44} color="#94a3b8" />
                }
              </button>
              <Link
                href="/driver/availability"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '8px 16px', borderRadius: 10, fontSize: 13, fontWeight: 600,
                  background: '#f8fafc', color: '#0c6bc2', border: '1px solid #e2e8f0',
                  textDecoration: 'none', minHeight: 36,
                }}
              >
                <Calendar size={15} />
                Schedule
              </Link>
            </div>
          </div>
        </Card>

        {/* ── Messages ────────────────────────────────────────────────── */}
        {msg && (
          <div style={{
            borderRadius: 10, border: '1px solid #bbf7d0', background: '#f0fdf4',
            color: '#166534', padding: '11px 14px', fontSize: 14,
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <CheckCircle2 size={16} />
            {msg}
            <button onClick={() => setMsg(null)} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#166534', fontSize: 16 }}>×</button>
          </div>
        )}
        {error && (
          <div style={{
            borderRadius: 10, border: '1px solid #fecaca', background: '#fef2f2',
            color: '#b91c1c', padding: '11px 14px', fontSize: 14,
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{ fontWeight: 700 }}>Error:</span> {error}
            <button onClick={() => setError(null)} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#b91c1c', fontSize: 16 }}>×</button>
          </div>
        )}

        {/* ── Upcoming rides ──────────────────────────────────────────── */}
        <Card>
          <CardHeader>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <CardTitle>Upcoming Rides</CardTitle>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <Badge variant={mode === 'live' ? 'success' : 'warning'}>
                  {mode === 'live' ? 'Live' : 'Demo'}
                </Badge>
                <Link
                  href="/driver/rides"
                  style={{ fontSize: 13, fontWeight: 600, color: '#0c6bc2', textDecoration: 'none' }}
                >
