import React from 'react'
import Link from 'next/link'
import Script from 'next/script'
import { notFound } from 'next/navigation'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

import type { Course } from '@/payload-types'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { PageHeaderBlock } from '@/blocks/PageHeader/Component'
import { getServerSideURL } from '@/utilities/getURL'
import { lexicalToPlainText, safeTrim } from '@/utilities/seo/plainText'
import { courseJsonLd } from '@/utilities/seo/courseJsonLd'

type Props = {
  params: Promise<{ slug: string }>
}

// ✅ SEO: Title + Description + OG/Twitter for this page
export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })

  const res = await payload.find({
    collection: 'course',
    limit: 1,
    depth: 0,
    where: {
      and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }],
    },
  })

  const course = (res.docs?.[0] ?? null) as Course | null
  if (!course) return {}

  const siteUrl = getServerSideURL()
  const urlPath = `/courses/${course.slug}` // adjust if your route is different
  const pageUrl = `${siteUrl}${urlPath}`

  const plain = lexicalToPlainText(course.description)
  const description =
    safeTrim(plain, 160) ||
    safeTrim(course.shortDescription || '', 160) ||
    safeTrim(`Learn more about ${course.title} at PRiGma IIT JEE.`, 160)

  const title = `${course.title} | PRiGma IIT JEE`

  return {
    title,
    description,
    alternates: { canonical: pageUrl },
    openGraph: {
      title,
      description,
      url: pageUrl,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params

  const payload = await getPayload({ config: configPromise })

  const res = await payload.find({
    collection: 'course',
    limit: 1,
    depth: 2,
    where: {
      and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }],
    },
  })

  const course = (res.docs?.[0] ?? null) as Course | null
  if (!course) return notFound()

  const siteUrl = getServerSideURL()
  const urlPath = `/courses/${course.slug}` // adjust if needed
  const descriptionText =
    safeTrim(lexicalToPlainText(course.description), 240) ||
    safeTrim(course.shortDescription || '', 240) ||
    ''

  const jsonLd = courseJsonLd({
    siteUrl,
    urlPath,
    title: course.title,
    description: descriptionText || undefined,
  })

  return (
    <main>
      {/* ✅ UI title should be the real course name */}
      <PageHeaderBlock title="Course Details" />

      {/* ✅ Page schema */}
      <Script
        id="schema-course"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto py-16 container">
        <div className="mb-6">
          <Link href="/courses" className="text-sm text-semibold text-themeBlue hover:underline">
            ← Back to Courses
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <article className="rounded-lg border border-black/10 bg-white p-6">
            <h1 className="text-2xl md:text-3xl font-semibold text-black/85">{course.title}</h1>

            {course.description ? (
              <div className="prose max-w-none prose-headings:text-black/85 prose-p:text-black/70">
                <RichText data={course.description as unknown as SerializedEditorState} />
              </div>
            ) : null}
          </article>

          <aside className="lg:sticky lg:top-24 h-fit rounded-lg border border-themeBlue/10 bg-themeBlue/5 p-4">
            <div className="text-lg font-semibold">Course Info</div>

            <div className="mt-4 space-y-3">
              {course.level ? (
                <div className="flex items-start justify-between gap-4">
                  <span className="text-black/70">Level</span>
                  <span className="text-right capitalize">{course.level}</span>
                </div>
              ) : null}

              {course.mode ? (
                <div className="flex items-start justify-between gap-4">
                  <span className="text-black/70">Mode</span>
                  <span className="text-right capitalize">{course.mode}</span>
                </div>
              ) : null}

              {course.durationText ? (
                <div className="flex items-start justify-between gap-4">
                  <span className="text-black/70">Duration</span>
                  <span className="text-right capitalize">{course.durationText}</span>
                </div>
              ) : null}

              {typeof course.priceINR === 'number' ? (
                <div className="flex items-start justify-between gap-4">
                  <span className="text-black/70">Price</span>
                  <span className="text-right capitalize">₹{course.priceINR}</span>
                </div>
              ) : null}
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
