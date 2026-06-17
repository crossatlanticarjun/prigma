import { formatDateTime } from 'src/utilities/formatDateTime'
import React, { Fragment } from 'react'

import type { Post } from '@/payload-types'
import { formatAuthors } from '@/utilities/formatAuthors'

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

export const PostHero: React.FC<{
  post: Post
}> = ({ post }) => {
  const { populatedAuthors, publishedAt, title, categories } = post

  const hasAuthors =
    populatedAuthors && populatedAuthors.length > 0 && formatAuthors(populatedAuthors) !== ''

  const categoryTitles = Array.isArray(categories)
    ? categories
        .map(getCategoryTitle)
        .filter((t): t is string => typeof t === 'string' && t.length > 0)
    : []

  const hasCategories = categoryTitles.length > 0

  return (
    <div className="relative">
      <div className="text-slate-950 pb-8">
        <div>
          <h1 className="mb-6 text-3xl md:text-5xl lg:text-6xl">{title}</h1>

          <div className="flex flex-col md:flex-row gap-4 md:gap-16">
            {hasAuthors && (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <p className="text-sm">Author</p>
                  <p>{formatAuthors(populatedAuthors)}</p>
                </div>
              </div>
            )}

            {hasCategories && (
              <div className="flex flex-col gap-1">
                <p className="text-sm">{categoryTitles.length > 1 ? 'Categories' : 'Category'}</p>
                <p>
                  {categoryTitles.map((t, i) => {
                    const isLast = i === categoryTitles.length - 1
                    return (
                      <Fragment key={`${t}-${i}`}>
                        {t}
                        {!isLast && <Fragment>,&nbsp;</Fragment>}
                      </Fragment>
                    )
                  })}
                </p>
              </div>
            )}

            {publishedAt && (
              <div className="flex flex-col gap-1">
                <p className="text-sm">Date Published</p>
                <time dateTime={publishedAt}>{formatDateTime(publishedAt)}</time>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
