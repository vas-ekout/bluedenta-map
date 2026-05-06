import { useEffect, useState } from 'react';

import { Typography } from '@mui/material';
import { Marker, Popup } from 'react-map-gl';

import MarkerIcon from '@/assets/marker.svg?react';

export const MapItem = ({ isSelected, location }) => {
  const [showPopup, setShowPopup] = useState<boolean>(false);

  // Sync popup visibility with external selection state
  useEffect(() => {
    if (isSelected) {
      setShowPopup(true);
    } else {
      setShowPopup(false);
    }
  }, [isSelected]);

  const handleClick = () => {
    setShowPopup(!showPopup);
  };

  return (
    <Marker
      key={location.latitude + location.longitude}
      longitude={location.longitude}
      latitude={location.latitude}
      anchor="bottom"
      onClick={handleClick}
    >
      <MarkerIcon />
      {showPopup && (
        <Popup
          latitude={location.latitude}
          longitude={location.longitude}
          offset={50}
          closeButton={false}
          closeOnClick={false}
        >
          <Typography fontWeight={800}>{location?.displayName}</Typography>
          <Typography>
            {location?.street} {location?.streetNumber}
          </Typography>
          <Typography>
            {location?.postalCode} {location?.city}
          </Typography>
        </Popup>
      )}
    </Marker>
  );
};
