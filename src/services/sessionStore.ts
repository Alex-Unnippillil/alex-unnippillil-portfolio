interface Session {
  id: string;
  email: string;
  userAgent: string;
  lastActivity: Date;
  refreshToken: string;
}

class SessionStore {
  private sessions: Map<string, Session> = new Map();

  private magicTokens: Map<string, { email: string; expires: number }> = new Map();

  generateMagicToken(email: string): string {
    const token = Math.random().toString(36).slice(2);
    // token expires in 10 minutes
    const expires = Date.now() + 10 * 60 * 1000;
    this.magicTokens.set(token, { email, expires });
    return token;
  }

  consumeMagicToken(token: string, userAgent: string): string {
    const record = this.magicTokens.get(token);
    if (!record || record.expires < Date.now()) {
      throw new Error('Invalid or expired token');
    }
    this.magicTokens.delete(token);
    const id = Math.random().toString(36).slice(2);
    const refreshToken = Math.random().toString(36).slice(2);
    this.sessions.set(id, {
      id,
      email: record.email,
      userAgent,
      lastActivity: new Date(),
      refreshToken,
    });
    return id;
  }

  rotateRefresh(sessionId: string): string {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }
    session.refreshToken = Math.random().toString(36).slice(2);
    session.lastActivity = new Date();
    this.sessions.set(sessionId, session);
    return session.refreshToken;
  }

  listSessions(email: string): Session[] {
    return Array.from(this.sessions.values()).filter((s) => s.email === email);
  }

  revokeSession(sessionId: string): void {
    this.sessions.delete(sessionId);
  }
}

export default new SessionStore();

export type { Session };
