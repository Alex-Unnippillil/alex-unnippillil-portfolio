import { redactGps } from '../../src/utils/exif';

describe('Exif utilities', () => {
  it('redacts GPS fields', () => {
    const data = {
      Model: 'Camera',
      GPSLatitude: 1,
      GPSLongitude: 2,
      GPSInfo: 'info',
    };
    const sanitized = redactGps(data);
    expect(sanitized).toStrictEqual({ Model: 'Camera' });
  });
});
