import type { Metadata } from 'next'

import { RelatedPosts } from '@/blocks/RelatedPosts/Component'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import RichText from '@/components/RichText'

import type { Post } from '@/payload-types'

import { PostHero } from '@/heros/PostHero'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { PageHeaderBlock } from '@/blocks/PageHeader/Component'
import Link from 'next/link'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const posts = await payload.find({
    collection: 'posts',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  const params = posts.docs.map(({ slug }) => {
    return { slug }
  })

  return params
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

const queryLatestPosts = cache(async ({ excludeSlug }: { excludeSlug: string }) => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 5,
    overrideAccess: false,
    sort: '-publishedAt', // if you don't have publishedAt, use '-createdAt'
    select: {
      title: true,
      slug: true,
      meta: true,
    },
    where: {
      slug: { not_equals: excludeSlug },
    },
  })

  return result.docs
})

export default async function Post({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const url = '/posts/' + decodedSlug
  const post = await queryPostBySlug({ slug: decodedSlug })
  const latestPosts = await queryLatestPosts({ excludeSlug: decodedSlug })

  if (!post) return <PayloadRedirects url={url} />

  return (
    <article>
      <PageHeaderBlock title="News & Updates" />

      <div className="container py-10">
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          {/* Main content */}
          <div>
            <PageClient />

            {/* Allows redirects for valid pages too */}
            <PayloadRedirects disableNotFound url={url} />

            {draft && <LivePreviewListener />}

            <PostHero post={post} />

            <div className="flex flex-col items-center gap-4">
              <RichText
                className="max-w-[48rem] mx-auto text-slate-800"
                data={post.content}
                enableGutter={false}
              />
              {post.relatedPosts && post.relatedPosts.length > 0 && (
                <RelatedPosts
                  className="mt-12 max-w-[52rem] lg:grid lg:grid-cols-subgrid col-start-1 col-span-3 grid-rows-[2fr]"
                  docs={post.relatedPosts.filter((post) => typeof post === 'object')}
                />
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-24 h-fit rounded-lg border border-themeBlue/10 bg-themeBlue/5 p-5">
            <h3 className="text-lg font-semibold">Latest Posts</h3>

            <div className="mt-4 space-y-3">
              {latestPosts.map((p) => (
                <Link
                  key={p.id}
                  href={`/posts/${p.slug}`}
                  className="block rounded-lg bg-white p-3 hover:bg-themeBlue/20 duration-500"
                >
                  <div className="text-sm font-medium leading-snug line-clamp-2">{p.title}</div>
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const post = await queryPostBySlug({ slug: decodedSlug })

  return generateMeta({ doc: post })
}

const queryPostBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})
