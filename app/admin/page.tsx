'use client'

/**
 * Triangle Room — Admin Console
 * Clean, conventional admin UI. Not themed after the site.
 */

import { useState, useCallback, useRef, useEffect, type ChangeEvent } from 'react'
import type { SiteConfig, Director, WorkConfig, Logo, SectionConfig } from '@/lib/site-config'

// ─── Types ────────────────────────────────────────────────────────────────────

type Section = 'reel' | 'directors' | 'about' | 'gallery' | 'works' | 'clients' | 'site' | 'sections'

const NAV: { id: Section; label: string; icon: string }[] = [
  { id: 'reel',      label: 'Reel',        icon: '▶' },
  { id: 'directors', label: 'Directors',   icon: '◉' },
  { id: 'about',     label: 'About',       icon: '◈' },
  { id: 'gallery',   label: 'Gallery',     icon: '▦' },
  { id: 'works',     label: 'Works',       icon: '≡' },
  { id: 'clients',   label: 'Clients',     icon: '◇' },
  { id: 'site',      label: 'Site',        icon: '◎' },
  { id: 'sections',  label: 'Page Order',  icon: '↕' },
]

const WORK_CATEGORIES = ['Documentary', 'Reality', 'Sports', 'Film', 'Ad Film', 'Short Film'] as const
type WorkCategory = typeof WORK_CATEGORIES[number]

// ─── Admin hook ───────────────────────────────────────────────────────────────

function useAdmin() {
  const [token,       setToken]       = useState('')
  const [config,      setConfig]      = useState<SiteConfig | null>(null)
  const [authLoading, setAuthLoading] = useState(false)
  const [authError,   setAuthError]   = useState('')
  const [initDone,    setInitDone]    = useState(false)

  const fetchConfig = useCallback(async (t: string): Promise<SiteConfig | null> => {
    const res = await fetch('/api/admin/config', { headers: { Authorization: `Bearer ${t}` } })
    if (!res.ok) return null
    return res.json() as Promise<SiteConfig>
  }, [])

  useEffect(() => {
    const saved = sessionStorage.getItem('admin_token')
    if (!saved) { setInitDone(true); return }
    fetchConfig(saved).then(cfg => {
      if (cfg) { setToken(saved); setConfig(cfg) }
      else sessionStorage.removeItem('admin_token')
      setInitDone(true)
    })
  }, [fetchConfig])

  const login = useCallback(async (password: string) => {
    setAuthLoading(true); setAuthError('')
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (!res.ok) throw new Error('Invalid password')
      const { token: t } = await res.json() as { token: string }
      const cfg = await fetchConfig(t)
      if (!cfg) throw new Error('Could not load configuration')
      sessionStorage.setItem('admin_token', t)
      setToken(t); setConfig(cfg)
    } catch (e) {
      setAuthError((e as Error).message)
    } finally {
      setAuthLoading(false)
    }
  }, [fetchConfig])

  const save = useCallback(async (patch: Partial<SiteConfig>): Promise<boolean> => {
    if (!token) return false
    const res = await fetch('/api/admin/config', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(patch),
    })
    if (res.ok) setConfig(prev => prev ? { ...prev, ...patch } : null)
    return res.ok
  }, [token])

  const upload = useCallback(async (file: File, prefix: string): Promise<string> => {
    const form = new FormData()
    form.append('file', file)
    form.append('prefix', prefix)
    const res = await fetch('/api/admin/upload', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Upload failed' })) as { error: string }
      throw new Error(err.error)
    }
    const { url } = await res.json() as { url: string }
    return url
  }, [token])

  return { token, config, authLoading, authError, initDone, login, save, upload }
}

function useSave(onSave: (patch: Partial<SiteConfig>) => Promise<boolean>) {
  const [saving, setSaving] = useState(false)
  const [saved,  setSaved]  = useState(false)
  const [err,    setErr]    = useState('')

  const doSave = useCallback(async (patch: Partial<SiteConfig>) => {
    setSaving(true); setSaved(false); setErr('')
    const ok = await onSave(patch)
    setSaving(false)
    if (ok) { setSaved(true); setTimeout(() => setSaved(false), 3000) }
    else setErr('Save failed')
  }, [onSave])

  return { saving, saved, err, doSave }
}

function swap<T>(arr: T[], i: number, j: number): T[] {
  const next = [...arr];
  [next[i], next[j]] = [next[j], next[i]]
  return next
}

// ─── UI primitives ────────────────────────────────────────────────────────────

const s = {
  label:   'block text-xs font-medium text-gray-600 mb-1',
  hint:    'text-xs text-gray-400 mb-2 leading-relaxed',
  input:   'w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white',
  textarea:'w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white resize-y min-h-[80px]',
  btnPrimary: 'px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50',
  btnSecondary: 'px-3 py-1.5 border border-gray-200 text-sm text-gray-600 rounded-md hover:bg-gray-50 transition-colors',
  btnDanger:  'px-3 py-1.5 border border-red-200 text-sm text-red-600 rounded-md hover:bg-red-50 transition-colors',
  btnUpload:  'px-3 py-2 text-sm text-blue-600 border border-blue-200 rounded-md hover:bg-blue-50 transition-colors whitespace-nowrap disabled:opacity-50',
  card:    'bg-white border border-gray-200 rounded-lg p-5',
  divider: 'border-t border-gray-100 my-6',
}

function SectionTitle({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      <p className="text-sm text-gray-500 mt-1">{desc}</p>
    </div>
  )
}

function SaveBar({ saving, saved, err, onSave }: { saving: boolean; saved: boolean; err: string; onSave: () => void }) {
  return (
    <div className="flex items-center gap-3 pt-5 mt-5 border-t border-gray-100">
      <button onClick={onSave} disabled={saving} className={s.btnPrimary}>
        {saving ? 'Saving…' : 'Save changes'}
      </button>
      {saved && <span className="text-sm text-green-600 font-medium">✓ Saved</span>}
      {err   && <span className="text-sm text-red-600">{err}</span>}
    </div>
  )
}

function FieldRow({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-4 mb-4">{children}</div>
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className={s.label}>{label}</label>
      {hint && <p className={s.hint}>{hint}</p>}
      {children}
    </div>
  )
}

// ─── Upload button ────────────────────────────────────────────────────────────

function UploadBtn({ onFile, uploading, accept = 'image/*', label = 'Upload file' }: {
  onFile: (f: File) => void; uploading: boolean; accept?: string; label?: string
}) {
  const ref = useRef<HTMLInputElement>(null)
  return (
    <>
      <input ref={ref} type="file" accept={accept} className="hidden"
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          const f = e.target.files?.[0]; if (f) onFile(f); e.target.value = ''
        }} />
      <button onClick={() => ref.current?.click()} disabled={uploading} className={s.btnUpload}>
        {uploading ? 'Uploading…' : label}
      </button>
    </>
  )
}

// ─── Bulk upload buttons ──────────────────────────────────────────────────────

interface BulkUploadProgress { done: number; total: number }

function BulkUploadBtn({ onFiles, progress, label = 'Upload multiple' }: {
  onFiles: (files: FileList) => void
  progress: BulkUploadProgress | null
  label?: string
}) {
  const ref = useRef<HTMLInputElement>(null)
  const busy = progress !== null
  return (
    <>
      <input ref={ref} type="file" accept="image/*" multiple className="hidden"
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          if (e.target.files?.length) onFiles(e.target.files)
          e.target.value = ''
        }} />
      <button onClick={() => ref.current?.click()} disabled={busy} className={s.btnSecondary}>
        {busy ? `Uploading ${progress.done}/${progress.total}…` : label}
      </button>
    </>
  )
}

function FolderUploadBtn({ onFiles, progress }: {
  onFiles: (files: FileList) => void
  progress: BulkUploadProgress | null
}) {
  const ref = useRef<HTMLInputElement>(null)
  const busy = progress !== null
  return (
    <>
      {/* webkitdirectory lets the user pick an entire folder */}
      <input ref={ref} type="file" accept="image/*" multiple className="hidden"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        {...{ webkitdirectory: '', mozdirectory: '' } as any}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          if (e.target.files?.length) onFiles(e.target.files)
          e.target.value = ''
        }} />
      <button onClick={() => ref.current?.click()} disabled={busy} className={s.btnSecondary}>
        {busy ? `Uploading ${progress.done}/${progress.total}…` : '📁 Upload folder'}
      </button>
    </>
  )
}

// ─── Image field ──────────────────────────────────────────────────────────────

function ImgField({ label, hint, value, onChange, upload, prefix = 'uploads', ratio = '16/9', maxW = 320 }: {
  label: string; hint?: string; value: string; onChange: (u: string) => void
  upload: (f: File, p: string) => Promise<string>; prefix?: string; ratio?: string; maxW?: number
}) {
  const [uploading, setUploading] = useState(false)
  const [uploadErr, setUploadErr] = useState('')

  const handleFile = async (f: File) => {
    setUploading(true); setUploadErr('')
    try { onChange(await upload(f, prefix)) }
    catch (e) { setUploadErr((e as Error).message) }
    finally { setUploading(false) }
  }

  return (
    <div className="mb-5">
      <label className={s.label}>{label}</label>
      {hint && <p className={s.hint}>{hint}</p>}
      {value ? (
        <div className="mb-2 rounded-md overflow-hidden border border-gray-200 bg-gray-50"
          style={{ aspectRatio: ratio, maxWidth: maxW }}>
          <img src={value} alt="" className="w-full h-full object-cover"
            onError={e => { (e.target as HTMLImageElement).style.opacity = '0.3' }} />
        </div>
      ) : (
        <div className="mb-2 rounded-md border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center"
          style={{ aspectRatio: ratio, maxWidth: maxW }}>
          <span className="text-xs text-gray-400">No image set</span>
        </div>
      )}
      <div className="flex gap-2">
        <input type="text" value={value} onChange={e => onChange(e.target.value)}
          placeholder="https://... or /images/..." className={s.input} />
        <UploadBtn onFile={handleFile} uploading={uploading} />
      </div>
      {uploadErr && <p className="text-xs text-red-600 mt-1">{uploadErr}</p>}
    </div>
  )
}

function MoveButtons({ onUp, onDown }: { onUp: () => void; onDown: () => void }) {
  return (
    <div className="flex flex-col gap-0.5">
      <button onClick={e => { e.stopPropagation(); onUp() }}   className="text-xs text-gray-400 hover:text-gray-700 px-1 leading-tight transition-colors">↑</button>
      <button onClick={e => { e.stopPropagation(); onDown() }} className="text-xs text-gray-400 hover:text-gray-700 px-1 leading-tight transition-colors">↓</button>
    </div>
  )
}

// ─── Section: Reel ────────────────────────────────────────────────────────────

function ReelSection({ config, onSave, upload }: { config: SiteConfig; onSave: (p: Partial<SiteConfig>) => Promise<boolean>; upload: (f: File, p: string) => Promise<string> }) {
  const [reel, setReel] = useState(config.reel)
  const { saving, saved, err, doSave } = useSave(onSave)

  return (
    <div>
      <SectionTitle title="Reel" desc="The showreel puzzle animation on the home page. Tiles assemble into the poster image, then the video fades in over it." />

      <div className={s.card}>
        <ImgField label="Poster image"
          hint="Used as the puzzle tile image. Recommended: 16:9, at least 1280×720."
          value={reel.posterSrc} onChange={v => setReel(r => ({ ...r, posterSrc: v }))}
          upload={upload} prefix="reel" ratio="16/9" maxW={400} />

        <Field label="Video source URL" hint="Mux, Cloudinary, or direct .mp4. Leave empty to show the poster only — no video loop.">
          <input type="text" value={reel.videoSrc} onChange={e => setReel(r => ({ ...r, videoSrc: e.target.value }))}
            placeholder="https://stream.mux.com/..." className={s.input} />
        </Field>

        <SaveBar saving={saving} saved={saved} err={err} onSave={() => doSave({ reel })} />
      </div>
    </div>
  )
}

// ─── Section: Directors ───────────────────────────────────────────────────────

function DirectorsSection({ config, onSave, upload }: { config: SiteConfig; onSave: (p: Partial<SiteConfig>) => Promise<boolean>; upload: (f: File, p: string) => Promise<string> }) {
  const [directors, setDirectors] = useState<Director[]>(config.directors)
  const { saving, saved, err, doSave } = useSave(onSave)
  const update = (i: number, patch: Partial<Director>) =>
    setDirectors(prev => prev.map((d, idx) => idx === i ? { ...d, ...patch } : d))

  return (
    <div>
      <SectionTitle title="Directors" desc="The three founders. Portrait photos appear in the scroll-driven card animation on the home page." />

      <div className="space-y-4">
        {directors.map((d, i) => (
          <div key={i} className={s.card}>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Director {i + 1} of {directors.length}
            </p>

            <FieldRow>
              <Field label="Full name">
                <input type="text" value={d.name} onChange={e => update(i, { name: e.target.value })} className={s.input} />
              </Field>
              <Field label="Role">
                <input type="text" value={d.role} onChange={e => update(i, { role: e.target.value })} className={s.input} />
              </Field>
            </FieldRow>

            <div className="mb-4">
              <Field label="Years experience">
                <input type="text" value={d.years} onChange={e => update(i, { years: e.target.value })} placeholder="18+" className={s.input} />
              </Field>
            </div>

            <div className="mb-4">
              <Field label="Bio note (shown on the card)">
                <textarea value={d.note} onChange={e => update(i, { note: e.target.value })} className={s.textarea} />
              </Field>
            </div>

            <ImgField label="Portrait photo" hint="Shown at 3:4 in the card. Clear headshot on a neutral background works best."
              value={d.portrait} onChange={v => update(i, { portrait: v })}
              upload={upload} prefix="directors" ratio="3/4" maxW={180} />
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 mt-5">
        <button onClick={() => doSave({ directors })} disabled={saving} className={s.btnPrimary}>
          {saving ? 'Saving…' : 'Save all directors'}
        </button>
        {saved && <span className="text-sm text-green-600 font-medium">✓ Saved</span>}
        {err   && <span className="text-sm text-red-600">{err}</span>}
      </div>
    </div>
  )
}

// ─── Section: About ───────────────────────────────────────────────────────────

function AboutSection({ config, onSave, upload }: { config: SiteConfig; onSave: (p: Partial<SiteConfig>) => Promise<boolean>; upload: (f: File, p: string) => Promise<string> }) {
  const [about, setAbout] = useState(config.about)
  const { saving, saved, err, doSave } = useSave(onSave)

  return (
    <div>
      <SectionTitle title="About" desc="The atmospheric photo panel in the origin story section. Currently a dark gradient — replace with the real photo of the triangular room." />

      <div className={s.card}>
        <ImgField label="Origin photo" hint="The triangular room at Mar Ivanios, Trivandrum. Appears as a 3:4 portrait panel."
          value={about.imageSrc} onChange={v => setAbout(a => ({ ...a, imageSrc: v }))}
          upload={upload} prefix="about" ratio="3/4" maxW={240} />

        <Field label="Image caption">
          <input type="text" value={about.imageCaption} onChange={e => setAbout(a => ({ ...a, imageCaption: e.target.value }))}
            placeholder="Mar Ivanios · Trivandrum" className={s.input} />
        </Field>

        <SaveBar saving={saving} saved={saved} err={err} onSave={() => doSave({ about })} />
      </div>
    </div>
  )
}

// ─── Section: Gallery ─────────────────────────────────────────────────────────

function GallerySection({ config, onSave, upload }: { config: SiteConfig; onSave: (p: Partial<SiteConfig>) => Promise<boolean>; upload: (f: File, p: string) => Promise<string> }) {
  const [reelStrip, setReelStrip] = useState(config.reelStrip)
  const { saving, saved, err, doSave } = useSave(onSave)

  type RowKey = 'rowA' | 'rowB' | 'rowC'
  const rows: { key: RowKey; label: string; dims: string }[] = [
    { key: 'rowA', label: 'Row A', dims: '420 × 240  (wide landscape, drifts left)' },
    { key: 'rowB', label: 'Row B', dims: '240 × 300  (portrait, drifts right)' },
    { key: 'rowC', label: 'Row C', dims: '340 × 220  (landscape, drifts left)' },
  ]

  // Per-row bulk upload progress: null = idle, { done, total } = uploading
  const [progress, setProgress] = useState<Record<RowKey, BulkUploadProgress | null>>({
    rowA: null, rowB: null, rowC: null,
  })

  const addUrl   = (row: RowKey) => setReelStrip(r => ({ ...r, [row]: [...r[row], ''] }))
  const delUrl   = (row: RowKey, i: number) => setReelStrip(r => ({ ...r, [row]: r[row].filter((_, idx) => idx !== i) }))
  const clearAll = (row: RowKey) => { if (confirm(`Clear all images in ${row}?`)) setReelStrip(r => ({ ...r, [row]: [] })) }
  const setUrl   = (row: RowKey, i: number, v: string) => setReelStrip(r => ({ ...r, [row]: r[row].map((u, idx) => idx === i ? v : u) }))
  const moveUrl  = (row: RowKey, i: number, dir: -1 | 1) => setReelStrip(r => {
    const j = i + dir; if (j < 0 || j >= r[row].length) return r
    return { ...r, [row]: swap(r[row], i, j) }
  })

  // Upload a single file and append the URL
  const uploadOne = async (row: RowKey, f: File): Promise<string> => {
    const url = await upload(f, 'gallery')
    setReelStrip(r => ({ ...r, [row]: [...r[row], url] }))
    return url
  }

  // Upload multiple files sequentially, showing progress
  const uploadBulk = async (row: RowKey, files: FileList) => {
    const list = Array.from(files)
    setProgress(p => ({ ...p, [row]: { done: 0, total: list.length } }))
    for (let i = 0; i < list.length; i++) {
      try { await uploadOne(row, list[i]) } catch { /* skip failed files */ }
      setProgress(p => ({ ...p, [row]: { done: i + 1, total: list.length } }))
    }
    setProgress(p => ({ ...p, [row]: null }))
  }

  return (
    <div>
      <SectionTitle title="Gallery" desc="Three-row image strip. Each row drifts at a different speed on scroll. Replace picsum placeholders with real work stills." />

      <div className="space-y-4">
        {rows.map(({ key, label, dims }) => (
          <div key={key} className={s.card}>
            {/* Row header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-800">{label}</h3>
                <span className="text-xs text-gray-400">{dims}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">{reelStrip[key].length} image{reelStrip[key].length !== 1 ? 's' : ''}</span>
                {reelStrip[key].length > 0 && (
                  <button onClick={() => clearAll(key)}
                    className="text-xs px-2 py-1 border border-red-200 text-red-500 rounded hover:bg-red-50 transition-colors">
                    Clear all
                  </button>
                )}
              </div>
            </div>

            {/* Thumbnail strip */}
            {reelStrip[key].length > 0 ? (
              <div className="flex gap-2 overflow-x-auto pb-2 mb-4" style={{ scrollbarWidth: 'thin' }}>
                {reelStrip[key].map((url, i) => (
                  <div key={i} className="relative flex-none group">
                    <div className="rounded border border-gray-200 overflow-hidden bg-gray-100" style={{ width: 100, height: 66 }}>
                      {url ? <img src={url} alt="" className="w-full h-full object-cover" /> : null}
                    </div>
                    <button
                      onClick={() => delUrl(key, i)}
                      className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white rounded-full text-[9px] leading-none items-center justify-center hidden group-hover:flex"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-16 border-2 border-dashed border-gray-200 rounded mb-4">
                <span className="text-xs text-gray-400">No images — upload or paste URLs below</span>
              </div>
            )}

            {/* Upload progress bar */}
            {progress[key] && (
              <div className="mb-3">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Uploading…</span>
                  <span>{progress[key]!.done} / {progress[key]!.total}</span>
                </div>
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all"
                    style={{ width: `${(progress[key]!.done / progress[key]!.total) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* URL list */}
            <div className="space-y-2 mb-3">
              {reelStrip[key].map((url, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 w-5 text-right shrink-0">{i + 1}</span>
                  <input type="text" value={url} onChange={e => setUrl(key, i, e.target.value)}
                    placeholder="https://..." className={s.input} />
                  <MoveButtons onUp={() => moveUrl(key, i, -1)} onDown={() => moveUrl(key, i, 1)} />
                  <button onClick={() => delUrl(key, i)} className={s.btnDanger}>×</button>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-100">
              <button onClick={() => addUrl(key)} className={s.btnSecondary}>+ Add URL</button>
              <UploadBtn onFile={f => uploadOne(key, f)} uploading={!!progress[key]} label="Upload 1 image" />
              <BulkUploadBtn onFiles={files => uploadBulk(key, files)} progress={progress[key]} label="Upload multiple" />
              <FolderUploadBtn onFiles={files => uploadBulk(key, files)} progress={progress[key]} />
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 mt-5">
        <button onClick={() => doSave({ reelStrip })} disabled={saving} className={s.btnPrimary}>
          {saving ? 'Saving…' : 'Save gallery'}
        </button>
        {saved && <span className="text-sm text-green-600 font-medium">✓ Saved</span>}
        {err   && <span className="text-sm text-red-600">{err}</span>}
      </div>
    </div>
  )
}

// ─── Section: Works ───────────────────────────────────────────────────────────

function WorksSection({ config, onSave, upload }: { config: SiteConfig; onSave: (p: Partial<SiteConfig>) => Promise<boolean>; upload: (f: File, p: string) => Promise<string> }) {
  const [works,    setWorks]    = useState<WorkConfig[]>(config.works)
  const [expanded, setExpanded] = useState<number | null>(null)
  const [filter,   setFilter]   = useState<'All' | WorkCategory>('All')
  const { saving, saved, err, doSave } = useSave(onSave)

  const updateWork = (i: number, patch: Partial<WorkConfig>) =>
    setWorks(prev => prev.map((w, idx) => idx === i ? { ...w, ...patch } : w))
  const addWork = () => {
    setWorks(prev => [...prev, { title: 'New Work', client: '', genre: '', category: 'Documentary', accent: '#1a3a20', srcs: [] }])
    setExpanded(works.length)
  }
  const removeWork = (i: number) => { setWorks(prev => prev.filter((_, idx) => idx !== i)); setExpanded(null) }
  const moveWork = (i: number, dir: -1 | 1) => {
    const j = i + dir; if (j < 0 || j >= works.length) return
    setWorks(prev => swap(prev, i, j)); setExpanded(j)
  }
  const addSrc    = (i: number) => updateWork(i, { srcs: [...works[i].srcs, ''] })
  const setSrc    = (i: number, si: number, v: string) => updateWork(i, { srcs: works[i].srcs.map((u, idx) => idx === si ? v : u) })
  const delSrc    = (i: number, si: number) => updateWork(i, { srcs: works[i].srcs.filter((_, idx) => idx !== si) })
  const moveSrc   = (i: number, si: number, dir: -1 | 1) => {
    const sj = si + dir; if (sj < 0 || sj >= works[i].srcs.length) return
    updateWork(i, { srcs: swap(works[i].srcs, si, sj) })
  }
  const uploadSrc = async (i: number, f: File) => {
    const url = await upload(f, 'works')
    updateWork(i, { srcs: [...works[i].srcs, url] })
  }

  const displayed = works.map((w, i) => ({ w, i })).filter(({ w }) => filter === 'All' || w.category === filter)

  return (
    <div>
      <SectionTitle title="Works" desc="All portfolio entries. Order here controls the featured sequence. Works without images are hidden from the scrolly section." />

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {(['All', ...WORK_CATEGORIES] as const).map(cat => (
          <button key={cat} onClick={() => setFilter(cat)}
            className={`px-3 py-1 text-xs rounded-full border transition-colors ${
              filter === cat ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}>
            {cat}
          </button>
        ))}
        <span className="text-xs text-gray-400 self-center ml-auto">{displayed.length} of {works.length}</span>
      </div>

      {/* Works list */}
      <div className="border border-gray-200 rounded-lg overflow-hidden mb-4 bg-white">
        {displayed.map(({ w, i }) => (
          <div key={i}>
            {/* Row */}
            <div
              className={`flex items-center gap-3 px-4 py-3 cursor-pointer border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors ${expanded === i ? 'bg-blue-50' : ''}`}
              onClick={() => setExpanded(expanded === i ? null : i)}
            >
              <span className="text-xs text-gray-400 w-6 text-right shrink-0">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{w.title}</p>
                {w.client && <p className="text-xs text-gray-400 truncate">{w.client}</p>}
              </div>
              <span className="text-xs text-gray-400 shrink-0 hidden sm:block">{w.category}</span>
              <span className="text-xs text-gray-400 shrink-0">{w.srcs.length} img{w.srcs.length !== 1 ? 's' : ''}</span>
              <MoveButtons onUp={() => moveWork(i, -1)} onDown={() => moveWork(i, 1)} />
              <span className="text-gray-400 text-sm shrink-0">{expanded === i ? '−' : '+'}</span>
            </div>

            {/* Expanded form */}
            {expanded === i && (
              <div className="px-6 py-5 border-b border-gray-100 bg-gray-50">
                <FieldRow>
                  <Field label="Title">
                    <input type="text" value={w.title} onChange={e => updateWork(i, { title: e.target.value })} className={s.input} />
                  </Field>
                  <Field label="Client">
                    <input type="text" value={w.client} onChange={e => updateWork(i, { client: e.target.value })} placeholder="Netflix" className={s.input} />
                  </Field>
                </FieldRow>

                <FieldRow>
                  <Field label="Genre / format">
                    <input type="text" value={w.genre} onChange={e => updateWork(i, { genre: e.target.value })} placeholder="Documentary Series" className={s.input} />
                  </Field>
                  <Field label="Category">
                    <select value={w.category} onChange={e => updateWork(i, { category: e.target.value as WorkCategory })} className={s.input}>
                      {WORK_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </Field>
                </FieldRow>

                <FieldRow>
                  <Field label="Award (optional)">
                    <input type="text" value={w.award ?? ''} onChange={e => updateWork(i, { award: e.target.value || undefined })}
                      placeholder="Best Editor — Asian TV Awards 2019" className={s.input} />
                  </Field>
                  <Field label="Accent colour">
                    <div className="flex gap-2 items-center">
                      <input type="color" value={w.accent} onChange={e => updateWork(i, { accent: e.target.value })}
                        className="h-9 w-12 p-0.5 border border-gray-200 rounded cursor-pointer" />
                      <input type="text" value={w.accent} onChange={e => updateWork(i, { accent: e.target.value })} className={s.input} />
                    </div>
                  </Field>
                </FieldRow>

                {/* Images */}
                <div className="mb-4">
                  <label className={s.label}>Images</label>
                  <div className="space-y-2 mb-2">
                    {w.srcs.map((src, si) => (
                      <div key={si} className="flex items-center gap-2">
                        <div className="shrink-0 w-14 h-10 rounded border border-gray-200 overflow-hidden bg-gray-100">
                          {src && <img src={src} alt="" className="w-full h-full object-cover" />}
                        </div>
                        <input type="text" value={src} onChange={e => setSrc(i, si, e.target.value)}
                          placeholder="https://pub-xxx.r2.dev/works/..." className={s.input} />
                        <MoveButtons onUp={() => moveSrc(i, si, -1)} onDown={() => moveSrc(i, si, 1)} />
                        <button onClick={() => delSrc(i, si)} className={s.btnDanger}>×</button>
                      </div>
                    ))}
                    {w.srcs.length === 0 && (
                      <p className="text-xs text-gray-400 py-2">No images — this work won&apos;t appear in the featured section.</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => addSrc(i)} className={s.btnSecondary}>+ Add URL</button>
                    <UploadBtn onFile={f => uploadSrc(i, f)} uploading={false} label="Upload to R2" />
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-200">
                  <button onClick={() => { if (confirm(`Remove "${w.title}"?`)) removeWork(i) }} className={s.btnDanger}>
                    Delete entry
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <button onClick={addWork} className={s.btnSecondary}>+ Add work entry</button>
        <div className="flex-1" />
        <button onClick={() => doSave({ works })} disabled={saving} className={s.btnPrimary}>
          {saving ? 'Saving…' : 'Save all works'}
        </button>
        {saved && <span className="text-sm text-green-600 font-medium">✓ Saved</span>}
        {err   && <span className="text-sm text-red-600">{err}</span>}
      </div>
    </div>
  )
}

// ─── Section: Clients ─────────────────────────────────────────────────────────

function ClientsSection({ config, onSave, upload }: { config: SiteConfig; onSave: (p: Partial<SiteConfig>) => Promise<boolean>; upload: (f: File, p: string) => Promise<string> }) {
  const [clients, setClients] = useState(config.clients)
  const { saving, saved, err, doSave } = useSave(onSave)

  type RowKey = 'row1' | 'row2' | 'row3'
  const rows: { key: RowKey; label: string }[] = [
    { key: 'row1', label: 'Row 1 — drifts left' },
    { key: 'row2', label: 'Row 2 — drifts right' },
    { key: 'row3', label: 'Row 3 — drifts left' },
  ]

  const addLogo  = (row: RowKey) => setClients(c => ({ ...c, [row]: [...c[row], { src: '', alt: '' }] }))
  const delLogo  = (row: RowKey, i: number) => setClients(c => ({ ...c, [row]: c[row].filter((_, idx) => idx !== i) }))
  const moveLogo = (row: RowKey, i: number, dir: -1 | 1) => setClients(c => {
    const j = i + dir; if (j < 0 || j >= c[row].length) return c
    return { ...c, [row]: swap(c[row], i, j) }
  })
  const setLogo  = (row: RowKey, i: number, patch: Partial<Logo>) =>
    setClients(c => ({ ...c, [row]: c[row].map((l, idx) => idx === i ? { ...l, ...patch } : l) }))
  const handleUpload = async (row: RowKey, f: File) => {
    const url = await upload(f, 'logos')
    setClients(c => ({ ...c, [row]: [...c[row], { src: url, alt: f.name.replace(/\.[^.]+$/, '') }] }))
  }

  return (
    <div>
      <SectionTitle title="Clients" desc="Three rows of logos that drift in alternating directions on scroll. Local files live in /public/logos/ — or use full URLs." />

      <div className="space-y-4">
        {rows.map(({ key, label }) => (
          <div key={key} className={s.card}>
            <h3 className="text-sm font-semibold text-gray-800 mb-4">{label}</h3>

            {/* Logo preview strip */}
            <div className="flex flex-wrap gap-2 mb-4">
              {clients[key].map((logo, i) => (
                <div key={i} className="border border-gray-200 rounded bg-gray-50 flex items-center justify-center"
                  style={{ width: 88, height: 50 }}>
                  {logo.src
                    ? <img src={logo.src} alt={logo.alt} className="max-w-full max-h-full object-contain p-1.5" />
                    : <span className="text-xs text-gray-300">Empty</span>}
                </div>
              ))}
            </div>

            {/* Logo list */}
            <div className="space-y-2 mb-3">
              {clients[key].map((logo, i) => (
                <div key={i} className="flex items-center gap-2 p-2 border border-gray-100 rounded bg-gray-50">
                  <span className="text-xs text-gray-400 w-5 text-right shrink-0">{i + 1}</span>
                  <input type="text" value={logo.src} onChange={e => setLogo(key, i, { src: e.target.value })}
                    placeholder="/logos/netflix.png or https://..." className={s.input} />
                  <input type="text" value={logo.alt} onChange={e => setLogo(key, i, { alt: e.target.value })}
                    placeholder="Alt text" className={`${s.input} max-w-[120px]`} />
                  <MoveButtons onUp={() => moveLogo(key, i, -1)} onDown={() => moveLogo(key, i, 1)} />
                  <button onClick={() => delLogo(key, i)} className={s.btnDanger}>×</button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <button onClick={() => addLogo(key)} className={s.btnSecondary}>+ Add logo</button>
              <UploadBtn onFile={f => handleUpload(key, f)} uploading={false} label="Upload logo" />
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 mt-5">
        <button onClick={() => doSave({ clients })} disabled={saving} className={s.btnPrimary}>
          {saving ? 'Saving…' : 'Save clients'}
        </button>
        {saved && <span className="text-sm text-green-600 font-medium">✓ Saved</span>}
        {err   && <span className="text-sm text-red-600">{err}</span>}
      </div>
    </div>
  )
}

// ─── Section: Site meta ───────────────────────────────────────────────────────

function SiteSection({ config, onSave }: { config: SiteConfig; onSave: (p: Partial<SiteConfig>) => Promise<boolean> }) {
  const [meta, setMeta] = useState(config.meta)
  const { saving, saved, err, doSave } = useSave(onSave)
  const update = (patch: Partial<typeof meta>) => setMeta(m => ({ ...m, ...patch }))

  return (
    <div>
      <SectionTitle title="Site" desc="Studio name, contact details, and meta copy. Appears in the contact footer, nav, and page metadata." />

      <div className={s.card}>
        <FieldRow>
          <Field label="Studio name">
            <input type="text" value={meta.studioName} onChange={e => update({ studioName: e.target.value })} className={s.input} />
          </Field>
          <Field label="Established year">
            <input type="text" value={meta.established} onChange={e => update({ established: e.target.value })} placeholder="2025" className={s.input} />
          </Field>
        </FieldRow>

        <div className="mb-4">
          <Field label="Tagline">
            <input type="text" value={meta.tagline} onChange={e => update({ tagline: e.target.value })}
              placeholder="New company. Not new at this." className={s.input} />
          </Field>
        </div>

        <FieldRow>
          <Field label="Email">
            <input type="email" value={meta.email} onChange={e => update({ email: e.target.value })}
              placeholder="connect@triangleroom.in" className={s.input} />
          </Field>
          <Field label="Phone">
            <input type="tel" value={meta.phone} onChange={e => update({ phone: e.target.value })}
              placeholder="+91 98464 97008" className={s.input} />
          </Field>
        </FieldRow>

        <div className="mb-4">
          <Field label="Location">
            <input type="text" value={meta.location} onChange={e => update({ location: e.target.value })}
              placeholder="Trivandrum, Kerala" className={s.input} />
          </Field>
        </div>

        <SaveBar saving={saving} saved={saved} err={err} onSave={() => doSave({ meta })} />
      </div>
    </div>
  )
}

// ─── Section: Page Order ──────────────────────────────────────────────────────

function SectionsOrderSection({ config, onSave }: { config: SiteConfig; onSave: (p: Partial<SiteConfig>) => Promise<boolean> }) {
  const [sections, setSections] = useState<SectionConfig[]>(config.sections)
  const { saving, saved, err, doSave } = useSave(onSave)

  const move   = (i: number, dir: -1 | 1) => setSections(prev => { const j = i + dir; if (j < 0 || j >= prev.length) return prev; return swap(prev, i, j) })
  const toggle = (i: number) => setSections(prev => prev.map((s, idx) => idx === i ? { ...s, enabled: !s.enabled } : s))

  return (
    <div>
      <SectionTitle title="Page Order" desc="Control which sections appear on the home page and in what order. Note: changes require a server restart to apply." />

      <div className="border border-gray-200 rounded-lg overflow-hidden bg-white mb-5">
        {sections.map((sec, i) => (
          <div key={sec.id}
            className={`flex items-center gap-3 px-4 py-3 border-b border-gray-100 last:border-0 ${!sec.enabled ? 'opacity-50' : ''}`}>

            {/* Toggle */}
            <button
              onClick={() => toggle(i)}
              className={`relative shrink-0 w-9 h-5 rounded-full border transition-colors ${sec.enabled ? 'bg-blue-600 border-blue-600' : 'bg-gray-200 border-gray-300'}`}
            >
              <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${sec.enabled ? 'left-4' : 'left-0.5'}`} />
            </button>

            <span className="text-sm font-medium text-gray-700 flex-1">{sec.label}</span>
            <span className="text-xs text-gray-400 font-mono shrink-0">{sec.id}</span>
            <MoveButtons onUp={() => move(i, -1)} onDown={() => move(i, 1)} />
          </div>
        ))}
      </div>

      <SaveBar saving={saving} saved={saved} err={err} onSave={() => doSave({ sections })} />
    </div>
  )
}

// ─── Password gate ────────────────────────────────────────────────────────────

function PasswordGate({ onLogin, loading, error }: { onLogin: (pw: string) => void; loading: boolean; error: string }) {
  const [pw, setPw] = useState('')

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 w-full max-w-sm">
        <div className="mb-6">
          <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center mb-4">
            <img src="/brand/mark-white.svg" alt="" className="w-5 h-5 object-contain" />
          </div>
          <h1 className="text-xl font-semibold text-gray-900">Triangle Room</h1>
          <p className="text-sm text-gray-500 mt-1">Admin Console</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Access key</label>
          <input
            type="password"
            value={pw}
            autoFocus
            onChange={e => setPw(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && pw && onLogin(pw)}
            placeholder="Enter your admin password"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
        </div>

        <button
          onClick={() => pw && onLogin(pw)}
          disabled={loading || !pw}
          className="w-full py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          {loading ? 'Verifying…' : 'Sign in'}
        </button>

        <p className="text-xs text-gray-400 mt-4 text-center">
          Set <code className="bg-gray-100 px-1 rounded">ADMIN_SECRET</code> in .env.local
        </p>
      </div>
    </div>
  )
}

// ─── Root layout ──────────────────────────────────────────────────────────────

export default function AdminPage() {
  const { token, config, authLoading, authError, initDone, login, save, upload } = useAdmin()
  const [section, setSection] = useState<Section>('reel')

  // Set [data-admin] on <html> — this disables the site-wide cursor:none rule
  // in globals.css so native cursor behaviour works throughout the admin.
  useEffect(() => {
    document.documentElement.setAttribute('data-admin', '')
    return () => document.documentElement.removeAttribute('data-admin')
  }, [])

  if (!initDone) {
    return (
      <div className="admin-root min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex gap-2">
          {[0, 1, 2].map(i => (
            <div key={i} className="w-2 h-2 bg-gray-300 rounded-full animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }} />
          ))}
        </div>
      </div>
    )
  }

  if (!token || !config) {
    return (
      <div className="admin-root">
        <PasswordGate onLogin={login} loading={authLoading} error={authError} />
      </div>
    )
  }

  return (
    <div className="admin-root flex min-h-screen bg-gray-50 text-gray-900" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>

      {/* Sidebar */}
      <aside className="w-56 shrink-0 bg-gray-900 flex flex-col">
        {/* Brand */}
        <div className="px-5 py-5 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-gray-700 rounded flex items-center justify-center shrink-0">
              <img src="/brand/mark-white.svg" alt="" className="w-4 h-4 object-contain" />
            </div>
            <div>
              <p className="text-sm font-medium text-white leading-tight">Triangle Room</p>
              <p className="text-xs text-gray-500 leading-tight">Admin</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {NAV.map(({ id, label, icon }) => (
            <button key={id} onClick={() => setSection(id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-left transition-colors ${
                section === id
                  ? 'bg-blue-600 text-white font-medium'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}>
              <span className="text-base leading-none">{icon}</span>
              {label}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-800">
          <a href="/" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
            ← View site
          </a>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shrink-0">
          <h1 className="text-base font-semibold text-gray-800">
            {NAV.find(n => n.id === section)?.label}
          </h1>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400" />
            <span className="text-xs text-gray-500">Changes apply on next page load</span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-3xl">
            {section === 'reel'      && <ReelSection         config={config} onSave={save} upload={upload} />}
            {section === 'directors' && <DirectorsSection     config={config} onSave={save} upload={upload} />}
            {section === 'about'     && <AboutSection         config={config} onSave={save} upload={upload} />}
            {section === 'gallery'   && <GallerySection       config={config} onSave={save} upload={upload} />}
            {section === 'works'     && <WorksSection         config={config} onSave={save} upload={upload} />}
            {section === 'clients'   && <ClientsSection       config={config} onSave={save} upload={upload} />}
            {section === 'site'      && <SiteSection          config={config} onSave={save} />}
            {section === 'sections'  && <SectionsOrderSection config={config} onSave={save} />}
          </div>
        </main>
      </div>

    </div>
  )
}
