import { readConfig } from '@/lib/site-config'
import HomeClient from '@/components/HomeClient'

// Server component — reads config from config/site.json at request time.
// Changes saved via the admin UI (/admin) apply on the next page load
// without a rebuild.
export default async function Home() {
  const config = await readConfig()
  return <HomeClient config={config} />
}
