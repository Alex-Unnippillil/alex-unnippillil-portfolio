import { inject, injectable } from 'inversify';
import GithubRequest from './GithubRequest';
import IGithubConfigRepository from './interfaces/IGithubConfigRepository';
import IGithubRepository from './interfaces/IGithubRepository';
import IGithubFetcher from './interfaces/IGithubFetcher';
import IGithubProfile from './interfaces/IGithubProfile';
import { TYPES } from '../../types';
import IPrefixLogger from '../../modules/logger/interfaces/IPrefixLogger';
import generateRequestId from '../../utils/requestId';
import { showRequestErrorToast } from '../../modules/error/RequestError';

@injectable()
export default class GithubLoggerFetcher extends GithubRequest {
  protected logger: IPrefixLogger;

  constructor(fetcher: IGithubFetcher, @inject(TYPES.LoggerPrefix) logger: IPrefixLogger) {
    super(fetcher);
    this.logger = logger;
    this.logger.setPrefix('Github');
    this.logger.debug(`Using ${fetcher.constructor.name}`);
  }

  public fetchRepositories(
    params: IGithubConfigRepository,
    page: number,
    perPage: number,
  ): Promise<{ requestId: string; data: IGithubRepository[] }> {
    const requestId = generateRequestId();
    this.logger.info(`Starting fetch repositories [${requestId}]: page = ${page}, perPage = ${perPage}`);

    return super.fetchRepositories(params, page, perPage, requestId)
      .then((result) => {
        this.logger.log(`Complete repositories [${requestId}], count = ${result.data.length}`);
        return result;
      })
      .catch((err) => {
        const summary = err.response?.data || err.message;
        showRequestErrorToast({ requestId, summary });
        this.logger.error(`[${requestId}] ${summary}`);
        throw { requestId, error: err };
      });
  }

  public fetchProfile(): Promise<{ requestId: string; data: IGithubProfile }> {
    const requestId = generateRequestId();
    this.logger.info(`Starting fetch profile [${requestId}]`);

    return super.fetchProfile(requestId)
      .then((result) => {
        this.logger.log(`Complete profile [${requestId}]`);
        return result;
      })
      .catch((err) => {
        const summary = err.response?.data || err.message;
        showRequestErrorToast({ requestId, summary });
        this.logger.error(`[${requestId}] ${summary}`);
        throw { requestId, error: err };
      });
  }
}
