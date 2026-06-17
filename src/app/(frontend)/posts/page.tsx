import type { Metadata } from 'next/types'
import Link from 'next/link'
import React from 'react'

import { CollectionArchive } from '@/components/CollectionArchive'
import { Pagination } from '@/components/Pagination'
import { PageHeaderBlock } from '@/blocks/PageHeader/Component'
import PageClient from './page.client'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function Page() {
  const payload = await getPayload({ config: configPromise })

  const [categories, posts] = await Promise.all([
    payload.find({
      collection: 'categories',
      depth: 0,
      limit: 100,
      sort: 'title',
      select: { title: true, slug: true },
    }),
    payload.find({
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
    }),
  ])

  return (
    <div>
      <PageHeaderBlock title="News & Updates" />
      <PageClient />

      <div className="container my-16 grid grid-cols-12 gap-6">
        {/* Sidebar */}
        <aside className="col-span-12 md:col-span-3">
          <div className="lg:sticky lg:top-24 h-fit rounded-lg border border-themeBlue/10 bg-themeBlue/5 p-5">
            <div className="text-lg font-semibold mb-3">Categories</div>

            <nav className="space-y-1">
              <Link className="block rounded-lg p-3 bg-themeBlue/20 duration-500" href="/posts">
                <div className="text-sm font-medium leading-snug line-clamp-1">All posts</div>
              </Link>
              {categories.docs?.map((cat) => (
                <Link
                  key={cat.slug}
                  className="block rounded-lg bg-white p-3 hover:bg-themeBlue/20 duration-500"
                  href={`/posts/category/${cat.slug}`}
                >
                  <div className="text-sm font-medium leading-snug line-clamp-1">{cat.title}</div>
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main */}
        <main className="col-span-12 md:col-span-9">
          <CollectionArchive posts={posts.docs} />

          <div className="mt-10">
            {posts.totalPages > 1 && posts.page && (
              <Pagination page={posts.page} totalPages={posts.totalPages} />
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `PRiGma Classes (IIT JEE MAINS & ADVANCED) Posts`,
  }
}
