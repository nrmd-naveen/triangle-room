import { NextResponse } from 'next/server'
import { readConfig, writeConfig } from '@/lib/site-config'
import { validateSession, getAuthHeader } from '@/lib/admin-session'
import type { SiteConfig } from '@/lib/site-config'

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
}

export async function GET(req: Request) {
  if (!validateSession(getAuthHeader(req))) return unauthorized()
  const config = await readConfig()
  return NextResponse.json(config)
}

export async function PATCH(req: Request) {
  if (!validateSession(getAuthHeader(req))) return unauthorized()

  let patch: Partial<SiteConfig>
  try {
    patch = await req.json() as Partial<SiteConfig>
  } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 })
  }

  const current = await readConfig()
  const updated: SiteConfig = { ...current, ...patch }
  await writeConfig(updated)
  return NextResponse.json({ ok: true })
}
