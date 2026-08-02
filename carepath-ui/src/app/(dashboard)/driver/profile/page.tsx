'use client'

import { FormEvent, useEffect, useState } from 'react'
import { AlertCircle, CheckCircle2, Car } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'

const DEFAULT_API_BASE = process.env.NEXT_PUBLIC_CAREPATH_API_URL ?? 'http://localhost:3001/api'

type Form = {
  county: string
  state: string
  vehicleCapacity: number
  isInFallbackPool: boolean
  isAvailableNow: boolean
  maxMilesOneWay: number
  isWheelchairAccessible: boolean
  preferredDays: string
  communityNotes: string
  providerType: string
  acceptsCreditCard: boolean
  acceptsMedicaid: boolean
  acceptsGrantPay: boolean
  perMileRateCents: number
  baseFeeCents: number
}

const initial: Form = {
  county: '',
  state: 'AR',
  vehicleCapacity: 4,
  isInFallbackPool: false,
  isAvailableNow: false,
  maxMilesOneWay: 25,
  isWheelchairAccessible: false,
  preferredDays: '',
  communityNotes: '',
  providerType: '',
  acceptsCreditCard: false,
  acceptsMedicaid: false,
  acceptsGrantPay: false,
  perMileRateCents: 0,
  baseFeeCents: 0,
}

export default function DriverProfilePage() {
  const [mode, setMode] = useState<'demo' | 'live'>('demo')
  const [apiBase, setApiBase] = useState(DEFAULT_API_BASE)
  const [token, setToken] = useState('')
  const [form, setForm] = useState<Form>(initial)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const set = (p: Partial<Form>) => setForm(prev => ({ ...prev, ...p }))
  const headers = { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }

  useEffect(() => { const t = localStorage.getItem('carepath.driver.token'); if (t) setToken(t) }, [])

  const load = async () => {
    if (mode === 'demo') {
      setForm({
        county: 'Pulaski',
        state: 'AR',
        vehicleCapacity: 4,
        isInFallbackPool: true,
        isAvailableNow: true,
        maxMilesOneWay: 30,
        isWheelchairAccessible: true,
        preferredDays: 'Mon,Tue,Wed,Thu,Fri',
        communityNotes: 'Familiar with downtown Little Rock medical district.',
        providerType: 'Independent',
        acceptsCreditCard: true,
        acceptsMedicaid: true,
        acceptsGrantPay: true,
        perMileRateCents: 150,
        baseFeeCents: 500,
      })
      setResult('Demo profile loaded.')
      return
    }
    if (!token) { setError('Driver JWT token required.'); return }
    try {
      const res = await fetch(`${apiBase}/drivers/profile`, { headers })
      if (!res.ok) throw new Error(`Load failed (${res.status})`)
      const d = await res.json()
      setForm({
        county: d.county ?? '',
        state: d.state ?? 'AR',
        vehicleCapacity: d.vehicleCapacity ?? 4,
        isInFallbackPool: d.isInFallbackPool ?? false,
        isAvailableNow: d.isAvailableNow ?? false,
        maxMilesOneWay: d.maxMilesOneWay ?? 25,
        isWheelchairAccessible: d.isWheelchairAccessible ?? false,
        preferredDays: d.preferredDays ?? '',
        communityNotes: d.communityNotes ?? '',
        providerType: d.providerType ?? '',
        acceptsCreditCard: d.acceptsCreditCard ?? false,
        acceptsMedicaid: d.acceptsMedicaid ?? false,
        acceptsGrantPay: d.acceptsGrantPay ?? false,
        perMileRateCents: d.perMileRateCents ?? 0,
        baseFeeCents: d.baseFeeCents ?? 0,
      })
      setResult('Profile loaded.')
    } catch (e) { setError(e instanceof Error ? e.message : 'Failed to load.') }
  }

  const save = async (e: FormEvent) => {
    e.preventDefault(); setError(null); setResult(null)
    if (mode === 'demo') { setResult('Demo: profile saved.'); return }
    if (!token) { setError('Token required.'); return }
    setSaving(true)
    try {
      const res = await fetch(`${apiBase}/drivers/profile`, { method: 'PUT', headers, body: JSON.stringify(form) })
      if (!res.ok) throw new Error(`Save failed (${res.status})`)
      setResult('Profile saved successfully.')
    } catch (e) { setError(e instanceof Error ? e.message : 'Failed to save.') }
    finally { setSaving(false) }
  }

  return (
    <DashboardLayout role="driver" title="My Profile" subtitle="Vehicle, availability, and payment preferences" userName="Driver">
      <div className="cp-space-y-4">
        <section style={{ borderRadius: 16, padding: 20, background: 'linear-gradient(135deg, #0f766e, #0369a1)', color: '#fff' }}>
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#a5f3fc', marginBottom: 6 }}>Driver profile</p>
          <h2 style={{ fontSize: 20, fontWeight: 800 }}>Keep your vehicle, service area, and availability up to date.</h2>
        </section>

        <Card>
          <div className="cp-space-y-3">
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              <Badge variant={mode === 'live' ? 'success' : 'warning'}>{mode === 'live' ? 'Live' : 'Demo'}</Badge>
              <Button size="sm" variant="secondary" onClick={() => setMode('demo')}>Demo</Button>
              <Button size="sm" onClick={() => setMode('live')}>Live</Button>
            </div>
            <input value={apiBase} onChange={e => setApiBase(e.target.value)} placeholder="API base URL" className="cp-input" />
            <input value={token} onChange={e => setToken(e.target.value)} placeholder="Driver JWT token" className="cp-input" />
            <div style={{ display: 'flex', gap: 8 }}>
              <Button size="sm" variant="secondary" onClick={() => { const t = localStorage.getItem('carepath.driver.token'); if (t) { setToken(t); setResult('Token loaded.') } }}>Load token</Button>
              <Button size="sm" onClick={() => { localStorage.setItem('carepath.driver.token', token); setResult('Token saved.') }}>Save token</Button>
              <Button size="sm" variant="secondary" onClick={load}>Load profile</Button>
            </div>
          </div>
        </Card>

        {result && <div className="cp-alert cp-alert-success"><CheckCircle2 size={16} />{result}</div>}
        {error && <div className="cp-alert cp-alert-error"><AlertCircle size={16} />{error}</div>}

        <Card>
          <CardHeader>
            <CardTitle><Car size={16} style={{ display: 'inline', marginRight: 8 }} />Profile setup</CardTitle>
          </CardHeader>
          <form className="cp-space-y-4" onSubmit={save}>
            <div className="cp-grid-2">
              <div><label className="cp-label">County</label><input value={form.county} onChange={e => set({ county: e.target.value })} className="cp-input" /></div>
              <div><label className="cp-label">State</label><input value={form.state} onChange={e => set({ state: e.target.value })} className="cp-input" /></div>
            </div>
            <div className="cp-grid-2">
              <div><label className="cp-label">Vehicle capacity</label><input type="number" value={form.vehicleCapacity} onChange={e => set({ vehicleCapacity: Number(e.target.value) })} className="cp-input" /></div>
              <div><label className="cp-label">Max miles one-way</label><input type="number" value={form.maxMilesOneWay} onChange={e => set({ maxMilesOneWay: Number(e.target.value) })} className="cp-input" /></div>
            </div>
            <div><label className="cp-label">Provider type</label><input value={form.providerType} onChange={e => set({ providerType: e.target.value })} placeholder="e.g. Independent, Agency" className="cp-input" /></div>
            <div><label className="cp-label">Preferred days</label><input value={form.preferredDays} onChange={e => set({ preferredDays: e.target.value })} placeholder="e.g. Mon,Tue,Wed" className="cp-input" /></div>
            <div><label className="cp-label">Community notes</label><input value={form.communityNotes} onChange={e => set({ communityNotes: e.target.value })} className="cp-input" /></div>
            <div className="cp-grid-2">
              <div><label className="cp-label">Per-mile rate (cents)</label><input type="number" value={form.perMileRateCents} onChange={e => set({ perMileRateCents: Number(e.target.value) })} className="cp-input" /></div>
              <div><label className="cp-label">Base fee (cents)</label><input type="number" value={form.baseFeeCents} onChange={e => set({ baseFeeCents: Number(e.target.value) })} className="cp-input" /></div>
            </div>
            <label className="cp-checkbox-row">
              <input type="checkbox" checked={form.isAvailableNow} onChange={e => set({ isAvailableNow: e.target.checked })} />
              Available now
            </label>
            <label className="cp-checkbox-row">
              <input type="checkbox" checked={form.isInFallbackPool} onChange={e => set({ isInFallbackPool: e.target.checked })} />
              In fallback pool
            </label>
            <label className="cp-checkbox-row">
              <input type="checkbox" checked={form.isWheelchairAccessible} onChange={e => set({ isWheelchairAccessible: e.target.checked })} />
              Wheelchair accessible
            </label>
            <label className="cp-checkbox-row">
              <input type="checkbox" checked={form.acceptsCreditCard} onChange={e => set({ acceptsCreditCard: e.target.checked })} />
              Accepts credit card
            </label>
            <label className="cp-checkbox-row">
              <input type="checkbox" checked={form.acceptsMedicaid} onChange={e => set({ acceptsMedicaid: e.target.checked })} />
              Accepts Medicaid
            </label>
            <label className="cp-checkbox-row">
              <input type="checkbox" checked={form.acceptsGrantPay} onChange={e => set({ acceptsGrantPay: e.target.checked })} />
              Accepts grant pay
            </label>
            <Button type="submit" disabled={saving} className="cp-btn-full">{saving ? 'Saving…' : 'Save profile'}</Button>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  )
}
