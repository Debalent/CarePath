'use client'

import Link from 'next/link'
import {
  BarChart3,
  Building2,
  CreditCard,
  LayoutDashboard,
  TrendingUp,
  Users,
} from 'lucide-react'

import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { StatCard } from '@/components/ui/StatCard'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'

export default function AdminDashboardPage() {
  return (
    <DashboardLayout
      role="admin"
      title="Admin Dashboard"
      subtitle="Manage credits, partners, and program performance"
      userName="Admin"
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
        }}
      >
        {/* Welcome banner */}
        <section
          style={{
            borderRadius: 16,
            padding: 30,
            background:
              'linear-gradient( #4f5f92 0%, #6f4c89 100%)',
            boxShadow: '0 10px 24px rgba(79, 95, 146, 0.18)',
          }}
        >
          <p
            style={{
              margin: 0,
              marginBottom: 8,
              color: '#e8eaf6',
              fontSize: 12,
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.18em',
            }}
          >
            Admin Portal
          </p>

          <h2
            style={{
              margin: 0,
              color: '#ffffff',
              fontSize: 26,
              fontWeight: 800,
              lineHeight: 1.35,
            }}
          >
            CarePath administration overview
          </h2>

          <p
            style={{
              maxWidth: 760,
              marginTop: 10,
              marginBottom: 0,
              color: '#edf0f7',
              fontSize: 15,
              lineHeight: 1.6,
            }}
          >
            Review ride-credit activity, partner participation, and program
            performance from one place.
          </p>
        </section>

        {/* Stats */}
        <div className="cp-grid-3">
          <StatCard
            label="Active Credit Pools"
            value={1}
            icon={CreditCard}
            color="purple"
          />

          <StatCard
            label="Credits Remaining"
            value={66}
            icon={TrendingUp}
            color="blue"
          />

          <StatCard
            label="Active Partners"
            value={2}
            icon={Building2}
            color="teal"
          />
        </div>

        {/* Quick actions */}
        <section
          style={{
            display: 'grid',
            gap: 20,
            gridTemplateColumns:
              'repeat(auto-fit, minmax(220px, 1fr))',
          }}
        >
          <Link
            href="/admin/credits"
            style={{
              display: 'block',
              padding: 24,
              borderRadius: 14,
              border: '1px solid #e2e8f0',
              background: '#ffffff',
              textDecoration: 'none',
              boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 48,
                height: 48,
                borderRadius: 12,
                background: '#eee4f4',
                color: '#6f4c89',
                marginBottom: 16,
              }}
            >
              <CreditCard size={26} />
            </div>

            <h3
              style={{
                margin: 0,
                marginBottom: 8,
                color: '#0f172a',
                fontSize: 18,
                fontWeight: 800,
              }}
            >
              Credits
            </h3>

            <p
              style={{
                margin: 0,
                color: '#64748b',
                fontSize: 14,
                lineHeight: 1.55,
              }}
            >
              Review credit pools, balances, and partner allocations.
            </p>
          </Link>

          <Link
            href="/admin/roi"
            style={{
              display: 'block',
              padding: 24,
              borderRadius: 14,
              border: '1px solid #e2e8f0',
              background: '#ffffff',
              textDecoration: 'none',
              boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 48,
                height: 48,
                borderRadius: 12,
                background: '#e4edf8',
                color: '#456b9f',
                marginBottom: 16,
              }}
            >
              <BarChart3 size={26} />
            </div>

            <h3
              style={{
                margin: 0,
                marginBottom: 8,
                color: '#0f172a',
                fontSize: 18,
                fontWeight: 800,
              }}
            >
              Cost & ROI
            </h3>

            <p
              style={{
                margin: 0,
                color: '#64748b',
                fontSize: 14,
                lineHeight: 1.55,
              }}
            >
              Review program costs and transportation impact.
            </p>
          </Link>

          <Link
            href="/admin/partners"
            style={{
              display: 'block',
              padding: 24,
              borderRadius: 14,
              border: '1px solid #e2e8f0',
              background: '#ffffff',
              textDecoration: 'none',
              boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 48,
                height: 48,
                borderRadius: 12,
                background: '#e3f2ef',
                color: '#2c8276',
                marginBottom: 16,
              }}
            >
              <Users size={26} />
            </div>

            <h3
              style={{
                margin: 0,
                marginBottom: 8,
                color: '#0f172a',
                fontSize: 18,
                fontWeight: 800,
              }}
            >
              Partners
            </h3>

            <p
              style={{
                margin: 0,
                color: '#64748b',
                fontSize: 14,
                lineHeight: 1.55,
              }}
            >
              Review institutional partners and verification status.
            </p>
          </Link>
        </section>

        {/* Program summary */}
        <Card>
          <CardHeader>
            <CardTitle>Program Summary</CardTitle>
          </CardHeader>

          <div className="cp-space-y-3">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 16,
                padding: '14px 16px',
                borderRadius: 10,
                border: '1px solid #e2e8f0',
                background: '#ffffff',
              }}
            >
              <div>
                <p
                  style={{
                    margin: 0,
                    fontSize: 14,
                    fontWeight: 700,
                    color: '#0f172a',
                  }}
                >
                  Ride Credit Program
                </p>

                <p
                  style={{
                    margin: '4px 0 0',
                    fontSize: 12,
                    color: '#64748b',
                  }}
                >
                  Institutional transportation funding
                </p>
              </div>

              <div
                style={{
                  textAlign: 'right',
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: 16,
                    fontWeight: 800,
                    color: '#6f4c89',
                  }}
                >
                  66 credits
                </p>

                <p
                  style={{
                    margin: '2px 0 0',
                    fontSize: 12,
                    color: '#64748b',
                  }}
                >
                  currently available
                </p>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 16,
                padding: '14px 16px',
                borderRadius: 10,
                border: '1px solid #e2e8f0',
                background: '#ffffff',
              }}
            >
              <div>
                <p
                  style={{
                    margin: 0,
                    fontSize: 14,
                    fontWeight: 700,
                    color: '#0f172a',
                  }}
                >
                  Partner Verification
                </p>

                <p
                  style={{
                    margin: '4px 0 0',
                    fontSize: 12,
                    color: '#64748b',
                  }}
                >
                  Organizations awaiting review
                </p>
              </div>

              <div
                style={{
                  textAlign: 'right',
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: 16,
                    fontWeight: 800,
                    color: '#d97706',
                  }}
                >
                  1 pending
                </p>

                <p
                  style={{
                    margin: '2px 0 0',
                    fontSize: 12,
                    color: '#64748b',
                  }}
                >
                  verification needed
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}