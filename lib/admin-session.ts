/**
 * In-memory admin session store.
 * Sessions are cleared on server restart — intentional for a simple internal tool.
 * For multi-process / persistent sessions, swap for Redis or a signed JWT.
 */

const sessions = new Set<string>()

export function createSession(): string {
  const token = crypto.randomUUID()
  sessions.add(token)
  return token
}

export function validateSession(token: string): boolean {
  return sessions.has(token)
}

export function revokeSession(token: string): void {
  sessions.delete(token)
}

export function getAuthHeader(req: Request): string {
  return req.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ?? ''
}
