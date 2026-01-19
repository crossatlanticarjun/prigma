import type { Metadata } from 'next/types'
import Link from 'next/link'
import React from 'react'
import { notFound } from 'next/navigation'

import { CollectionArchive } from '@/components/CollectionArchive'
import { Pagination } from '@/components/Pagination'
import { PageHeaderBlock } from '@/blocks/PageHeader/Component'
import PageClient from '../../page.client'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

export const dynamic = 'force-static'
export const revalidate = 600

type Args = {
  params: Promise<{
    slug?: string
  }>
  // Optional, only if you later want ?page=2 support
  searchParams?: Promise<{
    page?: string
  }>
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })

  const categories = await payload.find({
    collection: 'categories',
    depth: 0,
    limit: 1000,
    pagination: false,
    select: { slug: true },
  })

  return categories.docs
    .map((c) => c.slug)
    .filter(Boolean)
    .map((slug) => ({ slug }))
}

export default async function CategoryPage({ params: paramsPromise }: Args) {
  const payload = await getPayload({ config: configPromise })
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)

  // Sidebar categories
  const categoriesRes = await payload.find({
    collection: 'categories',
    depth: 0,
    limit: 1000,
    sort: 'title',
    select: { id: true, title: true, slug: true },
  })

  // Current category by slug (this is what sets the category name)
  const categoryRes = await payload.find({
    collection: 'categories',
    depth: 0,
    limit: 1,
    pagination: false,
    where: { slug: { equals: decodedSlug } },
    select: { id: true, title: true, slug: true },
  })

  const category = categoryRes.docs?.[0]
  if (!category) notFound()

  // Posts in this category (works for hasMany OR hasOne relationship)
  const postsRes = await payload.find({
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
    where: {
      or: [
        { categories: { contains: category.id } }, // hasMany
        { categories: { equals: category.id } }, // hasOne
      ],
    },
  })

  const hasPosts = postsRes.docs?.length > 0

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
              <Link
                className="block rounded-lg bg-white p-3 hover:bg-themeBlue/20 duration-500"
                href="/posts"
              >
                <div className="text-sm font-medium leading-snug line-clamp-1">All posts</div>
              </Link>

              {categoriesRes.docs?.map((cat) => {
                const isActive = cat.slug === decodedSlug

                return (
                  <Link
                    key={cat.id}
                    className={`block rounded-lg bg-white p-3 hover:bg-themeBlue/20 duration-500 ${
                      isActive ? 'bg-themeBlue/20' : ''
                    }`}
                    href={`/posts/category/${cat.slug}`}
                  >
                    <div className="text-sm font-medium leading-snug line-clamp-1">{cat.title}</div>
                  </Link>
                )
              })}
            </nav>
          </div>
        </aside>

        {/* Main */}
        <main className="col-span-12 md:col-span-9">
          {/* Category title */}
          <div className="mb-6">
            <div className="text-sm text-slate-600">Category</div>
            <h1 className="text-2xl font-semibold">{category.title}</h1>
          </div>

          {hasPosts ? (
            <>
              <CollectionArchive posts={postsRes.docs} />

              <div className="mt-10">
                {postsRes.totalPages > 1 && postsRes.page && (
                  <Pagination page={postsRes.page} totalPages={postsRes.totalPages} />
                )}
              </div>
            </>
          ) : (
            <div className="rounded-lg border border-themeBlue/10 bg-themeBlue/5 p-6">
              <div className="text-lg font-semibold">No posts yet</div>
              <p className="mt-2 text-slate-700">
                This category is currently in stealth mode. No content has shipped here yet.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href="/posts"
                  className="rounded-lg bg-white px-4 py-2 text-sm font-medium hover:bg-themeBlue/20 duration-500"
                >
                  Browse all posts
                </Link>

                {categoriesRes.docs?.slice(0, 5).map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/posts/category/${cat.slug}`}
                    className="rounded-lg bg-white px-4 py-2 text-sm font-medium hover:bg-themeBlue/20 duration-500"
                  >
                    {cat.title}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const payload = await getPayload({ config: configPromise })
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)

  const categoryRes = await payload.find({
    collection: 'categories',
    depth: 0,
    limit: 1,
    pagination: false,
    where: { slug: { equals: decodedSlug } },
    select: { title: true },
  })

  const title = categoryRes.docs?.[0]?.title ?? 'Category'

  return {
    title: `${title} Posts`,
  }
}
