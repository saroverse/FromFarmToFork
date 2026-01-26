import { useState, useEffect } from 'react';
import { Coordinates } from '../types';

export const useGeolocation = () => {
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setError("Geolocation not supported");
      // Default location (Maastricht)
      setLocation({ latitude: 50.8514, longitude: 5.6910 });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (err) => {
        console.log("Location access denied or error:", err);
        setError(err.message);
        // Default location (Maastricht)
        setLocation({ latitude: 50.8514, longitude: 5.6910 }); 
      }
    );
  }, []);

  return { location, error };
};