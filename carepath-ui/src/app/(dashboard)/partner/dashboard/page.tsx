'use client'

import Link from 'next/link'
import { Car, CreditCard, MessageSquare, Building2, TrendingUp } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { StatCard } from '@/components/ui/StatCard'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

export default function PartnerDashboardPage() {
  return (
    <DashboardLayout
      role="partner"
      title="Partner Dashboard"
      subtitle="Manage credits and funded rides"
      userName="Partner"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Welcome banner */}
        <section
          style={{
            borderRadius: 16,
            padding: 30,
            background: 'linear-gradient(135deg, #da6110 0%, #cbd096 100%)',
            boxShadow: '0 10px 24px rgba(217, 119, 6, 0.18)',
          }}
        >
          <p style={{ margin: 0, marginBottom: 8, color: '#fef3c7', fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.18em' }}>
            Institutional Partner Portal
          </p>
          <h2 style={{ margin: 0, color: '#ffffff', fontSize: 26, fontWeight: 800, lineHeight: 1.35 }}>
            Supporting patient transportation through credits
          </h2>
          <p style={{ maxWidth: 700, marginTop: 10, marginBottom: 0, color: '#fef3c7', fontSize: 15, lineHeight: 1.6 }}>
            Monitor your ride credits, view funded rides, and communicate with coordinators.
          </p>
        </section>

        {/* Stats */}
        <div className="cp-grid-3">
          <StatCard label="Available Credits" value={48} icon={CreditCard} color="blue" />
          <StatCard label="Rides Funded" value={124} icon={Car} color="teal" />
          <StatCard label="Utilization Rate" value="76%" icon={TrendingUp} color="purple" />
        </div>

        {/* Quick actions */}
        <section style={{ display: 'grid', gap: 20, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          <Link href="/partner/credits" style={{ display: 'block', padding: 24, borderRadius: 14, border: '1px solid #e2e8f0', background: '#fff', textDecoration: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 48, height: 48, borderRadius: 12, background: '#dbeafe', color: '#0c6bc2', marginBottom: 16 }}>
              <CreditCard size={26} />
            </div>
            <h3 style={{ margin: 0, marginBottom: 8, color: '#0f172a', fontSize: 18, fontWeight: 800 }}>Credits</h3>
            <p style={{ margin: 0, color: '#64748b', fontSize: 14, lineHeight: 1.55 }}>View and manage your ride credit balance.</p>
          </Link>

          <Link href="/partner/rides" style={{ display: 'block', padding: 24, borderRadius: 14, border: '1px solid #e2e8f0', background: '#fff', textDecoration: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 48, height: 48, borderRadius: 12, background: '#d0f4ee', color: '#1b9c86', marginBottom: 16 }}>
              <Car size={26} />
            </div>
            <h3 style={{ margin: 0, marginBottom: 8, color: '#0f172a', fontSize: 18, fontWeight: 800 }}>Funded Rides</h3>
            <p style={{ margin: 0, color: '#64748b', fontSize: 14, lineHeight: 1.55 }}>Review rides funded through your credits.</p>
          </Link>

          <Link href="/partner/messages" style={{ display: 'block', padding: 24, borderRadius: 14, border: '1px solid #e2e8f0', background: '#fff', textDecoration: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 48, height: 48, borderRadius: 12, background: '#fef3c7', color: '#d97706', marginBottom: 16 }}>
              <MessageSquare size={26} />
            </div>
            <h3 style={{ margin: 0, marginBottom: 8, color: '#0f172a', fontSize: 18, fontWeight: 800 }}>Messages</h3>
            <p style={{ margin: 0, color: '#64748b', fontSize: 14, lineHeight: 1.55 }}>Communicate with coordinators about credits and rides.</p>
          </Link>
        </section>

        {/* Credit status */}
        <Card>
          <CardHeader><CardTitle>Credit Pool Summary</CardTitle></CardHeader>
          <div className="cp-space-y-3">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff' }}>
              <div>
                <p style={{ fontWeight: 600, fontSize: 14, color: '#0f172a', margin: 0 }}>General Transportation Fund</p>
                <p style={{ fontSize: 12, color: '#64748b', margin: '4px 0 0' }}>Expires Dec 2026</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontWeight: 700, fontSize: 16, color: '#0c6bc2', margin: 0 }}>28 credits left</p>
                <p style={{ fontSize: 12, color: '#64748b', margin: '2px 0 0' }}>of 50 total</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff' }}>
              <div>
                <p style={{ fontWeight: 600, fontSize: 14, color: '#0f172a', margin: 0 }}>Wheelchair-Accessible Fund</p>
                <p style={{ fontSize: 12, color: '#64748b', margin: '4px 0 0' }}>Expires Jun 2027</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontWeight: 700, fontSize: 16, color: '#0c6bc2', margin: 0 }}>20 credits left</p>
                <p style={{ fontSize: 12, color: '#64748b', margin: '2px 0 0' }}>of 20 total</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}

