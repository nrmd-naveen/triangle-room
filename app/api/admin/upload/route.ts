/**
 * Upload an asset to Cloudflare R2.
 *
 * Required env vars:
 *   R2_ACCOUNT_ID        — Cloudflare account ID
 *   R2_ACCESS_KEY_ID     — R2 API token (Access Key ID)
 *   R2_SECRET_ACCESS_KEY — R2 API token (Secret)
 *   R2_BUCKET_NAME       — bucket name (e.g. "triangle-room-assets")
 *   R2_PUBLIC_URL        — public base URL (e.g. "https://pub-xxx.r2.dev")
 *
 * Returns: { url: string } — the public CDN URL of the uploaded file.
 */

import { NextResponse } from 'next/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { validateSession, getAuthHeader } from '@/lib/admin-session'

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
}

function r2Configured(): boolean {
  return !!(
    process.env.R2_ACCOUNT_ID &&
    process.env.R2_ACCESS_KEY_ID &&
    process.env.R2_SECRET_ACCESS_KEY &&
    process.env.R2_BUCKET_NAME &&
    process.env.R2_PUBLIC_URL
  )
}

export async function POST(req: Request) {
  if (!validateSession(getAuthHeader(req))) return unauthorized()

  if (!r2Configured()) {
    return NextResponse.json(
      { error: 'R2 environment variables not configured. Add R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, and R2_PUBLIC_URL to your .env.local.' },
      { status: 503 },
    )
  }

  let formData: FormData
  try {
    formData = await req.formData()
  } catch {
    return NextResponse.json({ error: 'Expected multipart/form-data.' }, { status: 400 })
  }

  const file = formData.get('file')
  const prefix = (formData.get('prefix') as string | null) ?? 'uploads'

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No file provided.' }, { status: 400 })
  }

  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'bin'
  const key = `${prefix}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`

  const r2 = new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId:     process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  })

  const bytes = await file.arrayBuffer()

  await r2.send(new PutObjectCommand({
    Bucket:      process.env.R2_BUCKET_NAME!,
    Key:         key,
    Body:        Buffer.from(bytes),
    ContentType: file.type || 'application/octet-stream',
  }))

  const url = `${process.env.R2_PUBLIC_URL}/${key}`
  return NextResponse.json({ url, key })
}
