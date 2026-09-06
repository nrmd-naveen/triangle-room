import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin — Triangle Room',
  robots: 'noindex, nofollow',
}

/**
 * Admin layout — overrides the site-wide cursor:none rule from globals.css.
 * Uses :has(.admin-root) so the specificity wins over the bare * selector.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`
        /* Hide the site grain overlay on admin pages */
        html[data-admin] .grain { display: none; }
      `}</style>
      {children}
    </>
  )
}
