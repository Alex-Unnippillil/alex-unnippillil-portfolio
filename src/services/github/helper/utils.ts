import IGithubFetcher from '../interfaces/IGithubFetcher';
import GithubPrivateFetcher from '../fetcher/GithubPrivateFetcher';
import { di } from '../../../di';
import IApplication from '../../../interfaces/IApplication';
import { TYPES } from '../../../types';
import GithubPublicFetcher from '../fetcher/GithubPublicFetcher';
import GithubDemoFetcher from '../fetcher/GithubDemoFetcher';

// eslint-disable-next-line import/prefer-default-export
export function parseGithubFetcher(): IGithubFetcher | undefined {
  const args = process.argv.slice(2);

  if (process.env.DEMO_MODE === 'true') {
    return new GithubDemoFetcher();
  }

  if (args.length && args[0]) {
    return new GithubPrivateFetcher(args[0]);
  }

  if (process.env.GITHUB_TOKEN) {
    return new GithubPrivateFetcher(process.env.GITHUB_TOKEN);
  }

  const { github } = di.get<IApplication>(TYPES.Application).config.services;

  if (github.configuration.nickname) {
    return new GithubPublicFetcher(github.configuration.nickname);
  }

  return undefined;
}
