are'use client'

import { useState } from 'react'
import { Users, MapPin, Phone } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Badge } from '@/components/ui/Badge'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { demoPatients, PatientRow } from '@/lib/portal'

export default function AdvocatePatientsPage() {
  const [patients] = useState<PatientRow[]>(demoPatients)

  return (
    <DashboardLayout role="advocate" title="Patients" subtitle="Your patient roster and care details" userName="Advocate">
      <div className="cp-space-y-4">
        <section style={{ borderRadius: 16, padding: 20, background: 'linear-gradient(135deg, #b62ea1, #7c2687)', color: '#fff' }}>
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#f0d4f0', marginBottom: 6 }}>Patient roster</p>
          <h2 style={{ fontSize: 20, fontWeight: 800 }}>View and manage your assigned patients.</h2>
        </section>

        <Card>
          <CardHeader><CardTitle>Patients ({patients.length})</CardTitle></CardHeader>
          <div className="cp-space-y-3">
            {patients.length === 0 && <p style={{ fontSize: 14, color: '#64748b' }}>No patients assigned.</p>}
            {patients.map(patient => (
              <div key={patient.id} style={{ border: '1.5px solid #e2e8f0', borderRadius: 12, padding: 16, background: '#fff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                  <p style={{ fontWeight: 700, fontSize: 15, color: '#0f172a', margin: 0 }}>
                    {patient.user.firstName} {patient.user.lastName}
                  </p>
                  <Badge variant={patient.accessibilityRequirement === 'NON_TRANSFERABLE_WHEELCHAIR' ? 'error' : 'info'}>
                    {patient.accessibilityRequirement.replace(/_/g, ' ')}
                  </Badge>
                </div>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 8, fontSize: 13, color: '#64748b' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <MapPin size={13} /> {patient.county}, {patient.state} {patient.zipCode}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Phone size={13} /> {patient.user.phone}
                  </span>
                </div>
                <p style={{ fontSize: 13, color: '#475569', margin: '8px 0 4px' }}>{patient.user.email}</p>
                {patient.notes && (
                  <p style={{ fontSize: 12, color: '#94a3b8', margin: '4px 0', fontStyle: 'italic' }}>{patient.notes}</p>
                )}
                <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                  <Badge variant="neutral">Language: {patient.primaryLanguage}</Badge>
                  <Badge variant="neutral">Funding: {patient.defaultFundingSource?.replace(/_/g, ' ') ?? 'N/A'}</Badge>
                  {patient.barriers && <Badge variant="warning">{patient.barriers}</Badge>}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}

