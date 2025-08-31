/* eslint-disable */
// @ts-nocheck
import React, { useEffect, useState } from 'react';
import sessionStore, { Session } from '../../services/sessionStore';

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    // In real app, user id would come from auth context
    setSessions(sessionStore.listSessions('currentUser'));
  }, []);

  const revoke = (id: string) => {
    sessionStore.revokeSession(id);
    setSessions(sessionStore.listSessions('currentUser'));
  };

  return (
    <ul>
      {sessions.map((s) => (
        <li key={s.id}>
          {s.userAgent} - {s.lastActivity.toLocaleString()}
          <button type="button" onClick={() => revoke(s.id)}>Revoke</button>
        </li>
      ))}
    </ul>
  );
}
