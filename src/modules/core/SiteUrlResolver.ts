import StringUtils from '../../utils/StringUtils';
import { IConfigGlobalWww } from '../../interfaces/IConfig';

export default class SiteUrlResolver {
  private www: IConfigGlobalWww;

  private locale: string;

  constructor(www: IConfigGlobalWww, locale: string) {
    this.www = www;
    this.locale = locale;
  }

  public resolve() {
    return StringUtils.rtrim(this.url, '/');
  }

  protected get url() {
    return `${this.www.protocol}://${this.www.domain}${this.path}`;
  }

  protected get path() {
    const lang = this.locale.split('_')[0];
    const basePath = this.www.path ? `/${StringUtils.ltrim(this.www.path, '/')}` : '';
    return `/${lang}${basePath}`;
  }
}
