'use client'

import { useMemo, useState } from 'react'
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
import {
  buildGpsTrackerSnapshot,
  getGpsCapabilityPlan,
  type GpsRole,
} from '@/services/gps'

type GpsFeaturePanelProps = {
  role: GpsRole
  title: string
  subtitle: string
}

export function GpsFeaturePanel({ role, title, subtitle }: GpsFeaturePanelProps) {
  const [shareEnabled, setShareEnabled] = useState(role === 'driver' || role === 'patient')
  const capabilities = useMemo(() => getGpsCapabilityPlan(role), [role])
  const tracker = useMemo(() => buildGpsTrackerSnapshot(role), [role])

  const headerAccent =
    role === 'driver'
      ? '#0c6bc2'
      : role === 'patient'
        ? '#a10e97'
        : '#5540a1'

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

            <div style={{ marginTop: 16, borderRadius: 16, height: 220, background: 'linear-gradient(135deg, #eff6ff 0%, #f8fafc 100%)', border: '1px solid #dbeafe', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(90deg, rgba(15, 23, 42, 0.04) 0 2px, transparent 2px 40px)' }} />
              <div style={{ position: 'absolute', left: '14%', bottom: '26%', width: 120, height: 72, borderRadius: 999, border: '2px dashed #94a3b8', transform: 'rotate(-12deg)' }} />
              <div style={{ position: 'absolute', right: '20%', top: '18%', width: 92, height: 92, borderRadius: '50%', background: 'rgba(14, 116, 144, 0.15)' }} />
              <div style={{ position: 'absolute', left: '48%', top: '44%', width: 18, height: 18, borderRadius: '50%', background: headerAccent, boxShadow: `0 0 0 12px ${headerAccent}22` }} />
              <div style={{ position: 'absolute', left: '22%', top: '58%', color: '#0f172a', fontSize: 13, fontWeight: 700 }}>Pickup</div>
              <div style={{ position: 'absolute', right: '18%', top: '28%', color: '#0f172a', fontSize: 13, fontWeight: 700 }}>Destination</div>
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
            <li>Connect the UI to a real geolocation provider and live route feed.</li>
            <li>Add consent and privacy controls for patient location sharing.</li>
            <li>Expose the same tracking view in the dispatcher and care-team dashboards.</li>
          </ul>
        </section>
      </div>
    </DashboardLayout>
  )
}
