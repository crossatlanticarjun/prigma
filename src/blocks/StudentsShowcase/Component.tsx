'use client'

import React, { useMemo, useState } from 'react'
import Image from 'next/image'

type Media = {
  url?: string | null
  alt?: string | null
  width?: number | null
  height?: number | null
  sizes?: {
    thumbnail?: { url?: string | null; width?: number | null; height?: number | null }
    small?: { url?: string | null; width?: number | null; height?: number | null }
    medium?: { url?: string | null; width?: number | null; height?: number | null }
    large?: { url?: string | null; width?: number | null; height?: number | null }
  } | null
}

type Student = {
  id?: string | null
  image: string | Media
  name: string
  stream: string
  rank: string
  year: number
}

type Props = {
  heading: string
  subheading: string
  students: Student[]
}

function getMediaUrl(media: string | Media): string | null {
  if (!media) return null
  if (typeof media === 'string') return null
  return (
    media.sizes?.medium?.url ||
    media.sizes?.small?.url ||
    media.sizes?.thumbnail?.url ||
    media.url ||
    null
  )
}

function getMediaAlt(media: string | Media, fallback: string): string {
  if (!media || typeof media === 'string') return fallback
  return media.alt || fallback
}

export const StudentsShowcaseBlock: React.FC<Props> = ({ heading, subheading, students }) => {
  const years = useMemo(() => {
    const list = Array.from(
      new Set(
        (students || []).map((s) => s.year).filter((y): y is number => typeof y === 'number'),
      ),
    )
    list.sort((a, b) => b - a)
    return list
  }, [students])

  const [selectedYear, setSelectedYear] = useState<number | 'all'>(years[0] ?? 'all')

  const filteredStudents = useMemo(() => {
    if (selectedYear === 'all') return students
    return (students || []).filter((s) => s.year === selectedYear)
  }, [students, selectedYear])

  return (
    <section className="w-full py-12 md:py-16">
      <div className="mx-auto container">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-2xl md:text-4xl font-semibold tracking-tight text-themeHeading">
            {heading}
          </h2>
          <p className="mt-2 text-md leading-6 text-slate-600">{subheading}</p>

          {/* ✅ Button-style Year Filter */}
          {years.length > 0 ? (
            <div className="mt-5 flex flex-row justify-center items-center gap-3">
              <div className="text-sm font-medium text-slate-700">Filter by Year</div>

              <div className="flex flex-wrap justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedYear('all')}
                  className={[
                    'h-10 px-4 rounded-full text-sm font-semibold border transition',
                    selectedYear === 'all'
                      ? 'bg-themeBlue text-white border-themeBlue shadow-sm'
                      : 'bg-white text-slate-700 border-black/10 hover:border-themeBlue/40 hover:bg-themeBlue/5',
                  ].join(' ')}
                >
                  All
                </button>

                {years.map((y) => (
                  <button
                    key={y}
                    type="button"
                    onClick={() => setSelectedYear(y)}
                    className={[
                      'h-10 px-4 rounded-full text-sm font-semibold border transition',
                      selectedYear === y
                        ? 'bg-themeBlue text-white border-themeBlue shadow-sm'
                        : 'bg-white text-slate-700 border-black/10 hover:border-themeBlue/40 hover:bg-themeBlue/5',
                    ].join(' ')}
                  >
                    {y}
                  </button>
                ))}
              </div>

              <div className="text-sm text-slate-600">
                Showing <span className="font-semibold">{filteredStudents?.length ?? 0}</span>
              </div>
            </div>
          ) : null}
        </div>

        {/* Grid */}
        <div className="mt-8 md:mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredStudents?.map((s, idx) => {
            const url = getMediaUrl(s.image)
            const alt = getMediaAlt(s.image, s.name || `Student ${idx + 1}`)

            return (
              <div
                key={s.id ?? `${s.name}-${idx}`}
                className="rounded-2xl bg-white shadow-sm border border-black/5 overflow-hidden"
              >
                <div className="bg-black/5 relative">
                  {/* <div className="absolute left-3 top-3 z-10 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-800 shadow-sm">
                    {s.year}
                  </div> */}

                  {url ? (
                    <Image
                      src={url}
                      alt={alt}
                      width={468}
                      height={565}
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  ) : (
                    <div className="h-[260px] flex items-center justify-center text-sm text-black/60">
                      No image
                    </div>
                  )}
                </div>

                <div className="p-3 md:p-4 text-center">
                  <div className="text-sm md:text-base font-semibold bg-themeBlue text-white px-3 py-1 rounded-full line-clamp-2 uppercase mb-2">
                    {s.name}
                  </div>
                  <div className="text-sm md:text-base font-medium text-slate-750 line-clamp-2">
                    {s.stream}
                  </div>
                  <div className="text-sm md:text-base font-medium text-slate-750 line-clamp-2">
                    {s.rank}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {filteredStudents?.length === 0 ? (
          <div className="mt-10 text-center text-sm text-slate-600">
            No results found for the selected year.
          </div>
        ) : null}
      </div>
    </section>
  )
}
