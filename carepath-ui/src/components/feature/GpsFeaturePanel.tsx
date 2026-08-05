'use client'

import { useMemo, useState } from 'react'
import {
  CheckCircle2,
  Clock3,
  MapPin,
  Navigation,
  PhoneCall,
  Route,
  ShieldCheck,
} from 'lucide-react'

import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { getGpsCapabilityPlan, type GpsRole } from '@/services/gps'

type GpsFeaturePanelProps = {
  role: GpsRole
  title: string
  subtitle: string
}

export function GpsFeaturePanel({ role, title, subtitle }: GpsFeaturePanelProps) {
  const [shareEnabled, setShareEnabled] = useState(role === 'driver')
  const capabilities = useMemo(() => getGpsCapabilityPlan(role), [role])

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
                GPS foundation
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
                <strong>Next stop</strong>
              </div>
              <p style={{ margin: '8px 0 0', fontSize: 14, opacity: 0.95 }}>
                {role === 'driver' ? 'Route guidance is ready for the next ride.' : 'Trip progress can be shown here once the rider is active.'}
              </p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.16)', borderRadius: 16, padding: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Clock3 size={18} />
                <strong>Arrival estimate</strong>
              </div>
              <p style={{ margin: '8px 0 0', fontSize: 14, opacity: 0.95 }}>
                {role === 'driver' ? 'Estimated arrival in 12 minutes.' : 'Care team can see updates as the ride progresses.'}
              </p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.16)', borderRadius: 16, padding: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <ShieldCheck size={18} />
                <strong>Privacy</strong>
              </div>
              <p style={{ margin: '8px 0 0', fontSize: 14, opacity: 0.95 }}>
                Access is scoped to the assigned rider and designated care contacts.
              </p>
            </div>
          </div>
        </section>

        <section style={{ display: 'grid', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <MapPin size={18} color={headerAccent} />
            <h3 style={{ margin: 0, color: '#0f172a' }}>Planned GPS capabilities</h3>
          </div>

          {capabilities.map((capability) => (
            <div key={capability.label} style={{ border: '1px solid #e2e8f0', borderRadius: 16, padding: 16, background: '#fff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {capability.available ? <CheckCircle2 size={18} color="#0c6bc2" /> : <Route size={18} color="#64748b" />}
                  <div>
                    <p style={{ margin: 0, fontWeight: 700, color: '#0f172a' }}>{capability.label}</p>
                    <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 14 }}>{capability.description}</p>
                  </div>
                </div>
                <span style={{ padding: '6px 10px', borderRadius: 999, background: capability.available ? '#dbeafe' : '#f1f5f9', color: capability.available ? '#1d4ed8' : '#475569', fontSize: 12, fontWeight: 700, textTransform: 'uppercase' }}>
                  {capability.status}
                </span>
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
            <li>Connect the UI to live map and route APIs.</li>
            <li>Add consent and privacy controls for patient location sharing.</li>
            <li>Expose the same tracking view in the dispatcher and care-team dashboards.</li>
          </ul>
        </section>
      </div>
    </DashboardLayout>
  )
}
