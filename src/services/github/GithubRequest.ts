import { inject, injectable } from 'inversify';
import IGithubProfile from './interfaces/IGithubProfile';
import IGithubFetcher from './interfaces/IGithubFetcher';
import IGithubRepository from './interfaces/IGithubRepository';
import IGithubConfigRepository from './interfaces/IGithubConfigRepository';
import { TYPES } from '../../types';
import generateRequestId from '../../utils/requestId';

@injectable()
export default class GithubRequest {
  public static API = 'https://api.github.com';

  public static REPOS_MAX_COUNT = 100;

  protected fetcher: IGithubFetcher;

  constructor(@inject(TYPES.GithubFetcher) fetcher: IGithubFetcher) {
    this.fetcher = fetcher;
  }

  public fetchProfile(requestId: string = generateRequestId()): Promise<{ requestId: string; data: IGithubProfile }> {
    return this.fetcher.fetchProfile()
      .then(({ data }) => ({ requestId, data }));
  }

  public fetchRepositories(
    params: IGithubConfigRepository,
    page: number,
    perPage: number,
    requestId: string = generateRequestId(),
  ): Promise<{ requestId: string; data: IGithubRepository[] }> {
    return this.fetcher.fetchRepositories(params, page, perPage)
      .then(({ data }) => ({ requestId, data }));
  }

  public async fetchAllRepositories(params: IGithubConfigRepository): Promise<IGithubRepository[]> {
    const repositories = [];
    let repos = [];
    let page = 1;

    do {
      // eslint-disable-next-line no-await-in-loop
      ({ data: repos } = await this.fetchRepositories(
        params,
        page,
        GithubRequest.REPOS_MAX_COUNT,
      ));

      repositories.push(...repos);

      page += 1;
    } while (repos.length === GithubRequest.REPOS_MAX_COUNT);

    return repositories;
  }
}
