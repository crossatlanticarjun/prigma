import type { Metadata } from 'next'
import React from 'react'
import { draftMode } from 'next/headers'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { HomePopupClient } from '@/components/HomePopup/HomePopupClient'

import configPromise from '@payload-config'
import { getPayload, type RequiredDataFromCollectionSlug } from 'payload'
import type { HomePopup as HomePopupType } from '@/payload-types'

import { homeStatic } from '@/endpoints/seed/home-static'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'

type Args = {
  params: Promise<{
    slug?: string
  }>
}

const normalizeSlug = (raw: string): string => {
  try {
    return decodeURIComponent(raw)
  } catch {
    return raw
  }
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })

  const pages = await payload.find({
    collection: 'pages',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: { slug: true },
  })

  return (
    pages.docs?.filter((doc) => doc.slug && doc.slug !== 'home').map(({ slug }) => ({ slug })) ?? []
  )
}

const queryHomePopup = async (): Promise<HomePopupType> => {
  const payload = await getPayload({ config: configPromise })
  return payload.findGlobal({
    slug: 'homePopup',
    overrideAccess: false,
    depth: 3, // populate media
  }) as Promise<HomePopupType>
}

const queryPageBySlug = async ({ slug }: { slug: string }) => {
  const { isEnabled: isDraft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
    draft: isDraft,
    limit: 1,
    pagination: false,
    overrideAccess: isDraft,
    where: {
      slug: { equals: slug },
    },
  })

  return result.docs?.[0] || null
}

export default async function Page({ params: paramsPromise }: Args) {
  const { isEnabled: isDraft } = await draftMode()

  const { slug: rawSlug } = await paramsPromise
  const slug = normalizeSlug(rawSlug ?? 'home')
  const url = '/' + slug

  let page: RequiredDataFromCollectionSlug<'pages'> | null = await queryPageBySlug({ slug })

  if (!page && slug === 'home') page = homeStatic
  if (!page) return <PayloadRedirects url={url} />

  const { hero, layout } = page

  const isHome = slug === 'home'

  const homePopup = isHome ? await queryHomePopup() : null

  return (
    <article>
      {isHome && homePopup?.enabled ? <HomePopupClient data={homePopup} /> : null}

      <PageClient />
      <PayloadRedirects disableNotFound url={url} />
      {isDraft && <LivePreviewListener />}
      <RenderHero {...hero} />
      <RenderBlocks blocks={layout} />
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug: rawSlug } = await paramsPromise
  const slug = normalizeSlug(rawSlug ?? 'home')

  const page = await queryPageBySlug({ slug })
  return generateMeta({ doc: page })
}
