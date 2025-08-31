import path from 'path';
import { detectFeatures, featureMatrix, loadFallbacks } from '../../src/utils/featureMatrix';

describe('low capability environment', () => {
  it('detects missing features and loads fallbacks', () => {
    const env: any = { navigator: { userAgent: '' } };
    const features = detectFeatures(env);
    expect(features).toEqual({ fetch: false, serviceWorker: false, localStorage: false });

    const matrix = featureMatrix(env);
    expect(matrix).toEqual({ unknown: { fetch: false, serviceWorker: false, localStorage: false } });

    const loaded = loadFallbacks(features, path.join(__dirname, '../../src/components/fallbacks'));
    const names = loaded.map((fn: any) => fn());
    expect(names.sort()).toEqual(['fetch fallback', 'serviceWorker fallback', 'localStorage fallback'].sort());
  });
});
