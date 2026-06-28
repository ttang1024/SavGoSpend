import * as Location from 'expo-location';
import { useCallback, useEffect, useRef, useState } from 'react';

import type { Coords } from '@/lib/geo';

/**
 * Where the member's location stands right now:
 * - `off`        — the member hasn't opted in (no request made; Privacy Act default)
 * - `requesting` — asking the OS / fetching a fix
 * - `granted`    — we have a coordinate
 * - `denied`     — opted in, but the OS permission was refused
 * - `unavailable`— no location hardware / fix (e.g. emulator, web fallback)
 */
export type LocationStatus = 'off' | 'requesting' | 'granted' | 'denied' | 'unavailable';

export type NearbyLocation = {
  coords: Coords | null;
  status: LocationStatus;
  /** Re-request a fresh fix (e.g. a "Try again" button after a denial). */
  refresh: () => Promise<void>;
};

/**
 * Development-only origin override. The seeded retailers all sit in Hamilton, so
 * a real GPS fix from anywhere else reads as thousands of km away, making the
 * proximity feature impossible to demo off-site. In dev we therefore pin the
 * origin so distances stay realistic; production builds (`__DEV__ === false`)
 * always use the device's real location and never see this.
 *
 * Defaults to central Hamilton. Point it elsewhere with an `EXPO_PUBLIC_DEV_LOCATION`
 * ("lat,long") entry in `.env`, or set it empty to fall back to real GPS in dev.
 */
function devOrigin(): Coords | null {
  if (!__DEV__) return null;
  // Static dot access is required for Expo to inline the value at build time.
  const raw = process.env.EXPO_PUBLIC_DEV_LOCATION;
  const value = raw === undefined ? '-37.787,175.283' : raw.trim();
  if (!value) return null; // explicit empty string opts back into real GPS
  const [lat, lon] = value.split(',').map((part) => Number(part.trim()));
  return Number.isFinite(lat) && Number.isFinite(lon) ? { latitude: lat, longitude: lon } : null;
}

/**
 * Reads the member's current location for proximity sorting — but only once
 * they've opted in (`enabled`). Consent is app-level first (the opt-in), then
 * OS-level (the permission prompt), honouring the dignity-first, opt-IN model.
 *
 * `expo-location` ships with Expo Go, so this imports directly (unlike the
 * speech-recognition native module, which is probed behind a lazy boundary).
 */
export function useNearbyLocation(enabled: boolean): NearbyLocation {
  const [coords, setCoords] = useState<Coords | null>(null);
  const [status, setStatus] = useState<LocationStatus>('off');
  const activeRef = useRef(true);

  useEffect(() => {
    activeRef.current = true;
    return () => {
      activeRef.current = false;
    };
  }, []);

  const load = useCallback(async () => {
    if (!enabled) {
      setStatus('off');
      setCoords(null);
      return;
    }
    setStatus('requesting');
    // Dev convenience: skip the OS prompt and pin a known origin so the nearby
    // list is demoable away from the seeded Hamilton retailers. No-op in prod.
    const override = devOrigin();
    if (override) {
      setCoords(override);
      setStatus('granted');
      return;
    }
    try {
      const { granted } = await Location.requestForegroundPermissionsAsync();
      if (!activeRef.current) return;
      if (!granted) {
        setStatus('denied');
        return;
      }
      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      if (!activeRef.current) return;
      setCoords({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
      setStatus('granted');
    } catch {
      if (activeRef.current) setStatus('unavailable');
    }
  }, [enabled]);

  useEffect(() => {
    void load();
  }, [load]);

  return { coords, status, refresh: load };
}
