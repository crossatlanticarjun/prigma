// src/utilities/mediaUrl.ts

type MediaLike =
  | {
      url?: string | null
      alt?: string | null
      sizes?: {
        thumbnail?: { url?: string | null }
        small?: { url?: string | null }
        medium?: { url?: string | null }
        large?: { url?: string | null }
      } | null
    }
  | string
  | null
  | undefined

const S3_BASE = process.env.NEXT_PUBLIC_S3_BASE_URL?.replace(/\/+$/, '') // no trailing slash

function isAbsoluteUrl(u: string) {
  return /^https?:\/\//i.test(u)
}

function isBad(u: string) {
  return !u || u.includes('undefined') || u === 'null'
}

/**
 * Returns:
 * - absolute https URL (S3 / vercel blob / external)
 * - or relative path starting with "/"
 * - or null if unusable
 */
export function resolveMediaUrl(media: MediaLike): string | null {
  if (!media) return null

  const candidate =
    typeof media === 'string'
      ? media
      : (media.sizes?.large?.url ??
        media.sizes?.medium?.url ??
        media.sizes?.small?.url ??
        media.sizes?.thumbnail?.url ??
        media.url ??
        '')

  const raw = String(candidate || '').trim()
  if (isBad(raw)) return null

  // absolute URL already
  if (isAbsoluteUrl(raw)) return raw

  // If DB stores "pigma/xyz.webp" or "images/xyz.webp" (no slash)
  const normalizedPath = raw.startsWith('/') ? raw : `/${raw}`

  // If you want to force non-absolute paths to S3, do it here:
  // This fixes cases where your DB still has "images/abc.webp" instead of full S3 URL.
  if (S3_BASE) {
    // Remove leading slash so S3_BASE + "/" + key is correct
    const key = normalizedPath.replace(/^\/+/, '')
    return `${S3_BASE}/${key}`
  }

  // fallback: return safe relative path for Next
  return normalizedPath
}

export function resolveMediaAlt(media: MediaLike, fallback: string): string {
  if (!media || typeof media === 'string') return fallback
  return (media.alt ?? fallback) || fallback
}
