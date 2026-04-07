import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default marker icon broken in Vite/Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom accent-colored marker
const accentIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Helper to geocode a place name via Nominatim (OpenStreetMap, free, no key needed)
async function geocode(query) {
  if (!query) return null;
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`,
      { headers: { 'Accept-Language': 'en' } }
    );
    const data = await res.json();
    if (data && data.length > 0) {
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon), name: data[0].display_name };
    }
  } catch (e) {
    // Silently fail if geocoding fails
  }
  return null;
}

// Component to programmatically fly the map to a new center
function FlyToCenter({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 12, { duration: 1.5 });
    }
  }, [center, map]);
  return null;
}

const TripMap = ({ trip, currentDay }) => {
  const [markers, setMarkers] = useState([]);
  const [mapCenter, setMapCenter] = useState([20, 0]); // Default world center
  const [isLoading, setIsLoading] = useState(true);
  const geocacheRef = useRef({});

  // Geocode the trip destination for the initial map center
  useEffect(() => {
    if (!trip?.destination) return;

    const dest = trip.destination;
    if (geocacheRef.current[dest]) {
      setMapCenter([geocacheRef.current[dest].lat, geocacheRef.current[dest].lng]);
      setIsLoading(false);
      return;
    }

    geocode(dest).then(coords => {
      if (coords) {
        geocacheRef.current[dest] = coords;
        setMapCenter([coords.lat, coords.lng]);
      }
      setIsLoading(false);
    });
  }, [trip?.destination]);

  // Geocode all activities in the current day
  useEffect(() => {
    if (!currentDay || !currentDay.activities || currentDay.activities.length === 0) {
      setMarkers([]);
      return;
    }

    const activities = currentDay.activities.filter(a => a.location);
    if (activities.length === 0) {
      setMarkers([]);
      return;
    }

    let cancelled = false;

    const geocodeAll = async () => {
      const results = [];
      for (const activity of activities) {
        const queryKey = `${activity.location},${trip?.destination || ''}`;
        let coords = geocacheRef.current[queryKey];
        if (!coords) {
          coords = await geocode(`${activity.location}, ${trip?.destination || ''}`);
          if (coords) geocacheRef.current[queryKey] = coords;
        }
        if (coords) {
          results.push({ ...coords, title: activity.title, time: activity.time, location: activity.location, estimatedCost: activity.estimatedCost });
        }
      }
      if (!cancelled) {
        setMarkers(results);
        // If we have markers, pan to the first one
        if (results.length > 0) {
          setMapCenter([results[0].lat, results[0].lng]);
        }
      }
    };

    geocodeAll();
    return () => { cancelled = true; };
  }, [currentDay, trip?.destination]);

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-st-secondary rounded-[3.5rem]">
          <div className="w-8 h-8 border-4 border-st-accent/30 border-t-st-accent rounded-full animate-spin mb-3" />
          <p className="text-[10px] font-black uppercase tracking-widest text-st-charcoal/40">Syncing coordinates…</p>
        </div>
      )}

      <MapContainer
        center={mapCenter}
        zoom={12}
        scrollWheelZoom={true}
        style={{ width: '100%', height: '100%', borderRadius: '3.5rem' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FlyToCenter center={mapCenter} />

        {markers.map((marker, idx) => (
          <Marker key={idx} position={[marker.lat, marker.lng]} icon={accentIcon}>
            <Popup>
              <div style={{ fontFamily: 'inherit', minWidth: '140px' }}>
                <p style={{ fontWeight: 900, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
                  {marker.title}
                </p>
                {marker.time && (
                  <p style={{ fontSize: '11px', color: '#666', marginBottom: '2px' }}>🕐 {marker.time}</p>
                )}
                <p style={{ fontSize: '11px', color: '#666', marginBottom: '2px' }}>📍 {marker.location}</p>
                {marker.estimatedCost > 0 && (
                  <p style={{ fontSize: '11px', color: '#666' }}>💰 Est. ${marker.estimatedCost}</p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Overlay label */}
      <div className="absolute bottom-6 left-6 z-[400] bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-lg pointer-events-none">
        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-st-charcoal/50">Geographic Ledger</p>
        <p className="text-[10px] font-black text-st-charcoal">
          Day {currentDay?.day || '--'} · {markers.length} location{markers.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* No locations notice */}
      {!isLoading && markers.length === 0 && currentDay?.activities?.length > 0 && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[400] bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow pointer-events-none">
          <p className="text-[9px] font-black uppercase tracking-widest text-st-charcoal/50 text-center">Add locations to activities to see pins</p>
        </div>
      )}
    </div>
  );
};

export default TripMap;
