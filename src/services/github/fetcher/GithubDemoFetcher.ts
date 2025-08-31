import { AxiosResponse } from 'axios';
import fs from 'fs';
import path from 'path';
import IGithubFetcher from '../interfaces/IGithubFetcher';
import IGithubConfigRepository from '../interfaces/IGithubConfigRepository';

export default class GithubDemoFetcher implements IGithubFetcher {
  private dataDir: string;

  constructor(dataDir: string = path.resolve(__dirname, '../../../../data')) {
    this.dataDir = dataDir;
  }

  async fetchProfile(): Promise<AxiosResponse> {
    const profilePath = path.join(this.dataDir, 'github-profile.json');
    const data = JSON.parse(fs.readFileSync(profilePath, 'utf-8'));
    return {
      data,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    };
  }

  async fetchRepositories(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    params: IGithubConfigRepository,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    page: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    perPage: number,
  ): Promise<AxiosResponse> {
    const repositoriesPath = path.join(this.dataDir, 'github-repositories.json');
    const data = JSON.parse(fs.readFileSync(repositoriesPath, 'utf-8'));
    return {
      data,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    };
  }
}
