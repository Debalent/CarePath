'use client'

import { useState } from 'react'
import { CreditCard, Plus, AlertCircle, CheckCircle2 } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Badge } from '@/components/ui/Badge'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { StatCard } from '@/components/ui/StatCard'
import { Button } from '@/components/ui/Button'

type CreditPool = {
  id: string
  name: string
  total: number
  used: number
  remaining: number
  status: string
  expiresAt: string
}

const demoCreditPools: CreditPool[] = [
  { id: 'pool-1', name: 'General Transportation Fund', total: 50, used: 22, remaining: 28, status: 'ACTIVE', expiresAt: '2026-12-31' },
  { id: 'pool-2', name: 'Wheelchair-Accessible Fund', total: 20, used: 0, remaining: 20, status: 'ACTIVE', expiresAt: '2027-06-30' },
  { id: 'pool-3', name: 'Q3 Community Grant', total: 30, used: 30, remaining: 0, status: 'DEPLETED', expiresAt: '2026-09-30' },
]

export default function PartnerCreditsPage() {
  const [pools] = useState<CreditPool[]>(demoCreditPools)

  const totalCredits = pools.reduce((sum, p) => sum + p.total, 0)
  const usedCredits = pools.reduce((sum, p) => sum + p.used, 0)

  return (
    <DashboardLayout role="partner" title="Credits" subtitle="Manage your ride credit pools" userName="Partner">
      <div className="cp-space-y-4">
        <section style={{ borderRadius: 16, padding: 20, background: 'linear-gradient(135deg, #d97706, #92400e)', color: '#fff' }}>
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#fef3c7', marginBottom: 6 }}>Credit management</p>
          <h2 style={{ fontSize: 20, fontWeight: 800 }}>Allocate and track your transportation credits.</h2>
        </section>

        <div className="cp-grid-3">
          <StatCard label="Total Credits" value={totalCredits} icon={CreditCard} color="blue" />
          <StatCard label="Used" value={usedCredits} icon={CheckCircle2} color="teal" />
          <StatCard label="Remaining" value={totalCredits - usedCredits} icon={Plus} color="purple" />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button>+ Add Credit Pool</Button>
        </div>

        <Card>
          <CardHeader><CardTitle>Credit Pools</CardTitle></CardHeader>
          <div className="cp-space-y-3">
            {pools.map(pool => (
              <div key={pool.id} style={{ border: '1.5px solid #e2e8f0', borderRadius: 12, padding: 16, background: '#fff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                  <p style={{ fontWeight: 700, fontSize: 15, color: '#0f172a', margin: 0 }}>{pool.name}</p>
                  <Badge variant={pool.status === 'ACTIVE' ? 'success' : 'error'}>{pool.status}</Badge>
                </div>
                <div style={{ marginTop: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#64748b', marginBottom: 4 }}>
                    <span>{pool.remaining} of {pool.total} remaining</span>
                    <span>{Math.round((pool.used / pool.total) * 100)}% used</span>
                  </div>
                  <div style={{ width: '100%', height: 8, borderRadius: 99, background: '#e2e8f0', overflow: 'hidden' }}>
                    <div style={{ width: `${(pool.used / pool.total) * 100}%`, height: '100%', borderRadius: 99, background: pool.status === 'ACTIVE' ? '#1b9c86' : '#ef4444' }} />
                  </div>
                </div>
                <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 8 }}>Expires: {pool.expiresAt}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}

