"use client";

import React from "react";
import { showError } from "@/utils/toast";

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
}

export function useGeolocation(): GeolocationState {
  const [state, setState] = React.useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: true,
  });

  React.useEffect(() => {
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        error: "Geolocation tidak didukung oleh browser Anda.",
        loading: false,
      }));
      showError("Geolocation tidak didukung oleh browser Anda.");
      return;
    }

    const onSuccess = (position: GeolocationPosition) => {
      setState({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        error: null,
        loading: false,
      });
    };

    const onError = (geoError: GeolocationPositionError) => {
      let errorMessage = "Gagal mendapatkan lokasi Anda.";
      switch (geoError.code) {
        case geoError.PERMISSION_DENIED:
          errorMessage = "Izin lokasi ditolak. Harap izinkan akses lokasi di pengaturan browser Anda.";
          break;
        case geoError.POSITION_UNAVAILABLE:
          errorMessage = "Informasi lokasi tidak tersedia.";
          break;
        case geoError.TIMEOUT:
          errorMessage = "Waktu permintaan lokasi habis.";
          break;
        default:
          errorMessage = `Terjadi kesalahan yang tidak diketahui: ${geoError.message}`;
          break;
      }
      setState((prev) => ({ ...prev, error: errorMessage, loading: false }));
      showError(errorMessage);
    };

    setState((prev) => ({ ...prev, loading: true }));
    const watchId = navigator.geolocation.watchPosition(onSuccess, onError, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    });

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  return state;
}