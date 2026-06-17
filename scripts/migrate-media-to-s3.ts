import 'dotenv/config'
import path from 'node:path'
import payload from 'payload'
import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3'

/**
 * SETTINGS
 * Keep PREFIX consistent with your desired S3 folder.
 * Example final URL: https://<bucket>.s3.<region>.amazonaws.com/images/<filename>
 */
const PREFIX = 'images'

const BUCKET = process.env.S3_BUCKET
const REGION = process.env.S3_REGION

if (!BUCKET || !REGION) throw new Error('Missing S3_BUCKET or S3_REGION')
if (!process.env.S3_ACCESS_KEY_ID || !process.env.S3_SECRET_ACCESS_KEY) {
  throw new Error('Missing S3_ACCESS_KEY_ID or S3_SECRET_ACCESS_KEY')
}
if (!process.env.PAYLOAD_SECRET) throw new Error('Missing PAYLOAD_SECRET')
if (!process.env.DATABASE_URL) throw new Error('Missing DATABASE_URL')

type MediaSize = { url?: string | null } | null | undefined
type MediaDoc = {
  id: string
  filename?: string | null
  url?: string | null
  sizes?: {
    thumbnail?: MediaSize
    small?: MediaSize
    medium?: MediaSize
    large?: MediaSize
  } | null
}

const s3 = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
})

function isHttp(url: unknown): boolean {
  return /^https?:\/\//i.test(String(url ?? ''))
}

function looksBroken(url: unknown): boolean {
  const s = String(url ?? '')
  return !s || s.includes('undefined')
}

function isAlreadyOnTargetS3(url: string | null | undefined): boolean {
  if (!url) return false
  const base = `https://${BUCKET}.s3.${REGION}.amazonaws.com/${PREFIX}/`
  return url.startsWith(base)
}

async function headKey(key: string): Promise<boolean> {
  try {
    await s3.send(new HeadObjectCommand({ Bucket: BUCKET!, Key: key }))
    return true
  } catch {
    return false
  }
}

function contentTypeFromKey(key: string): string {
  const ext = path.extname(key).toLowerCase()
  if (ext === '.png') return 'image/png'
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg'
  if (ext === '.webp') return 'image/webp'
  if (ext === '.gif') return 'image/gif'
  if (ext === '.svg') return 'image/svg+xml'
  return 'application/octet-stream'
}

async function uploadFromUrlToS3(url: string, key: string): Promise<void> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Download failed ${res.status} for ${url}`)

  const body = Buffer.from(await res.arrayBuffer())

  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET!,
      Key: key,
      Body: body,
      ContentType: contentTypeFromKey(key),
      CacheControl: 'public, max-age=31536000, immutable',
      // no ACL here
    }),
  )
}

function makeS3Url(key: string): string {
  return `https://${BUCKET}.s3.${REGION}.amazonaws.com/${key}`
}

function pickSourceUrl(doc: MediaDoc): string | null {
  const candidates = [
    doc.sizes?.large?.url,
    doc.sizes?.medium?.url,
    doc.sizes?.small?.url,
    doc.sizes?.thumbnail?.url,
    doc.url,
  ].filter((v): v is string => typeof v === 'string' && v.trim().length > 0)

  return candidates.find((u) => isHttp(u) && !looksBroken(u)) ?? null
}

async function main(): Promise<void> {
  // ✅ IMPORTANT: init without importing payload.config (prevents SCSS / admin UI imports)
  await payload.init({
    secret: process.env.PAYLOAD_SECRET!,
    mongoURL: process.env.DATABASE_URL!,
    local: true,
  } as any)

  let page = 1
  const limit = 50

  while (true) {
    const result = await payload.find({ collection: 'media', limit, page })
    const docs = (result.docs as MediaDoc[]) ?? []
    if (!docs.length) break

    for (const doc of docs) {
      const filename = doc.filename?.trim()
      if (!filename) {
        console.log(`SKIP (missing filename): ${doc.id}`)
        continue
      }

      if (isAlreadyOnTargetS3(doc.url)) {
        console.log(`SKIP (already on S3): ${filename}`)
        continue
      }

      const sourceUrl = pickSourceUrl(doc)
      if (!sourceUrl) {
        console.log(`SKIP (no valid source URL): ${filename}`)
        continue
      }

      const key = `${PREFIX}/${filename}`
      const newUrl = makeS3Url(key)

      const exists = await headKey(key)
      if (!exists) {
        console.log(`UPLOAD: ${filename} <- ${sourceUrl}`)
        await uploadFromUrlToS3(sourceUrl, key)
      } else {
        console.log(`EXISTS: ${filename}`)
      }

      const data: any = {
        url: newUrl,
        sizes: doc.sizes
          ? {
              ...doc.sizes,
              thumbnail: doc.sizes.thumbnail ? { ...doc.sizes.thumbnail, url: newUrl } : undefined,
              small: doc.sizes.small ? { ...doc.sizes.small, url: newUrl } : undefined,
              medium: doc.sizes.medium ? { ...doc.sizes.medium, url: newUrl } : undefined,
              large: doc.sizes.large ? { ...doc.sizes.large, url: newUrl } : undefined,
            }
          : undefined,
      }

      await payload.update({ collection: 'media', id: doc.id, data })
      console.log(`UPDATED: ${filename} -> ${newUrl}`)
    }

    if (!result.hasNextPage) break
    page += 1
  }

  console.log('DONE')
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
