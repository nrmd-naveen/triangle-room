// ── Pick one variant, comment the rest ──────────────────────────────────────
//
// V1 — The Cut      Horizontal film strip. Scroll vertically → reel travels sideways.
//                   Signature: vertical playhead line + timecode labels.
//
// V2 — Dossier      Sticky split: left = scrollable list, right = image panel.
//                   Signature: images crossfade as you scroll through the list.
//
// V3 — Layer        Stacked cards. Each project rises from below, previous scales back.
//                   Signature: physical depth / deck-of-frames feeling.
//
// V4 — EDL          Monospace table (Edit Decision List format). Hover → photo preview.
//                   Signature: insider editor language + cursor-following image preview.
//
// V5 — Archive      Mosaic grid. Category filter. All 27 works at a glance.
//                   Signature: staggered assembly + varied card sizes.
//
// ────────────────────────────────────────────────────────────────────────────

import WorksFeatured from '@/components/works/WorksFeatured'
import WorksV4 from '@/components/works/WorksV4'

export const metadata = {
  title: 'Work — Triangle Room',
  description: 'Selected projects across documentary, sports, reality, and brand film.',
}

export default function WorksPage() {
  return (
    <>
      <WorksFeatured />
      {/* <WorksV4 /> */}
    </>
  )
}
