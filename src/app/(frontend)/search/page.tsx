import type { Metadata } from 'next/types'
import React from 'react'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { CollectionArchive } from '@/components/CollectionArchive'
import { Search } from '@/search/Component'
import PageClient from './page.client'
import type { Post } from '@/payload-types'

type Args = {
  searchParams: Promise<{ q: string }>
}

type RelationDoc = {
  relationTo: string
  value: unknown
}

function isRelationDoc(value: unknown): value is RelationDoc {
  return typeof value === 'object' && value !== null && 'relationTo' in value && 'value' in value
}

function isPostDoc(value: unknown): value is Post {
  return typeof value === 'object' && value !== null && 'slug' in value && 'title' in value
}

export default async function Page({ searchParams: searchParamsPromise }: Args) {
  const { q: query } = await searchParamsPromise
  const payload = await getPayload({ config: configPromise })

  const results = await payload.find({
    collection: 'search',
    depth: 2, // IMPORTANT: resolves `doc.value` into the actual referenced doc
    limit: 12,
    pagination: true,
    ...(query
      ? {
          where: {
            or: [
              { title: { like: query } },
              { 'meta.description': { like: query } },
              { 'meta.title': { like: query } },
              { slug: { like: query } },
            ],
          },
        }
      : {}),
  })

  // Convert search results into Posts only
  const postDocs: Post[] = results.docs
    .map((r: unknown) => {
      const docField = (r as { doc?: unknown }).doc
      if (!isRelationDoc(docField)) return null
      if (docField.relationTo !== 'posts') return null
      return isPostDoc(docField.value) ? docField.value : null
    })
    .filter((v): v is Post => Boolean(v))

  return (
    <div className="pt-24 pb-24">
      <PageClient />

      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none text-center">
          <h1 className="mb-8 lg:mb-16">Search</h1>

          <div className="max-w-[50rem] mx-auto">
            <Search />
          </div>
        </div>
      </div>

      {postDocs.length > 0 ? (
        <CollectionArchive posts={postDocs} />
      ) : (
        <div className="container">No results found.</div>
      )}
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `PRiGma Classes (IIT JEE MAINS & ADVANCED) Search`,
  }
}
