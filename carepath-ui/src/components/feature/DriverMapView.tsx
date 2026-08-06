'use client'

import dynamic from 'next/dynamic'
import { type LatLngExpression } from 'leaflet'
import 'leaflet/dist/leaflet.css'

type DriverMapViewProps = {
  currentLocation: { lat: number; lng: number } | null
  destinationLocation: { lat: number; lng: number } | null
  accent: string
}

const MapContainer = dynamic(
  async () => (await import('react-leaflet')).MapContainer,
  { ssr: false },
)
const TileLayer = dynamic(
  async () => (await import('react-leaflet')).TileLayer,
  { ssr: false },
)
const CircleMarker = dynamic(
  async () => (await import('react-leaflet')).CircleMarker,
  { ssr: false },
)
const Polyline = dynamic(
  async () => (await import('react-leaflet')).Polyline,
  { ssr: false },
)

export function DriverMapView({ currentLocation, destinationLocation, accent }: DriverMapViewProps) {
  const fallback = destinationLocation ?? { lat: 41.8781, lng: -87.6298 }
  const center: LatLngExpression = [currentLocation?.lat ?? fallback.lat, currentLocation?.lng ?? fallback.lng]

  return (
    <div style={{ height: 280, borderRadius: 16, overflow: 'hidden', border: '1px solid #dbeafe' }}>
      <MapContainer center={center} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {currentLocation ? (
          <CircleMarker
            center={[currentLocation.lat, currentLocation.lng]}
            pathOptions={{ color: accent, fillColor: accent, fillOpacity: 0.95 }}
            radius={8}
          />
        ) : null}
        {destinationLocation ? (
          <CircleMarker
            center={[destinationLocation.lat, destinationLocation.lng]}
            pathOptions={{ color: '#a10e97', fillColor: '#a10e97', fillOpacity: 0.95 }}
            radius={8}
          />
        ) : null}
        {currentLocation && destinationLocation ? (
          <Polyline
            positions={[[currentLocation.lat, currentLocation.lng], [destinationLocation.lat, destinationLocation.lng]]}
            pathOptions={{ color: accent, weight: 3, opacity: 0.7, dashArray: '6 4' }}
          />
        ) : null}
      </MapContainer>
    </div>
  )
}
