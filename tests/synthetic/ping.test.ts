import axios from 'axios';

const regions = ['us-east-1', 'eu-west-1', 'ap-south-1'];

// Simple synthetic ping that checks availability of example.com
// from different regions. In this environment the requests all
// originate from the same location but the regions are tracked
// for reporting purposes.
describe('synthetic pings', () => {
  regions.forEach(region => {
    test(`ping from ${region}`, async () => {
      const response = await axios.get('https://example.com', {
        headers: { 'X-Region': region },
      });
      expect(response.status).toBeLessThan(500);
    }, 10000);
  });
});
