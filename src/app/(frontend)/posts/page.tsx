import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import { Pagination } from '@/components/Pagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import PageClient from './page.client'
import { PageHeaderBlock } from '@/blocks/PageHeader/Component'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function Page() {
  const payload = await getPayload({ config: configPromise })

  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 12,
    overrideAccess: false,
    select: {
      title: true,
      slug: true,
      categories: true,
      content: true,
      meta: true,
    },
  })

  return (
    <div className="">
      <PageHeaderBlock title="News & Updates" />

      <PageClient />

      <div className="my-16">
        <CollectionArchive posts={posts.docs} />
      </div>

      <div className="container mb-16">
        {posts.totalPages > 1 && posts.page && (
          <Pagination page={posts.page} totalPages={posts.totalPages} />
        )}
      </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `PRiGma Classes (IIT JEE MAINS & ADVANCED) Posts`,
  }
}
