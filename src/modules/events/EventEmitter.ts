import IEvent from './interfaces/IEvent';
import IDashboard from './interfaces/IDashboard';
import { eventSchema } from './EventSchema';

const FREE_TEXT_FIELDS = ['message', 'description', 'comment'];

export default class EventEmitter {
  constructor(private readonly dashboard: IDashboard) {}

  public emit(event: IEvent): boolean {
    if (!this.validate(event)) {
      return false;
    }

    const sanitized = this.redact(event);
    this.dashboard.send(sanitized);
    return true;
  }

  private validate(event: IEvent): boolean {
    if (eventSchema.required.some((key) => !(key in event))) {
      return false;
    }

    if (typeof event.event !== 'string') return false;
    if (typeof event.version !== 'string') return false;
    if (typeof event.owner !== 'string') return false;
    if (typeof event.timestamp !== 'string') return false;
    if (event.properties && typeof event.properties !== 'object') return false;

    return true;
  }

  private redact(event: IEvent): IEvent {
    const properties = { ...(event.properties || {}) };

    FREE_TEXT_FIELDS.forEach((field) => {
      if (typeof properties[field] === 'string') {
        properties[field] = '[REDACTED]';
      }
    });

    return { ...event, properties };
  }
}
