import { GpsFeaturePanel } from '@/components/feature/GpsFeaturePanel'

export default function CoordinatorTrackingPage() {
  return (
    <GpsFeaturePanel
      role="coordinator"
      title="Care-team tracking"
      subtitle="Monitor active rides, route status, and handoff updates for coordinators and dispatch teams."
    />
  )
}
