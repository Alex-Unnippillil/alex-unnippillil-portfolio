export interface Event {
  id: string;
  title: string;
  /** Canonical event time in UTC. */
  canonicalTime: Date;
  /** Event time in the user's local timezone. */
  localTime: Date;
}

/**
 * Creates an event capturing both the canonical UTC time and the local time
 * of the user when the event was scheduled.
 */
export function createEvent(
  id: string,
  title: string,
  localTime: Date,
): Event {
  const canonicalTime = new Date(localTime.getTime() + localTime.getTimezoneOffset() * 60_000);
  return { id, title, canonicalTime, localTime };
}
