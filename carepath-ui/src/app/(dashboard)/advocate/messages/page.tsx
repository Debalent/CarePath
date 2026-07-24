'use client'

import { useState } from 'react'
import { MessageSquare } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { RideMessageThread } from '@/components/communication/RideMessageThread'
import { demoPortalMessages, demoRides } from '@/lib/portal'

export default function AdvocateMessagesPage() {
  const [selectedRideId, setSelectedRideId] = useState<string | null>(null)

  return (
    <DashboardLayout role="advocate" title="Messages" subtitle="Communication about patient rides" userName="Advocate">
      <div className="cp-space-y-4">
        <section style={{ borderRadius: 16, padding: 20, background: 'linear-gradient(135deg, #b62ea1, #7c2687)', color: '#fff' }}>
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#f0d4f0', marginBottom: 6 }}>Ride messaging</p>
          <h2 style={{ fontSize: 20, fontWeight: 800 }}>Communicate with coordinators, drivers, and patients.</h2>
        </section>

        <div style={{ display: 'grid', gap: 20, gridTemplateColumns: '300px 1fr' }}>
          {/* Ride selector sidebar */}
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
                    border: selectedRideId === ride.id ? '2px solid #b62ea1' : '1px solid #e2e8f0',
                    background: selectedRideId === ride.id ? '#fdf2f8' : '#fff',
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

          {/* Message thread */}
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
                role="ADVOCATE"
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

