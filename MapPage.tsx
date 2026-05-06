import { useEffect, useRef, useState } from 'react';

import { GeolocateControl, Map } from 'react-map-gl';

import { MapItem } from './MapItem';
import 'mapbox-gl/dist/mapbox-gl.css';

import MarkerIcon from '@/assets/marker.svg?react';

export interface locationProps {
  displayName: string;
  street: string;
  streetNumber: string;
  postalCode: string;
  city: string;
  latitude: number;
  longitude: number;
  zoom?: number;
}

interface MapPageProps {
  locations?: locationProps[];
  selectedLocation?: locationProps;
}

const initialViewStateEurope = {
  longitude: 12,
  latitude: 52,
  zoom: 4,
};

export const MapPage = ({ locations, selectedLocation }: MapPageProps) => {
  const [viewState, setViewState] = useState(selectedLocation || initialViewStateEurope);
  const [currentMapSection, setCurrentMapSection] = useState({});
  const mapRef = useRef<Map | null>(null);

  // Fly to selected location smoothly using Mapbox's flyTo method
  useEffect(() => {
    if (selectedLocation && mapRef.current) {
      const map = mapRef.current.getMap();
      map.flyTo({
        center: [selectedLocation.longitude, selectedLocation.latitude],
        zoom: selectedLocation.zoom || 16,
        essential: true,
      });
    }
  }, [selectedLocation]);

  const getCurrentMapSection = (e) => {
    setCurrentMapSection({
      longitude: e.target.style.map.transform._center.lng,
      latitude: e.target.style.map.transform._center.lat,
      zoom: e.target.style.z,
      mapWidth: e.target.style.map.transform.width,
      mapHeight: e.target.style.map.transform.height,
    });
  };

  // Calculate whether a location is within the current map viewport
  // using degrees-per-pixel based on zoom level
  const isLocationInView = (location, map) => {
    const dpp = 360 / (512 * Math.pow(2, map.zoom));

    const lonMin = map.longitude - (map.mapWidth / 2) * dpp;
    const lonMax = map.longitude + (map.mapWidth / 2) * dpp;
    const latMin = map.latitude - (map.mapHeight / 2) * dpp;
    const latMax = map.latitude + (map.mapHeight / 2) * dpp;

    return (
      location.longitude >= lonMin &&
      location.longitude <= lonMax &&
      location.latitude >= latMin &&
      location.latitude <= latMax
    );
  };

  // Only render markers that are within the current viewport (and only past zoom level 8)
  const filteredLocations = locations?.filter((location) => {
    if (viewState.zoom && viewState.zoom > 8) {
      return isLocationInView(location, currentMapSection);
    } else {
      return null;
    }
  });

  return (
    <Map
      {...viewState}
      onMove={(evt) => setViewState(evt.viewState)}
      mapboxAccessToken={import.meta.env.VITE_BLUEDENTA_MAPBOX_TOKEN}
      mapStyle="mapbox://styles/mapbox/streets-v9"
      mapLib={import('mapbox-gl')}
      style={{ maxWidth: '100%' }}
      dragRotate={false}
      onIdle={(e) => getCurrentMapSection(e)}
      ref={mapRef}
    >
      {filteredLocations?.map((location) => (
        <MapItem
          key={location.displayName}
          location={location}
          isSelected={selectedLocation?.displayName === location.displayName}
        />
      ))}

      <GeolocateControl />
    </Map>
  );
};
