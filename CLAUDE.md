# Afterglow — Production House Site

## What this is
A high-end marketing site for a video production/edit house, built to Awwwards
quality — not a template with a dark background and some fade-ins, but a site with a
genuine point of view and a signature moment someone would screenshot and share.

## Reference points (for feel and craft level, not to copy)
- https://monolithstudio.com/
- https://landonorris.com/
Study how these handle pacing, restraint, and the relationship between scroll and
transformation — not the literal visual choices. The bar is: does this feel directed,
like someone made deliberate decisions about every transition, or does it feel
assembled from stock effects.

## The essence
This is an editing house — people who take raw footage and shape it into something
that moves an audience. The site should carry that sensibility: precision, rhythm,
craft, an eye for the exact right cut. Cinematic and premium, not loud. Confidence
expressed through restraint and timing rather than density of effects.

The flow should feel authored — like moving through something that was composed,
not a stack of sections that happen to be in a row. Scroll should feel like it's
revealing a story that was already there, not triggering a checklist of effects.

## Creative direction — open, not prescribed
Don't treat this as a spec to implement literally. Propose the actual visual and
interaction language yourself: the hero treatment, the transition logic between
sections, the signature interaction that makes the site memorable, the pacing of
reveals. Bring a real point of view and defend the choices. The one hard constraint
is the quality bar — everything should feel intentional, premium, and specific to
this subject, not a generic "dark scroll site" default.

Where you're unsure whether an idea is distinctive or generic-default, flag it and
propose an alternative rather than defaulting to the safe choice.

## Tech stack (decided — don't relitigate without discussion)
- **Next.js** (App Router, TypeScript)
- **Tailwind CSS** for utility styling
- **GSAP + ScrollTrigger** for scroll-linked animation
- **Lenis** (`@studio-freight/lenis` or current maintained fork) for smooth scroll,
  wired into GSAP's ScrollTrigger per their official integration docs
- **Framer Motion** only for simple UI-level transitions (menu open/close, hover
  states) — GSAP owns scroll-driven work
- Video: real reel footage once available, served via an optimized pipeline
  (Mux/Cloudinary or similar) — not raw unoptimized files in /public
- Fonts: self-hosted via next/font

## Real content (from client reel — use this, don't invent placeholder case studies)

**House name:** Afterglow — PLACEHOLDER, confirm real studio/company name before launch

**Positioning:** Edit & post house working across documentary, sports, reality,
travel, and ad-film content for major streaming and broadcast clients.

**Major clients:**
Netflix, National Geographic, Discovery Channel, Mercedes-Benz, Formula 1, L'Oréal
Paris, Prime Video, Disney+ Hotstar, JioCinema, Fox Life, Star Sports, Colors HD,
NDTV Prime, Epic Channel, Olympic Channel

**Selected work (for reel/case studies):**
| Project | Client | Genre |
|---|---|---|
| The Greatest Rivalry | Netflix | Documentary Series |
| Tarini | National Geographic | Documentary Film — Asian Television Awards Best Editor Nominee 2019 |
| Fabulous Lives of Bollywood Wives | Netflix | Reality Series |
| India from Above | National Geographic (UK) | Documentary Series |
| Great Overland Adventure 2 | Mercedes-Benz / NDTV Prime | Travel Series |
| Formula 1 After Movie | Abu Dhabi Grand Prix | Motorsport Film |
| ICC Cricket World Cup 2015 | Star Sports | Live Sports Highlights |
| Doubles Trouble | Olympic Channel | Documentary |
| Wrestling My Family | Olympic Channel | Docu-Reality |

**Award:** Best Editor Nomination for "Tarini" — 24th Asian Television Awards, 2019

Full source reel/CV: see `/context/reel-source.pdf` (add this file to the repo so
future sessions can reference it directly instead of relying on this summary)

## Conventions
- Component files: PascalCase, one component per file, colocate GSAP logic in a
  `useGSAP` hook (via `@gsap/react`) not raw `useEffect`
- Respect `prefers-reduced-motion` — provide a real reduced-motion fallback for every
  scroll-triggered animation, not just a global kill-switch
- Keep distinct interaction/animation ideas as separate components so they can be
  iterated on independently

## Open decisions (ask before assuming)
- Final studio name and whether the site frames Anu as founder/lead editor or as a
  broader multi-editor house
- Whether hero uses real reel footage (canvas-scrubbed image sequence) or video loop
- CMS needs — is work/case-study content going to be hardcoded or pulled from a CMS
  (Sanity/Contentful) for future updates without a redeploy
