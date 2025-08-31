const GPS_FIELDS = [
  'GPSLatitude',
  'GPSLongitude',
  'GPSAltitude',
  'GPSLatitudeRef',
  'GPSLongitudeRef',
  'GPSAltitudeRef',
  'GPSInfo',
];

export function redactGps<T extends Record<string, unknown>>(exif: T): T {
  const result: Record<string, unknown> = { ...exif };
  GPS_FIELDS.forEach((field) => {
    if (field in result) {
      delete result[field];
    }
  });
  return result as T;
}

export async function readExif(file: Blob): Promise<Record<string, unknown>> {
  const { default: exifr } = await import('exifr');
  const data = await exifr.parse(file);
  return redactGps(data);
}
