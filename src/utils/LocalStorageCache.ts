import ILogger from '../modules/logger/interfaces/ILogger';
import ConsoleLogger from '../modules/logger/ConsoleLogger';

export type MigrationFunc<T> = (data: any) => T;

/**
 * Utility for storing versioned data in localStorage with migrations.
 */
export default class LocalStorageCache<T> {
  protected readonly key: string;

  protected readonly version: number;

  protected readonly defaultValue: T;

  protected readonly migrations: { [version: number]: MigrationFunc<T> };

  protected readonly logger: ILogger;

  constructor(
    key: string,
    version: number,
    defaultValue: T,
    migrations: { [version: number]: MigrationFunc<T> } = {},
    logger: ILogger = new ConsoleLogger(),
  ) {
    this.key = key;
    this.version = version;
    this.defaultValue = defaultValue;
    this.migrations = migrations;
    this.logger = logger;
  }

  /**
   * Load data from storage and run migrations if necessary.
   */
  public load(): T {
    const raw = globalThis.localStorage?.getItem(this.key);
    if (!raw) {
      return this.defaultValue;
    }

    try {
      const parsed = JSON.parse(raw);
      const storedVersion = parsed.v ?? 0;
      let data = parsed.data as T;

      if (storedVersion !== this.version) {
        try {
          data = this.migrate(data, storedVersion);
        } catch (e) {
          this.logger.error(`Failed to migrate cache "${this.key}"`, e);
          this.reset();
          return this.defaultValue;
        }
      }

      this.save(data);
      return data;
    } catch (e) {
      this.logger.error(`Failed to read cache "${this.key}"`, e);
      this.reset();
      return this.defaultValue;
    }
  }

  /**
   * Save data with current version.
   */
  public save(data: T): void {
    globalThis.localStorage?.setItem(
      this.key,
      JSON.stringify({ v: this.version, data }),
    );
  }

  /**
   * Remove data from storage.
   */
  public reset(): void {
    globalThis.localStorage?.removeItem(this.key);
  }

  protected migrate(data: T, from: number): T {
    let current = from;
    let result: any = data;
    while (current < this.version) {
      const fn = this.migrations[current];
      if (!fn) {
        throw new Error(`Missing migration for version ${current}`);
      }
      result = fn(result);
      current += 1;
    }
    return result as T;
  }
}

