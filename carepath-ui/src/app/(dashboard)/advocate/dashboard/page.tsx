'use client'

import Link from 'next/link'
import { Car, Users, MessageSquare, Heart, ClipboardList } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { StatCard } from '@/components/ui/StatCard'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

export default function AdvocateDashboardPage() {
  return (
    <DashboardLayout
      role="advocate"
      title="Advocate Dashboard"
      subtitle="Coordinate care and transportation for your patients"
      userName="Advocate"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Welcome banner */}
        <section
          style={{
            borderRadius: 16,
            padding: 30,
            background: 'linear-gradient(135deg, #b62ea1 0%, #7c2687 100%)',
            boxShadow: '0 10px 24px rgba(182, 46, 161, 0.18)',
          }}
        >
          <p style={{ margin: 0, marginBottom: 8, color: '#f0d4f0', fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.18em' }}>
            Advocate Portal
          </p>
          <h2 style={{ margin: 0, color: '#ffffff', fontSize: 26, fontWeight: 800, lineHeight: 1.35 }}>
            Supporting patient transportation
          </h2>
          <p style={{ maxWidth: 700, marginTop: 10, marginBottom: 0, color: '#f0d4f0', fontSize: 15, lineHeight: 1.6 }}>
            Monitor rides, communicate with coordinators and drivers, and ensure your patients get to their appointments.
          </p>
        </section>

        {/* Stats */}
        <div className="cp-grid-3">
          <StatCard label="Active Rides" value={3} icon={Car} color="purple" />
          <StatCard label="Patients" value={12} icon={Users} color="teal" />
          <StatCard label="Unread Messages" value={5} icon={MessageSquare} color="blue" />
        </div>

        {/* Quick actions */}
        <section style={{ display: 'grid', gap: 20, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          <Link href="/advocate/rides" style={{ display: 'block', padding: 24, borderRadius: 14, border: '1px solid #e2e8f0', background: '#fff', textDecoration: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 48, height: 48, borderRadius: 12, background: '#f3e2f7', color: '#b62ea1', marginBottom: 16 }}>
              <Car size={26} />
            </div>
            <h3 style={{ margin: 0, marginBottom: 8, color: '#0f172a', fontSize: 18, fontWeight: 800 }}>Rides</h3>
            <p style={{ margin: 0, color: '#64748b', fontSize: 14, lineHeight: 1.55 }}>View and track all rides for your patients.</p>
          </Link>

          <Link href="/advocate/patients" style={{ display: 'block', padding: 24, borderRadius: 14, border: '1px solid #e2e8f0', background: '#fff', textDecoration: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 48, height: 48, borderRadius: 12, background: '#d0f4ee', color: '#1b9c86', marginBottom: 16 }}>
              <Users size={26} />
            </div>
            <h3 style={{ margin: 0, marginBottom: 8, color: '#0f172a', fontSize: 18, fontWeight: 800 }}>Patients</h3>
            <p style={{ margin: 0, color: '#64748b', fontSize: 14, lineHeight: 1.55 }}>Manage your patient roster and their needs.</p>
          </Link>

          <Link href="/advocate/messages" style={{ display: 'block', padding: 24, borderRadius: 14, border: '1px solid #e2e8f0', background: '#fff', textDecoration: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 48, height: 48, borderRadius: 12, background: '#dbeafe', color: '#0c6bc2', marginBottom: 16 }}>
              <MessageSquare size={26} />
            </div>
            <h3 style={{ margin: 0, marginBottom: 8, color: '#0f172a', fontSize: 18, fontWeight: 800 }}>Messages</h3>
            <p style={{ margin: 0, color: '#64748b', fontSize: 14, lineHeight: 1.55 }}>Communicate with coordinators, drivers, and patients.</p>
          </Link>
        </section>

        {/* Recent ride alerts */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Ride Activity</CardTitle>
          </CardHeader>
          <div className="cp-space-y-3">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff' }}>
              <div>
                <p style={{ fontWeight: 600, fontSize: 14, color: '#0f172a', margin: 0 }}>Churchie B — Dialysis</p>
                <p style={{ fontSize: 12, color: '#64748b', margin: '4px 0 0' }}>Baptist Health · Little Rock, AR · Today 1:00 PM</p>
              </div>
              <Badge variant="success">CONFIRMED</Badge>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff' }}>
              <div>
                <p style={{ fontWeight: 600, fontSize: 14, color: '#0f172a', margin: 0 }}>Alyssa M — Cardiology</p>
                <p style={{ fontSize: 12, color: '#64748b', margin: '4px 0 0' }}>AR Heart Hospital · Springdale, AR · Tomorrow 9:30 AM</p>
              </div>
              <Badge variant="warning">PENDING</Badge>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}

