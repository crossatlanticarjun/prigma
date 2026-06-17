import { cache } from 'react'
import type { Header } from '@/payload-types'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export const getHeaderGlobal = cache(async (): Promise<Header> => {
  const payload = await getPayload({ config: configPromise })

  const header = await payload.findGlobal({
    slug: 'header',
    depth: 2,
  })

  return header as Header
})
