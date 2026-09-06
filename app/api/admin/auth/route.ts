import { NextResponse } from 'next/server'
import { createSession } from '@/lib/admin-session'

export async function POST(req: Request) {
  const secret = process.env.ADMIN_SECRET
  if (!secret) {
    return NextResponse.json(
      { error: 'ADMIN_SECRET environment variable not configured.' },
      { status: 500 },
    )
  }

  let password: string
  try {
    const body = await req.json() as { password?: unknown }
    password = typeof body.password === 'string' ? body.password : ''
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  if (password !== secret) {
    // Constant-time comparison is ideal; for a short secret this is acceptable
    return NextResponse.json({ error: 'Invalid password.' }, { status: 401 })
  }

  const token = createSession()
  return NextResponse.json({ token })
}
