import axios from 'axios';
import fs from 'fs';
import path from 'path';

describe('synthetic pings', () => {
  const sloPath = path.resolve(__dirname, '../../config/slo.json');
  const sloConfig = JSON.parse(fs.readFileSync(sloPath, 'utf8')) as Record<string, { availability: number; latency: number }>;
  const regions = ['us-east-1', 'eu-west-1', 'ap-south-1'];
  const baseUrl = 'https://example.com';

  regions.forEach((region) => {
    describe(`region ${region}`, () => {
      Object.keys(sloConfig).forEach((route) => {
        it(`meets latency for route ${route}`, async () => {
          const start = Date.now();
          const res = await axios.get(`${baseUrl}${route}`, {
            validateStatus: () => true,
          });
          const latency = Date.now() - start;
          expect(res.status).toBeLessThan(500);
          expect(latency).toBeLessThan(sloConfig[route].latency);
        });
      });
    });
  });
});
