import { inject, injectable } from 'inversify';
import IGithubProfile from './interfaces/IGithubProfile';
import IGithubFetcher from './interfaces/IGithubFetcher';
import IGithubRepository from './interfaces/IGithubRepository';
import IGithubConfigRepository from './interfaces/IGithubConfigRepository';
import { TYPES } from '../../types';
import RequestQueue from '../../utils/RequestQueue';

@injectable()
export default class GithubRequest {
  public static API = 'https://api.github.com';

  public static REPOS_MAX_COUNT = 100;

  public static queue = new RequestQueue();

  protected fetcher: IGithubFetcher;

  constructor(@inject(TYPES.GithubFetcher) fetcher: IGithubFetcher) {
    this.fetcher = fetcher;
  }

  public static setConcurrency(endpoint: string, limit: number): void {
    GithubRequest.queue.setConcurrency(endpoint, limit);
  }

  public fetchProfile(): Promise<IGithubProfile> {
    return GithubRequest.queue.enqueue('profile', () => this.fetcher.fetchProfile())
      .then(({ data }) => data);
  }

  public fetchRepositories(
    params: IGithubConfigRepository,
    page: number,
    perPage: number,
  ): Promise<IGithubRepository[]> {
    return GithubRequest.queue.enqueue('repositories', () => this.fetcher.fetchRepositories(params, page, perPage))
      .then(({ data }) => data);
  }

  public async fetchAllRepositories(params: IGithubConfigRepository): Promise<IGithubRepository[]> {
    const repositories = [];
    let repos = [];
    let page = 1;

    do {
      // eslint-disable-next-line no-await-in-loop
      repos = await this.fetchRepositories(params, page, GithubRequest.REPOS_MAX_COUNT);

      repositories.push(...repos);

      page += 1;
    } while (repos.length === GithubRequest.REPOS_MAX_COUNT);

    return repositories;
  }
}
