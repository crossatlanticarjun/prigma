import canUseDOM from './canUseDOM'

const clean = (url: string) => url.replace(/\/$/, '')

export const getServerSideURL = (): string => {
  // Prefer explicit envs
  const fromEnv = process.env.PAYLOAD_PUBLIC_SERVER_URL || process.env.NEXT_PUBLIC_SERVER_URL || ''

  if (fromEnv) return clean(fromEnv)

  // Vercel runtime envs (most reliable)
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`

  // Fallbacks
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  }

  return 'http://localhost:3000'
}

export const getClientSideURL = (): string => {
  if (canUseDOM) {
    const { protocol, hostname, port } = window.location
    return clean(`${protocol}//${hostname}${port ? `:${port}` : ''}`)
  }

  // SSR fallbacks
  return getServerSideURL()
}
