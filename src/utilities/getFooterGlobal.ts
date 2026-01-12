import { cache } from 'react'
import type { Footer } from '@/payload-types'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export const getFooterGlobal = cache(async (): Promise<Footer> => {
  const payload = await getPayload({ config: configPromise })

  const footer = await payload.findGlobal({
    slug: 'footer',
    depth: 2,
  })

  return footer as Footer
})
