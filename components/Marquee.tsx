'use client'

const TEXT =
  'NEW COMPANY · NOT NEW AT THIS · DOCUMENTARY · REALITY · LIVE · MUSIC · FICTION · AD-FILM · POST · THREE CAREERS · ONE COMPANY · '

export default function Marquee() {
  const full = TEXT + TEXT + TEXT + TEXT

  return (
    <div className="w-full overflow-hidden bg-ink border-y border-edge py-3.5">
      <div className="marquee-track flex whitespace-nowrap" style={{ width: 'max-content' }}>
        <span className="font-mono text-[9.5px] tracking-[0.4em] uppercase text-fg/30">
          {full}
        </span>
      </div>
    </div>
  )
}
