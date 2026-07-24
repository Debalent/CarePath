'use client'

import { Heart, MapPin, Building2, Shield } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

export default function AdvocateProfilePage() {
  return (
    <DashboardLayout role="advocate" title="My Profile" subtitle="Advocate account and specialization" userName="Advocate">
      <div className="cp-space-y-4" style={{ maxWidth: 700 }}>
        <section style={{ borderRadius: 16, padding: 20, background: 'linear-gradient(135deg, #b62ea1, #7c2687)', color: '#fff' }}>
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#f0d4f0', marginBottom: 6 }}>Advocate profile</p>
          <h2 style={{ fontSize: 20, fontWeight: 800 }}>Manage your advocate account and patient advocacy details.</h2>
        </section>

        <Card>
          <CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
          <div className="cp-space-y-4">
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Full Name</p>
              <p style={{ fontSize: 16, fontWeight: 600, color: '#0f172a' }}>Alex Rivera</p>
            </div>
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Email</p>
              <p style={{ fontSize: 16, color: '#0f172a' }}>alex.rivera@example.com</p>
            </div>
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Phone</p>
              <p style={{ fontSize: 16, color: '#0f172a' }}>(501) 555-0300</p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <Badge variant="success">Verified Advocate</Badge>
              <Badge variant="info">Active</Badge>
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader><CardTitle>Advocate Details</CardTitle></CardHeader>
          <div className="cp-space-y-4">
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <Building2 size={18} style={{ color: '#b62ea1', marginTop: 2, flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', marginBottom: 2 }}>Organization</p>
                <p style={{ fontSize: 14, color: '#64748b' }}>Arkansas Patient Advocacy Network</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <MapPin size={18} style={{ color: '#b62ea1', marginTop: 2, flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', marginBottom: 2 }}>Service Area</p>
                <p style={{ fontSize: 14, color: '#64748b' }}>Pulaski County, AR</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <Heart size={18} style={{ color: '#b62ea1', marginTop: 2, flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', marginBottom: 2 }}>Specialization</p>
                <p style={{ fontSize: 14, color: '#64748b' }}>Dialysis & Chronic Condition Patient Advocacy</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <Shield size={18} style={{ color: '#b62ea1', marginTop: 2, flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', marginBottom: 2 }}>Verification</p>
                <p style={{ fontSize: 14, color: '#64748b' }}>Verified · Background check completed</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}

