'use client'

import { useState } from 'react'
import { Car, CheckCircle2, CreditCard } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Badge } from '@/components/ui/Badge'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { StatCard } from '@/components/ui/StatCard'
import { demoRides, RideRow, statusVariant, toDisplayDate } from '@/lib/portal'

export default function PartnerRidesPage() {
  const [rides] = useState<RideRow[]>(demoRides)

  return (
    <DashboardLayout role="partner" title="Funded Rides" subtitle="Rides supported by your credits" userName="Partner">
      <div className="cp-space-y-4">
        <section style={{ borderRadius: 16, padding: 20, background: 'linear-gradient(135deg, #dfc6b5 0%, #ec4ecc 100%)', color: '#fff' }}>
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#fef3c7', marginBottom: 6 }}>Funded transportation</p>
          <h2 style={{ fontSize: 20, fontWeight: 800 }}>Review rides funded through your partner credits.</h2>
        </section>

        <div className="cp-grid-2">
          <StatCard label="Total Funded Rides" value={rides.length} icon={Car} color="purple" />
          <StatCard label="Completed" value={rides.filter(r => r.status === 'COMPLETED').length} icon={CheckCircle2} color="teal" />
        </div>

        <Card>
          <CardHeader><CardTitle>All Funded Rides</CardTitle></CardHeader>
          <div className="cp-space-y-3">
            {rides.length === 0 && <p style={{ fontSize: 14, color: '#64748b' }}>No rides funded yet.</p>}
            {rides.map(ride => (
              <div key={ride.id} style={{ border: '1.5px solid #e2e8f0', borderRadius: 12, padding: 16, background: '#fff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                  <p style={{ fontWeight: 700, fontSize: 15, color: '#0f172a', margin: 0 }}>{ride.appointment.clinicName}</p>
                  <Badge variant={statusVariant(ride.status)}>{ride.status}</Badge>
                </div>
                <p style={{ fontSize: 13, color: '#64748b', margin: '4px 0' }}>{ride.appointment.appointmentType} · {ride.appointment.clinicCity}, {ride.appointment.clinicState}</p>
                {ride.patient && (
                  <p style={{ fontSize: 13, color: '#475569', margin: '4px 0' }}>
                    Patient: {ride.patient.user.firstName} {ride.patient.user.lastName} · {ride.patient.county}, {ride.patient.state}
                  </p>
                )}
                <p style={{ fontSize: 12, color: '#94a3b8', margin: '4px 0' }}>Pickup: {toDisplayDate(ride.pickupTime)}</p>
                <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                  <Badge variant="info">Est. {ride.appointment.estimatedMiles} miles</Badge>
                  <Badge variant="neutral">Urgency: {ride.urgencyLevel}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}

