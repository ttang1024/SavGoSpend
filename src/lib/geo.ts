/**
 * Geographic helpers for the "Nearby Retailers" feature.
 *
 * Intentionally pure (no React Native / native / expo imports) so distance and
 * sorting can be unit-tested in isolation. The native location capture lives in
 * `hooks/useNearbyLocation`; the deep-link opening lives at the call site.
 */
import type { Retailer } from '@/types';

export type Coords = {
  latitude: number;
  longitude: number;
};

const EARTH_RADIUS_KM = 6371;

const toRadians = (degrees: number): number => (degrees * Math.PI) / 180;

/**
 * Great-circle distance in kilometres between two points (Haversine formula).
 * Accurate enough for "how far is this shop" at city scale.
 */
export function haversineKm(from: Coords, to: Coords): number {
  const dLat = toRadians(to.latitude - from.latitude);
  const dLon = toRadians(to.longitude - from.longitude);
  const lat1 = toRadians(from.latitude);
  const lat2 = toRadians(to.latitude);

  const sinLat = Math.sin(dLat / 2);
  const sinLon = Math.sin(dLon / 2);
  const a = sinLat * sinLat + Math.cos(lat1) * Math.cos(lat2) * sinLon * sinLon;

  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(a)));
}

/**
 * Human-friendly distance for members 65+ — short, plain, and rounded so it
 * reads at a glance ("250 m away", "1.2 km away", "14 km away").
 */
export function formatDistance(km: number): string {
  if (!Number.isFinite(km) || km < 0) return '';
  if (km < 1) {
    const metres = Math.max(10, Math.round((km * 1000) / 10) * 10); // nearest 10 m
    return `${metres} m away`;
  }
  if (km < 10) return `${km.toFixed(1)} km away`;
  return `${Math.round(km)} km away`;
}

export type RetailerWithDistance = {
  retailer: Retailer;
  /** Kilometres from the member, or `null` when the location is unknown. */
  distanceKm: number | null;
};

/**
 * Pairs each retailer with its distance from `origin` and sorts nearest-first.
 * With no origin (location off/denied), the original order is preserved and
 * every distance is `null`.
 */
export function sortRetailersByDistance(
  retailers: Retailer[],
  origin: Coords | null,
): RetailerWithDistance[] {
  const paired: RetailerWithDistance[] = retailers.map((retailer) => ({
    retailer,
    distanceKm: origin ? haversineKm(origin, retailer) : null,
  }));

  if (!origin) return paired;
  return paired.sort((a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity));
}

/**
 * A maps deep-link for turn-by-turn directions to a retailer. iOS opens Apple
 * Maps; Android and web open Google Maps. Both are universal URLs so they work
 * even if the native maps app isn't installed.
 */
export function directionsUrl(
  retailer: Pick<Retailer, 'name' | 'latitude' | 'longitude'>,
  platformOS: string,
): string {
  const { latitude, longitude, name } = retailer;
  const dest = `${latitude},${longitude}`;
  const label = encodeURIComponent(name);

  if (platformOS === 'ios') {
    return `https://maps.apple.com/?daddr=${dest}&q=${label}`;
  }
  return `https://www.google.com/maps/dir/?api=1&destination=${dest}`;
}
