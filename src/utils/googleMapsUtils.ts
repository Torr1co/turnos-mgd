export const DEFAULT_GOOGLE_MAPS_OPTIONS = {
  disableDefaultUI: true,
  zoomControl: true,
  fullscreenControl: true,
};

export const MAGDALENA_CENTER_LOCATION = { lat: -35.0792256, lng: -57.5126985 };

export function getMapPositionByUrl(
  url: string
): google.maps.LatLngLiteral | null {
  const latLngRegex = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
  const match = url.match(latLngRegex) as [string, string, string] | null;
  if (match) {
    return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };
  } else {
    return null;
  }
}
