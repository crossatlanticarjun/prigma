import React from 'react'
import Link from 'next/link'
import type { Page } from '@/payload-types'

type Props = {
  title?: string | null
  page?: Page
}

function toTitleCaseFromSlug(seg: string) {
  return decodeURIComponent(seg)
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (m) => m.toUpperCase())
}

export const PageHeaderBlock: React.FC<Props> = ({ page, title }) => {
  const resolvedTitle =
    (title && title.trim()) ||
    (typeof page?.title === 'string' && page.title.trim()) ||
    (typeof page?.slug === 'string' && page.slug.trim() ? toTitleCaseFromSlug(page.slug) : null) ||
    'Page'

  return (
    <section className="relative overflow-hidden bg-themeBlue">
      <div className="mx-auto container">
        <div className="py-10 sm:py-12">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl">
              {resolvedTitle}
            </h1>

            <div className="flex items-center gap-3 text-sm font-medium tracking-wide">
              <Link href="/" className="text-white transition hover:text-white/80 duration-300">
                HOME
              </Link>
              <span className="text-white/60">/</span>
              <span className="text-white/80">{resolvedTitle.toUpperCase()}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
