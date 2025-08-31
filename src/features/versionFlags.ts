export interface VersionFlags {
  legacySchemaHeader: boolean;
}

export const versionFlags: VersionFlags = {
  legacySchemaHeader: true,
};

export function parseVersion(headers: Record<string, string>): { api?: string; schema?: string } {
  const api = headers['x-api-version'];
  let schema = headers['x-schema-version'];

  if (!schema && versionFlags.legacySchemaHeader) {
    schema = headers['x-db-schema-version'] || headers['x-schema'];
  }

  return { api, schema };
}
