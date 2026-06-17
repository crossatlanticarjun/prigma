import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function getFormBySlug(slug: string) {
  const payload = await getPayload({ config: configPromise })

  const res = await payload.find({
    collection: 'forms',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  })

  return res.docs?.[0] ?? null
}
