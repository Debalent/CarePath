'use client'

import Link from 'next/link'
import { Bell, Home, Menu } from 'lucide-react'

interface TopbarProps {
  title: string
  subtitle?: string
  onMenuClick?: () => void
}

export function Topbar({ title, subtitle, onMenuClick }: TopbarProps) {
  return (
    <header className="cp-topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={onMenuClick} className="cp-menu-btn">
          <Menu size={20} />
        </button>
        <Link
          href="/"
          title="Return to CarePath home page"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 32,
            height: 32,
            borderRadius: 8,
            border: 'none',
            background: '#f1f5f9',
            color: '#64748b',
            cursor: 'pointer',
            flexShrink: 0,
            textDecoration: 'none',
            transition: 'background 0.15s, color 0.15s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#e2e8f0';
            e.currentTarget.style.color = '#0f172a';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#f1f5f9';
            e.currentTarget.style.color = '#64748b';
          }}
        >
          <Home size={18} />
        </Link>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>{title}</h1>
          {subtitle && <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 3 }}>{subtitle}</p>}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button style={{
          position: 'relative', padding: 8, borderRadius: 10, border: 'none',
          background: 'transparent', cursor: 'pointer', color: '#64748b',
        }}>
          <Bell size={20} />
          <span style={{
            position: 'absolute', top: 8, right: 8, width: 8, height: 8,
            borderRadius: '50%', background: '#1b9c86', border: '2px solid #fff',
          }} />
        </button>
      </div>
    </header>
  )
}
