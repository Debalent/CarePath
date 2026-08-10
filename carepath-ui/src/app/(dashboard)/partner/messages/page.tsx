'use client'

import { useState } from 'react'
import { MessageSquare } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { RideMessageThread } from '@/components/communication/RideMessageThread'
import { demoPortalMessages, demoRides } from '@/lib/portal'

export default function PartnerMessagesPage() {
  const [selectedRideId, setSelectedRideId] = useState<string | null>(null)

  return (
    <DashboardLayout role="partner" title="Messages" subtitle="Communication about funded rides" userName="Partner">
      <div className="cp-space-y-4">
        <section style={{ borderRadius: 16, padding: 20, background: 'linear-gradient(135deg, #dfc6b5 0%, #ec4ecc 100%)', color: '#fff' }}>
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#fef3c7', marginBottom: 6 }}>Partner messaging</p>
          <h2 style={{ fontSize: 20, fontWeight: 800 }}>Communicate with coordinators about credits and rides.</h2>
        </section>

        <div style={{ display: 'grid', gap: 20, gridTemplateColumns: '300px 1fr' }}>
          <Card>
            <CardHeader><CardTitle>Rides</CardTitle></CardHeader>
            <div className="cp-space-y-2">
              {demoRides.map(ride => (
                <button
                  key={ride.id}
                  onClick={() => setSelectedRideId(ride.id)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '12px',
                    borderRadius: 10,
                    border: selectedRideId === ride.id ? '2px solid #d97706' : '1px solid #e2e8f0',
                    background: selectedRideId === ride.id ? '#fffbeb' : '#fff',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  <p style={{ fontWeight: 600, fontSize: 14, color: '#0f172a', margin: 0 }}>{ride.appointment.clinicName}</p>
                  <p style={{ fontSize: 12, color: '#64748b', margin: '4px 0 0' }}>{ride.appointment.appointmentType}</p>
                  <div style={{ marginTop: 6 }}>
                    <Badge variant={ride.status === 'CONFIRMED' ? 'success' : 'warning'}>{ride.status}</Badge>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                {selectedRideId
                  ? `Messages - ${demoRides.find(r => r.id === selectedRideId)?.appointment.clinicName ?? selectedRideId}`
                  : 'Select a ride to view messages'}
              </CardTitle>
            </CardHeader>
            {selectedRideId ? (
              <RideMessageThread
                rideId={selectedRideId}
                role="PARTNER"
                demoMessages={demoPortalMessages}
              />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: 48, color: '#94a3b8' }}>
                <MessageSquare size={32} />
                <p style={{ fontSize: 14 }}>Select a ride from the list to view its message thread.</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

