'use client'

import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

interface NavLink {
  label: string
  href: string
}

interface MobileMenuPanelProps {
  open: boolean
  onClose: () => void
  links: readonly NavLink[]
}

const panelEase: [number, number, number, number] = [0.76, 0, 0.24, 1]
const linkEase: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94]

export default function MobileMenuPanel({ open, onClose, links }: MobileMenuPanelProps) {
  // Lock background scroll and allow Escape-to-close while the panel is open.
  useEffect(() => {
    if (!open) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    // Tailwind's `lg` breakpoint — matches where the desktop bar takes over.
    const onResize = () => {
      if (window.innerWidth >= 1024) onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('resize', onResize)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('resize', onResize)
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-40 flex flex-col bg-ink lg:hidden"
          initial={{ clipPath: 'inset(0 0 100% 0)' }}
          animate={{ clipPath: 'inset(0 0 0% 0)' }}
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          transition={{ duration: 0.55, ease: panelEase }}
        >
          <nav className="flex flex-1 flex-col items-start justify-center gap-1 px-8">
            {links.map(({ label, href }, i) => (
              <motion.a
                key={label}
                href={href}
                onClick={onClose}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.45, delay: 0.18 + i * 0.07, ease: linkEase }}
                className="py-2 font-display text-[13vw] font-medium uppercase leading-[1.05] text-fg"
              >
                {label}
              </motion.a>
            ))}
          </nav>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="flex items-center justify-between border-t border-edge px-8 py-6 font-mono text-[10px] uppercase tracking-[0.3em] text-fg/30"
          >
            <span>Triangle Room</span>
            <span>Trivandrum, Kerala</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
