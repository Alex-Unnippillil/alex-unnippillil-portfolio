export const EVENT_SCHEMA_VERSION = '1.0.0';
export const EVENT_SCHEMA_OWNER = 'data-team';

export const eventSchema = {
  type: 'object',
  required: ['event', 'version', 'owner', 'timestamp'],
  properties: {
    event: { type: 'string' },
    version: { type: 'string' },
    owner: { type: 'string' },
    timestamp: { type: 'string' },
    properties: { type: 'object', additionalProperties: true },
  },
  additionalProperties: false,
} as const;

export default eventSchema;
