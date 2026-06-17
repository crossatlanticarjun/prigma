'use client'

import React, { Fragment } from 'react'
import Link from 'next/link'

import { cn } from '@/utilities/ui'
import useClickableCard from '@/utilities/useClickableCard'
import { Media } from '@/components/Media'
import { lexicalToText } from '@/utilities/lexicalToText'

import type { Post } from '@/payload-types'

export type CardPostData = Pick<Post, 'slug' | 'categories' | 'meta' | 'title' | 'content'>

type CategoryLike = {
  title?: string | null
}

type PolymorphicRel = {
  value?: unknown
}

const isNonNullString = (v: unknown): v is string => typeof v === 'string' && v.length > 0

const getCategoryTitle = (cat: unknown): string | null => {
  // relationship id string
  if (typeof cat === 'string') return null

  if (!cat || typeof cat !== 'object') return null

  // Normal populated relationship: { title: string }
  if ('title' in cat) {
    const maybe = (cat as CategoryLike).title
    return isNonNullString(maybe) ? maybe : null
  }

  // Polymorphic relationship: { value: { title: string } }
  if ('value' in cat) {
    const value = (cat as PolymorphicRel).value
    if (!value || typeof value !== 'object') return null

    if ('title' in value) {
      const maybe = (value as CategoryLike).title
      return isNonNullString(maybe) ? maybe : null
    }
  }

  return null
}

export const Card: React.FC<{
  alignItems?: 'center'
  className?: string
  doc?: CardPostData
  relationTo?: 'posts'
  showCategories?: boolean
  title?: string
}> = (props) => {
  const { card, link } = useClickableCard({})
  const { className, doc, relationTo, title: titleFromProps, showCategories } = props

  const { slug, meta, title, content, categories } = doc || {}
  const { description, image: metaImage } = meta || {}

  const titleToUse = titleFromProps || title
  const relation = relationTo ?? 'posts'
  const href = `/${relation}/${slug}`

  const metaDesc = typeof meta?.description === 'string' ? meta.description : ''
  const contentDesc = lexicalToText(content)
  const desc = (metaDesc || contentDesc).slice(0, 200)

  const categoryTitles = Array.isArray(categories)
    ? categories
        .map(getCategoryTitle)
        .filter((t): t is string => typeof t === 'string' && t.length > 0)
    : []

  return (
    <article
      className={cn(
        'border border-themeBlue/10 rounded-lg overflow-hidden bg-themeBlue/5 hover:cursor-pointer',
        className,
      )}
      ref={card.ref}
    >
      <div className="relative w-full">
        {!metaImage && <div />}
        {metaImage && typeof metaImage !== 'string' && <Media resource={metaImage} size="33vw" />}
      </div>

      <div className="p-6">
        {showCategories && categoryTitles.length > 0 && (
          <div className="uppercase text-xs text-white rounded-full bg-themeBlue inline px-2 py-1">
            {categoryTitles.map((t, i) => {
              const isLast = i === categoryTitles.length - 1
              return (
                <Fragment key={`${t}-${i}`}>
                  {t}
                  {!isLast && <Fragment>,&nbsp;</Fragment>}
                </Fragment>
              )
            })}
          </div>
        )}

        {titleToUse && (
          <div className="prose mt-3">
            <h3>
              <Link className="not-prose" href={href} ref={link.ref}>
                {titleToUse}
              </Link>
            </h3>
          </div>
        )}

        {desc ? (
          <p className="mt-2 line-clamp-2 text-slate-800">
            {desc} <span className="text-themeOrange font-medium">Continue reading...</span>
          </p>
        ) : null}

        {typeof description === 'string' && description && (
          <div className="mt-2">
            <p>{description.replace(/\s/g, ' ')}</p>
          </div>
        )}
      </div>
    </article>
  )
}
