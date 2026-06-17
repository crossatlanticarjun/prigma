import React from 'react'
import Link from 'next/link'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { FaArrowRightLong } from 'react-icons/fa6'

type Media =
  | {
      url?: string | null
      alt?: string | null
      width?: number | null
      height?: number | null
    }
  | string
  | null

type CourseCategory = {
  id: string
  title: string
  slug: string
  description?: string | null
  sortOrder?: number | null
  _status?: 'draft' | 'published'
}

type Course = {
  id: string
  title: string
  slug: string
  shortDescription?: string | null
  sortOrder?: number | null
  _status?: 'draft' | 'published'
  category: string | { id: string; title?: string | null; slug?: string | null } | null
  thumbnail?: Media
}

type BlockProps = {
  block: {
    blockType: 'coursesExplorer'
    heading?: string | null
    basePath?: string | null
    maxCourses?: number | null
    showCategoryDescription?: boolean | null
    showCourseDescription?: boolean | null
    hideEmptyCategories?: boolean | null
  }
}

type CategoryLite = Pick<CourseCategory, 'id' | 'title' | 'slug' | 'description' | 'sortOrder'>
type CourseLite = Pick<
  Course,
  'id' | 'title' | 'slug' | 'shortDescription' | 'category' | 'thumbnail' | 'sortOrder'
>

const getCatId = (cat: CourseLite['category']): string | null => {
  if (!cat) return null
  if (typeof cat === 'string') return cat
  return cat.id ?? null
}

export async function CoursesExplorer({ block }: BlockProps) {
  if (!block) return null

  const payload = await getPayload({ config: configPromise })

  const basePath = (block.basePath || '/prigma-courses').replace(/\/+$/, '')
  const maxCourses = Math.min(Math.max(block.maxCourses ?? 200, 1), 2000)

  const [catsRes, coursesRes] = await Promise.all([
    payload.find({
      collection: 'course-category',
      depth: 0,
      pagination: false,
      // ✅ sidebar + main sections follow this order
      sort: ['sortOrder', 'title'],
      select: { id: true, title: true, slug: true, description: true, sortOrder: true },
      where: { _status: { equals: 'published' } },
    }),
    payload.find({
      collection: 'course',
      depth: 1,
      pagination: false,
      limit: maxCourses,
      sort: ['sortOrder', 'title'],
      select: {
        id: true,
        title: true,
        slug: true,
        shortDescription: true,
        category: true,
        thumbnail: true,
        sortOrder: true,
      },
      where: { _status: { equals: 'published' } },
    }),
  ])

  const categories = (catsRes.docs || []) as CategoryLite[]
  const courses = (coursesRes.docs || []) as CourseLite[]

  const coursesByCategory = new Map<string, CourseLite[]>()
  for (const course of courses) {
    const catId = getCatId(course.category)
    if (!catId) continue
    const arr = coursesByCategory.get(catId) ?? []
    arr.push(course)
    coursesByCategory.set(catId, arr)
  }

  const visibleCategories =
    (block.hideEmptyCategories ?? true)
      ? categories.filter((c) => (coursesByCategory.get(String(c.id))?.length ?? 0) > 0)
      : categories

  return (
    <section className="w-full py-16">
      <div className="mx-auto container">
        {block.heading ? (
          <div className="mb-8 text-center">
            <h2 className="text-2xl md:text-3xl font-semibold text-slate-950">{block.heading}</h2>
            <p className="text-sm text-black/60 mt-1">
              Browse by category. Click a course to open details.
            </p>
          </div>
        ) : null}

        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* Sidebar */}
          <aside className="lg:sticky lg:top-24 h-fit rounded-lg border border-themeBlue/10 bg-themeBlue/5 p-4">
            <div className="text-lg font-semibold">Course Categories</div>

            <ul className="mt-4 space-y-3">
              {visibleCategories.map((cat) => (
                <li key={String(cat.id)}>
                  <a
                    href={`#cat-${cat.slug}`}
                    className="flex items-center justify-between gap-3 rounded-lg bg-white p-3 hover:bg-themeBlue/20 duration-500"
                  >
                    <span className="truncate">{cat.title}</span>
                    <span className="text-xs text-black/40">
                      {coursesByCategory.get(String(cat.id))?.length ?? 0}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </aside>

          {/* Main: OLD COURSE LIST STYLE (cards grid per category) */}
          <div className="space-y-12">
            {visibleCategories.map((cat) => {
              const catCourses = coursesByCategory.get(String(cat.id)) ?? []
              if ((block.hideEmptyCategories ?? true) && catCourses.length === 0) return null

              return (
                <section key={String(cat.id)} id={`cat-${cat.slug}`} className="scroll-mt-28">
                  <div className="mb-5">
                    <div className="flex items-end justify-between gap-4">
                      <h3 className="text-xl md:text-2xl font-semibold text-slate-950">
                        {cat.title}
                      </h3>
                      <div className="text-xs text-black/40">{catCourses.length} courses</div>
                    </div>

                    {block.showCategoryDescription && cat.description ? (
                      <p className="mt-2 text-sm text-black/60 max-w-3xl">{cat.description}</p>
                    ) : null}
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {catCourses.map((course) => {
                      return (
                        <Link
                          key={String(course.id)}
                          href={`${basePath}/${course.slug}`}
                          className="group rounded-lg border border-black/10 bg-white overflow-hidden hover:shadow-md transition duration-500"
                        >
                          <div className="p-5">
                            <div className="text-base font-semibold text-slate-950 group-hover:text-themeBlue transition line-clamp-2">
                              {course.title}
                            </div>

                            {block.showCourseDescription && course.shortDescription ? (
                              <p className="mt-2 text-sm text-black/60 line-clamp-3">
                                {course.shortDescription}
                              </p>
                            ) : null}

                            <div className="mt-4 text-sm text-themeOrange flex gap-2 items-center">
                              View course details <FaArrowRightLong />
                            </div>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                </section>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
