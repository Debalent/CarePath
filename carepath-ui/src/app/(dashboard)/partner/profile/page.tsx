'use client'

import { Building2, MapPin, Shield, CreditCard } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

export default function PartnerProfilePage() {
  return (
    <DashboardLayout role="partner" title="My Profile" subtitle="Institutional partner account" userName="Partner">
      <div className="cp-space-y-4" >
        <section style={{ borderRadius: 16, padding: 20, background: 'linear-gradient(135deg, #dfc6b5 0%, #ec4ecc 100%)', color: '#fff' }}>
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#fef3c7', marginBottom: 6 }}>Partner profile</p>
          <h2 style={{ fontSize: 20, fontWeight: 800 }}>Manage your institutional partnership account.</h2>
        </section>

        <Card>
          <CardHeader><CardTitle>Organization Information</CardTitle></CardHeader>
          <div className="cp-space-y-4">
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Organization Name</p>
              <p style={{ fontSize: 16, fontWeight: 600, color: '#0f172a' }}>Arkansas Community Health Alliance</p>
            </div>
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Contact Email</p>
              <p style={{ fontSize: 16, color: '#0f172a' }}>partnerships@arkansashealth.org</p>
            </div>
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Contact Phone</p>
              <p style={{ fontSize: 16, color: '#0f172a' }}>(501) 555-0400</p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <Badge variant="success">Verified Partner</Badge>
              <Badge variant="info">Active</Badge>
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader><CardTitle>Service Details</CardTitle></CardHeader>
          <div className="cp-space-y-4">
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <Building2 size={18} style={{ color: '#d97706', marginTop: 2, flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', marginBottom: 2 }}>Organization Type</p>
                <p style={{ fontSize: 14, color: '#64748b' }}>Healthcare Network / Community Health Alliance</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <MapPin size={18} style={{ color: '#d97706', marginTop: 2, flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', marginBottom: 2 }}>Service Region</p>
                <p style={{ fontSize: 14, color: '#64748b' }}>Pulaski County and surrounding areas, AR</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <CreditCard size={18} style={{ color: '#d97706', marginTop: 2, flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', marginBottom: 2 }}>Credit Funding</p>
                <p style={{ fontSize: 14, color: '#64748b' }}>$5,000 total allocated · $2,800 remaining</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <Shield size={18} style={{ color: '#d97706', marginTop: 2, flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', marginBottom: 2 }}>Verification</p>
                <p style={{ fontSize: 14, color: '#64748b' }}>Verified institutional partner</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}

