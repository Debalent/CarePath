'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Send, MessageSquare, Loader2 } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'

export type Message = {
  id: string
  channel: string
  direction: string
  message: string | null
  status: string | null
  relatedId: string | null
  createdAt: string
  user: { firstName: string; lastName: string; role: string } | null
}

export interface RideMessageThreadProps {
  rideId?: string
  token?: string
  apiBase?: string
  role: string
  demoMessages?: Message[]
  onSendMessage?: (message: string) => void
}

const roleColors: Record<string, string> = {
  PATIENT: '#1b9c86',
  DRIVER: '#0c6bc2',
  COORDINATOR: '#5540a1',
  ADMIN: '#052b56',
  ADVOCATE: '#b62ea1',
  PARTNER: '#d97706',
}

export function RideMessageThread({ rideId, token, apiBase = 'http://localhost:3001/api', role, demoMessages, onSendMessage }: RideMessageThreadProps) {
  const [messages, setMessages] = useState<Message[]>(demoMessages ?? [])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mode, setMode] = useState<'demo' | 'live'>(demoMessages ? 'demo' : 'live')
  const scrollRef = useRef<HTMLDivElement>(null)

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }

  const loadMessages = useCallback(async () => {
    if (!rideId || !token) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${apiBase}/communication-logs/ride/${rideId}`, { headers, cache: 'no-store' })
      if (!res.ok) throw new Error(`Failed to load messages (${res.status})`)
      const data = await res.json()
      setMessages(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load messages')
    } finally {
      setLoading(false)
    }
  }, [rideId, token, apiBase])

  useEffect(() => {
    if (mode === 'live' && rideId && token) {
      loadMessages()
    }
  }, [rideId, token, mode, loadMessages])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const sendMessage = useCallback(async () => {
    const msg = newMessage.trim()
    if (!msg) return

    if (mode === 'demo') {
      const demoMsg: Message = {
        id: `msg-${Date.now()}`,
        channel: 'portal',
        direction: 'outbound',
        message: msg,
        status: 'sent',
        relatedId: rideId ?? null,
        createdAt: new Date().toISOString(),
        user: { firstName: 'You', lastName: '', role: role.toUpperCase() },
      }
      setMessages(prev => [...prev, demoMsg])
      setNewMessage('')
      if (onSendMessage) onSendMessage(msg)
      return
    }

    if (!token || !rideId) {
      setError('Token and ride ID required for live mode')
      return
    }

    setSending(true)
    setError(null)
    try {
      const res = await fetch(`${apiBase}/communication-logs/portal-message`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ rideId, message: msg, channel: 'portal' }),
      })
      if (!res.ok) throw new Error(`Failed to send (${res.status})`)
      await loadMessages()
      setNewMessage('')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to send message')
    } finally {
      setSending(false)
    }
  }, [newMessage, mode, rideId, token, apiBase, headers, onSendMessage, loadMessages])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatTime = (iso: string) => {
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return iso
    return d.toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Mode toggle (if demo messages are available) */}
      {demoMessages && (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Badge variant={mode === 'live' ? 'success' : 'warning'}>{mode === 'live' ? 'Live' : 'Demo'}</Badge>
          <button
            onClick={() => { setMode('demo'); setMessages(demoMessages ?? []) }}
            style={{
              padding: '4px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600,
              border: '1px solid #e2e8f0', background: mode === 'demo' ? '#f1f5f9' : '#fff',
              cursor: 'pointer', color: '#374151',
            }}
          >
            Demo
          </button>
          <button
            onClick={() => { setMode('live'); if (rideId && token) loadMessages() }}
            style={{
              padding: '4px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600,
              border: '1px solid #e2e8f0', background: mode === 'live' ? '#f1f5f9' : '#fff',
              cursor: 'pointer', color: '#374151',
            }}
          >
            Live
          </button>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ padding: '10px 14px', borderRadius: 10, background: '#fef2f2', color: '#991b1b', fontSize: 13, border: '1px solid #fecaca' }}>
          {error}
        </div>
      )}

      {/* Message list */}
      <div
        ref={scrollRef}
        style={{
          maxHeight: 400,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          padding: '12px',
          borderRadius: 12,
          border: '1px solid #e2e8f0',
          background: '#fafafa',
        }}
      >
        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 24, color: '#64748b', fontSize: 14 }}>
            <Loader2 size={16} className="animate-spin" />
            Loading messages...
          </div>
        )}

        {!loading && messages.length === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: 32, color: '#94a3b8' }}>
            <MessageSquare size={28} />
            <p style={{ fontSize: 14 }}>No messages yet. Start the conversation.</p>
          </div>
        )}

        {messages.map((msg) => {
          const msgRole = msg.user?.role ?? role.toUpperCase()
          const accent = roleColors[msgRole] ?? '#64748b'
          const isOutbound = msg.direction === 'outbound'

          return (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: isOutbound ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
                alignSelf: isOutbound ? 'flex-end' : 'flex-start',
              }}
            >
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: 12,
                  background: isOutbound ? accent + '15' : '#ffffff',
                  border: `1px solid ${isOutbound ? accent + '30' : '#e2e8f0'}`,
                  color: '#0f172a',
                  fontSize: 14,
                  lineHeight: 1.5,
                }}
              >
                <p style={{ margin: 0 }}>{msg.message ?? '(no content)'}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4, fontSize: 11, color: '#94a3b8' }}>
                {msg.user && (
                  <span style={{ fontWeight: 600, color: accent }}>
                    {msg.user.firstName} {msg.user.lastName} ({msgRole})
                  </span>
                )}
                <span>·</span>
                <span>{formatTime(msg.createdAt)}</span>
                {msg.status && <span>· {msg.status}</span>}
              </div>
            </div>
          )
        })}
      </div>

      {/* Input */}
      <div style={{ display: 'flex', gap: 8 }}>
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message... (Enter to send, Shift+Enter for new line)"
          rows={2}
          style={{
            flex: 1,
            padding: '10px 14px',
            borderRadius: 10,
            border: '1.5px solid #e2e8f0',
            fontSize: 14,
            fontFamily: 'inherit',
            outline: 'none',
            resize: 'none',
            minHeight: 44,
          }}
          disabled={sending}
        />
        <button
          onClick={sendMessage}
          disabled={!newMessage.trim() || sending}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 44,
            height: 44,
            borderRadius: 10,
            border: 'none',
            background: newMessage.trim() ? '#5540a1' : '#e2e8f0',
            color: '#fff',
            cursor: newMessage.trim() ? 'pointer' : 'not-allowed',
            flexShrink: 0,
          }}
        >
          {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
        </button>
      </div>
    </div>
  )
}

