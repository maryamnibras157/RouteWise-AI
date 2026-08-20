'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';

// CSS Circle Pin for 100% offline compatibility (avoids loading image files)
const createOfflinePin = (color: string) => {
  return L.divIcon({
    html: `<div style="background-color: ${color}; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 6px rgba(0,0,0,0.3);"></div>`,
    className: 'custom-offline-pin',
    iconSize: [14, 14],
    iconAnchor: [7, 7],
    popupAnchor: [0, -7]
  });
};

interface MapMarker {
  id: string;
  title: string;
  category: string;
  lat: number;
  lng: number;
  time?: string;
}

interface MapComponentProps {
  centerLat: number;
  centerLng: number;
  zoom?: number;
  markers: MapMarker[];
}

// Helper to handle auto-focus bounds
function ChangeView({ markers, center }: { markers: MapMarker[]; center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    if (markers.length > 0) {
      const group = L.featureGroup(markers.map(m => L.marker([m.lat, m.lng])));
      map.fitBounds(group.getBounds().pad(0.15));
    } else {
      map.setView(center, 12);
    }
  }, [markers, center, map]);
  return null;
}

export default function MapComponent({ centerLat, centerLng, zoom = 12, markers }: MapComponentProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-xs text-slate-400">
        Loading interactive map container...
      </div>
    );
  }

  const center: [number, number] = [centerLat, centerLng];
  const sortedMarkers = [...markers].sort((a, b) => (a.time || '').localeCompare(b.time || ''));
  const polylinePositions = sortedMarkers.map(m => [m.lat, m.lng] as [number, number]);

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom={true}
      className="w-full h-full rounded-lg"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {sortedMarkers.map(marker => {
        const pinColor = marker.category === 'food' ? '#f59e0b' : '#3b82f6';
        return (
          <Marker
            key={marker.id}
            position={[marker.lat, marker.lng]}
            icon={createOfflinePin(pinColor)}
          >
            <Popup>
              <div className="p-1 font-sans">
                <p className="font-bold text-xs text-slate-900">{marker.title}</p>
                <p className="text-[10px] text-slate-500 capitalize mt-0.5">{marker.category}</p>
                {marker.time && <p className="text-[9px] text-blue-600 font-bold mt-1">Scheduled: {marker.time}</p>}
              </div>
            </Popup>
          </Marker>
        );
      })}

      {polylinePositions.length > 1 && (
        <Polyline
          positions={polylinePositions}
          pathOptions={{ color: '#2563eb', weight: 3, dashArray: '6, 6' }}
        />
      )}

      <ChangeView markers={markers} center={center} />
    </MapContainer>
  );
}
