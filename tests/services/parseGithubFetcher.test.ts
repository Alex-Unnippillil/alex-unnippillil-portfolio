import GithubDemoFetcher from '../../src/services/github/fetcher/GithubDemoFetcher';
import { parseGithubFetcher } from '../../src/services/github/helper/utils';

describe('parseGithubFetcher demo mode', () => {
  it('returns demo fetcher when DEMO_MODE is set', () => {
    process.env.DEMO_MODE = 'true';
    const fetcher = parseGithubFetcher();
    expect(fetcher).toBeInstanceOf(GithubDemoFetcher);
    delete process.env.DEMO_MODE;
  });
});
