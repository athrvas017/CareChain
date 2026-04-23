import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import styles from './HotspotMap.module.css';

// Component to handle map view centering
const SetViewOnClick = ({ coords }) => {
  const map = useMap();
  map.setView(coords, map.getZoom());
  return null;
};

const HotspotMap = ({ hotspots }) => {
  const mhCenter = [19.75, 75.71]; // Center of Maharashtra

  return (
    <div className={styles.mapWrapper}>
      <MapContainer 
        center={mhCenter} 
        zoom={6} 
        scrollWheelZoom={false} 
        className={styles.mapContainer}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {hotspots.map((h, idx) => {
          const getUrgency = (score) => {
            if (score > 0.75) return { color: '#ef4444', label: 'Critical Assistance Required', icon: '🔥' };
            if (score > 0.5) return { color: '#f97316', label: 'High Urgency', icon: '⚠️' };
            if (score > 0.25) return { color: '#eab308', label: 'Moderate Need', icon: '⚖️' };
            return { color: '#6366f1', label: 'Monitoring Needed', icon: '🔵' };
          };
          const urgency = getUrgency(h.hotspot_score);

          return (
            <CircleMarker
              key={idx}
              center={[h.lat, h.lng]}
              pathOptions={{ 
                color: urgency.color,
                fillColor: urgency.color,
                fillOpacity: 0.6
              }}
              radius={10 + (h.hotspot_score * 15)}
            >
              <Popup className={styles.popup}>
                <div className={styles.popupContent}>
                  <h4 style={{margin: '0 0 8px', fontSize: '1rem'}}>{h.title}</h4>
                  <p style={{margin: '4px 0', fontSize: '0.85rem'}}><strong>Region:</strong> {h.city}</p>
                  <p style={{margin: '4px 0', fontSize: '0.85rem'}}><strong>Impact Score:</strong> {Math.round(h.hotspot_score * 100)}/100</p>
                  <div className={styles.popupStatus} style={{
                    marginTop: '12px', 
                    padding: '8px', 
                    borderRadius: '8px', 
                    background: `${urgency.color}15`, 
                    color: urgency.color,
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    textAlign: 'center'
                  }}>
                    {urgency.icon} {urgency.label}
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default HotspotMap;
