import { injectable } from 'inversify';

export interface MetaAttributes {
  name?: string;
  property?: string;
  content: string;
}

@injectable()
export default class HeadManager {
  private canonicalUrl?: string;

  private titleText?: string;

  private metas: Map<string, MetaAttributes> = new Map();

  reset(): void {
    this.canonicalUrl = undefined;
    this.titleText = undefined;
    this.metas.clear();
  }

  canonical(url: string): void {
    this.canonicalUrl = url;
  }

  title(text: string): void {
    this.titleText = text;
  }

  meta(attrs: MetaAttributes): void {
    let key: string | undefined;
    if (attrs.name) {
      key = `name:${attrs.name}`;
    } else if (attrs.property) {
      key = `property:${attrs.property}`;
    }

    if (!key) {
      return;
    }
    this.metas.set(key, attrs);
  }

  metaName(name: string, content: string): void {
    this.meta({ name, content });
  }

  metaProperty(property: string, content: string): void {
    this.meta({ property, content });
  }

  render(): string {
    const tags: string[] = [];

    if (this.canonicalUrl) {
      tags.push(`<link rel="canonical" href="${this.canonicalUrl}" />`);
    }

    if (this.titleText) {
      tags.push(`<title>${this.titleText}</title>`);
    }

    this.metas.forEach((attrs) => {
      if (attrs.name) {
        tags.push(`<meta name="${attrs.name}" content="${attrs.content}" />`);
      } else if (attrs.property) {
        tags.push(`<meta property="${attrs.property}" content="${attrs.content}" />`);
      }
    });

    return tags.join('\n');
  }
}
