'use client'

import { useEffect, useState } from 'react'
import {
  Activity,
  CheckCircle2,
  Clock3,
  Eye,
  MapPin,
  Navigation,
  PhoneCall,
  Route,
  ShieldCheck,
  Users,
} from 'lucide-react'

import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { DriverMapView } from '@/components/feature/DriverMapView'
import {
  buildGpsTrackerSnapshot,
  fetchGpsTracking,
  type GpsRole,
} from '@/services/gps'

type GpsFeaturePanelProps = {
  role: GpsRole
  title: string
  subtitle: string
}

type LiveLocation = {
  lat: number
  lng: number
  accuracy: number | null
  timestamp: number
}

const DRIVER_DESTINATION = { lat: 41.8781, lng: -87.6298 }

function getDistanceMiles(from: LiveLocation, to: { lat: number; lng: number }) {
  const toRad = (value: number) => (value * Math.PI) / 180
  const earthRadiusMiles = 3958.8
  const deltaLat = toRad(to.lat - from.lat)
  const deltaLng = toRad(to.lng - from.lng)
  const lat1 = toRad(from.lat)
  const lat2 = toRad(to.lat)

  const a = Math.sin(deltaLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return earthRadiusMiles * c
}

export function GpsFeaturePanel({ role, title, subtitle }: GpsFeaturePanelProps) {
  const [shareEnabled, setShareEnabled] = useState(role === 'driver' || role === 'patient')
  const [tracker, setTracker] = useState(() => buildGpsTrackerSnapshot(role))
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [liveLocation, setLiveLocation] = useState<LiveLocation | null>(null)
  const [locationStatus, setLocationStatus] = useState<'idle' | 'watching' | 'blocked' | 'unavailable'>(() => {
    if (role !== 'driver' || typeof window === 'undefined') {
      return 'unavailable'
    }

    return 'geolocation' in navigator ? 'idle' : 'unavailable'
  })
  const [lastUpdatedAt, setLastUpdatedAt] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    const loadTracking = async () => {
      setLoading(true)
      setError(null)

      try {
        const data = await fetchGpsTracking(role)
        if (!active) return
        setTracker(data)
        setShareEnabled(Boolean(data.shareEnabled))
      } catch (err) {
        if (!active) return
        setError(err instanceof Error ? err.message : 'Unable to load tracking data.')
        setTracker(buildGpsTrackerSnapshot(role))
      } finally {
        if (active) setLoading(false)
      }
    }

    void loadTracking()

    const pollingInterval = window.setInterval(() => {
      void loadTracking()
    }, 10000)

    return () => {
      active = false
      window.clearInterval(pollingInterval)
    }
  }, [role])

  useEffect(() => {
    if (role !== 'driver' || typeof window === 'undefined') {
      return
    }

    if (!('geolocation' in navigator)) {
      return
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const nextLocation: LiveLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy ?? null,
          timestamp: position.timestamp,
        }

        setLiveLocation(nextLocation)
        setLocationStatus('watching')
        setLastUpdatedAt(new Date(position.timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }))

        setTracker((current) => {
          const distanceMiles = getDistanceMiles(nextLocation, DRIVER_DESTINATION)
          const etaMinutes = Math.max(2, Math.min(24, Math.round(distanceMiles * 6 + 4)))
          const statusLabel = etaMinutes <= 5 ? 'Arriving soon' : etaMinutes <= 12 ? 'En route' : 'Moving'

          return {
            ...current,
            etaMinutes,
            statusLabel,
            locationLabel: `Live position • ${nextLocation.lat.toFixed(4)}, ${nextLocation.lng.toFixed(4)}`,
            title: 'Driver navigation view',
            subtitle: 'Live route guidance is active and the ride handoff is updating.',
            currentLocation: nextLocation,
            destinationLocation: DRIVER_DESTINATION,
            locationStatus: 'watching',
            lastUpdatedAt: new Date(position.timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
          }
        })
      },
      () => {
        setLocationStatus('blocked')
        setTracker((current) => ({ ...current, locationStatus: 'blocked' }))
      },
      {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 10000,
      },
    )

    return () => {
      navigator.geolocation.clearWatch(watchId)
    }
  }, [role])

  const headerAccent =
    role === 'driver'
      ? '#0c6bc2'
      : role === 'patient'
        ? '#a10e97'
        : '#5540a1'

  const mapCurrentPosition = liveLocation
    ? {
        x: Math.min(86, Math.max(14, 46 + (liveLocation.lng - DRIVER_DESTINATION.lng) * 2400)),
        y: Math.min(84, Math.max(16, 70 - (liveLocation.lat - DRIVER_DESTINATION.lat) * 2800)),
      }
    : { x: 32, y: 58 }

  const mapDestinationPosition = { x: 78, y: 24 }
  const mapPickupPosition = { x: 24, y: 72 }

  return (
    <DashboardLayout
      role={role}
      title={title}
      subtitle={subtitle}
      userName={role === 'driver' ? 'Driver' : role === 'patient' ? 'Patient' : 'Care Team'}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <section
          style={{
            padding: 24,
            borderRadius: 18,
            background: `linear-gradient(135deg, ${headerAccent} 0%, #111827 100%)`,
            color: '#fff',
            boxShadow: '0 16px 40px rgba(15, 23, 42, 0.16)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
            <div>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.8 }}>
                Live tracking preview
              </p>
              <h2 style={{ margin: '6px 0 8px', fontSize: 24, fontWeight: 800 }}>
                {title}
              </h2>
              <p style={{ margin: 0, maxWidth: 680, lineHeight: 1.6, opacity: 0.92 }}>
                {subtitle}
              </p>
              {loading ? (
                <p style={{ margin: '10px 0 0', fontSize: 13, opacity: 0.9 }}>Loading live ride data…</p>
              ) : null}
              {error ? (
                <p style={{ margin: '10px 0 0', fontSize: 13, opacity: 0.9 }}>{error}</p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => setShareEnabled((value) => !value)}
              style={{
                border: 'none',
                borderRadius: 999,
                padding: '10px 14px',
                background: shareEnabled ? '#ffffff' : 'rgba(255,255,255,0.16)',
                color: shareEnabled ? headerAccent : '#fff',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {shareEnabled ? 'Live sharing on' : 'Live sharing off'}
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, marginTop: 18 }}>
            <div style={{ background: 'rgba(255,255,255,0.16)', borderRadius: 16, padding: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Navigation size={18} />
                <strong>Current status</strong>
              </div>
              <p style={{ margin: '8px 0 0', fontSize: 14, opacity: 0.95 }}>
                {tracker.statusLabel} • {tracker.etaMinutes} min ETA
              </p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.16)', borderRadius: 16, padding: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Clock3 size={18} />
                <strong>Location</strong>
              </div>
              <p style={{ margin: '8px 0 0', fontSize: 14, opacity: 0.95 }}>
                {tracker.locationLabel}
              </p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.16)', borderRadius: 16, padding: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <ShieldCheck size={18} />
                <strong>Privacy</strong>
              </div>
              <p style={{ margin: '8px 0 0', fontSize: 14, opacity: 0.95 }}>
                {shareEnabled ? tracker.visibilityLabel : 'Sharing is paused until consent is re-enabled.'}
              </p>
            </div>
          </div>
        </section>

        <section style={{ display: 'grid', gap: 16, gridTemplateColumns: '1.3fr 0.7fr' }}>
          <div style={{ border: '1px solid #e2e8f0', borderRadius: 18, padding: 18, background: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <div>
                <p style={{ margin: 0, fontSize: 12, fontWeight: 800, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#64748b' }}>Route preview</p>
                <h3 style={{ margin: '6px 0 0', color: '#0f172a' }}>{tracker.title}</h3>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: headerAccent, fontWeight: 700 }}>
                <Activity size={16} />
                {tracker.subtitle}
              </div>
            </div>

            <div style={{ marginTop: 16, borderRadius: 16, overflow: 'hidden', background: '#f8fafc', border: '1px solid #dbeafe' }}>
              {role === 'driver' ? (
                <DriverMapView
                  currentLocation={liveLocation}
                  destinationLocation={tracker.destinationLocation ?? null}
                  accent={headerAccent}
                />
              ) : (
                <div style={{ height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#334155', fontWeight: 600 }}>
                  Map view is available for the driver navigation flow.
                </div>
              )}
              <div style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.92)', borderTop: '1px solid #e2e8f0', fontSize: 12, fontWeight: 700, color: '#0f172a' }}>
                {locationStatus === 'watching' ? `Updated ${lastUpdatedAt ?? 'just now'}` : locationStatus === 'blocked' ? 'Location blocked' : 'Waiting for device location'}
              </div>
            </div>
          </div>

          <div style={{ border: '1px solid #e2e8f0', borderRadius: 18, padding: 18, background: '#fff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Users size={18} color={headerAccent} />
              <h3 style={{ margin: 0, color: '#0f172a' }}>Visibility</h3>
            </div>

            <div style={{ marginTop: 14, display: 'grid', gap: 10 }}>
              {tracker.participants.map((participant) => (
                <div key={participant.name} style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: 12, background: '#f8fafc' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                    <div>
                      <p style={{ margin: 0, fontWeight: 700, color: '#0f172a' }}>{participant.name}</p>
                      <p style={{ margin: '2px 0 0', fontSize: 13, color: '#64748b' }}>{participant.role}</p>
                    </div>
                    <span style={{ padding: '4px 8px', borderRadius: 999, background: '#e2e8f0', color: '#475569', fontSize: 12, fontWeight: 700 }}>{participant.access}</span>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 14, borderTop: '1px solid #e2e8f0', paddingTop: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#334155' }}>
                <Eye size={16} />
                <span style={{ fontSize: 14, fontWeight: 600 }}>Sharing status</span>
              </div>
              <p style={{ margin: '8px 0 0', color: '#64748b', lineHeight: 1.6, fontSize: 14 }}>
                {shareEnabled ? 'Location sharing is enabled for the assigned support team.' : 'Sharing is paused and can be resumed when the ride is active.'}
              </p>
            </div>
          </div>
        </section>

        <section style={{ display: 'grid', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <MapPin size={18} color={headerAccent} />
            <h3 style={{ margin: 0, color: '#0f172a' }}>Tracking timeline</h3>
          </div>

          {tracker.timeline.map((step) => (
            <div key={step.label} style={{ border: '1px solid #e2e8f0', borderRadius: 16, padding: 16, background: '#fff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {step.active ? <CheckCircle2 size={18} color="#0c6bc2" /> : <Route size={18} color="#64748b" />}
                  <div>
                    <p style={{ margin: 0, fontWeight: 700, color: '#0f172a' }}>{step.label}</p>
                    <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 14 }}>{step.detail}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>

        <section style={{ border: '1px solid #e2e8f0', borderRadius: 16, padding: 16, background: '#f8fafc' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <PhoneCall size={18} color={headerAccent} />
            <h3 style={{ margin: 0, color: '#0f172a' }}>Next implementation steps</h3>
          </div>
          <ul style={{ margin: '12px 0 0 18px', color: '#334155', lineHeight: 1.7 }}>
            <li>Use the live geolocation feed to refine arrival estimates and route prompts in real time.</li>
            <li>Add consent and privacy controls for patient location sharing.</li>
            <li>Expose the same tracking view in the dispatcher and care-team dashboards.</li>
          </ul>
        </section>
      </div>
    </DashboardLayout>
  )
}
