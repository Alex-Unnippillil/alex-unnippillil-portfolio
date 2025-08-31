import { inject, injectable } from 'inversify';
import IGithubProfile from './interfaces/IGithubProfile';
import IGithubFetcher from './interfaces/IGithubFetcher';
import IGithubRepository from './interfaces/IGithubRepository';
import IGithubConfigRepository from './interfaces/IGithubConfigRepository';
import { TYPES } from '../../types';
import NetworkCache from '../cache/NetworkCache';
import createCacheKey from '../../utils/cacheKey';

@injectable()
export default class GithubRequest {
  public static API = 'https://api.github.com';

  public static REPOS_MAX_COUNT = 100;

  protected fetcher: IGithubFetcher;

  protected cache: NetworkCache;

  protected ttl: number;

  constructor(@inject(TYPES.GithubFetcher) fetcher: IGithubFetcher, ttl = 60_000) {
    this.fetcher = fetcher;
    this.cache = new NetworkCache();
    this.ttl = ttl;
  }

  private getAuthContext(): string | undefined {
    const f: any = this.fetcher;
    return f.token || f.username;
  }

  private getProfileUrl(): string {
    const f: any = this.fetcher;
    if (f.token) {
      return `${GithubRequest.API}/user`;
    }
    if (f.username) {
      return `${GithubRequest.API}/users/${f.username}`;
    }
    return `${GithubRequest.API}/user`;
  }

  private getReposUrl(): string {
    const f: any = this.fetcher;
    if (f.token) {
      return `${GithubRequest.API}/user/repos`;
    }
    if (f.username) {
      return `${GithubRequest.API}/users/${f.username}/repos`;
    }
    return `${GithubRequest.API}/user/repos`;
  }

  public fetchProfile(): Promise<IGithubProfile> {
    const key = createCacheKey(this.getProfileUrl(), {}, this.getAuthContext());
    return this.cache.fetch(key, this.ttl, () => this.fetcher.fetchProfile()
      .then(({ data }) => data));
  }

  public fetchRepositories(
    params: IGithubConfigRepository,
    page: number,
    perPage: number,
  ): Promise<IGithubRepository[]> {
    const keyParams = {
      affiliation: params.affiliation.length ? params.affiliation.join(',') : undefined,
      visibility: params.visibility,
      direction: params.direction,
      type: params.affiliation.length || params.visibility ? undefined : params.type,
      sort: params.sort,
      page,
      per_page: perPage,
    };
    const key = createCacheKey(this.getReposUrl(), keyParams, this.getAuthContext());

    return this.cache.fetch(key, this.ttl, () => this.fetcher.fetchRepositories(params, page, perPage)
      .then(({ data }) => data));
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
