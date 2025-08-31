import React from 'react';
import { Event } from '../../models/Event';

export interface EventDualTimeProps {
  event: Event;
}

/**
 * Shows an event's time in both local and canonical (UTC) formats.
 */
export const EventDualTime: React.FC<EventDualTimeProps> = ({ event }) => (
  <div className="event-dual-time">
    <div className="event-time-local">{event.localTime.toLocaleString()}</div>
    <div className="event-time-canonical">{event.canonicalTime.toUTCString()}</div>
  </div>
);

export default EventDualTime;
