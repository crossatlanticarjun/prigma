import React from 'react'
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
}

type Props = {
  heading: string
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

export const StudentsShowcaseBlock: React.FC<Props> = ({ heading, students }) => {
  return (
    <section className="w-full py-12 md:py-16">
      <div className="mx-auto container">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-2xl md:text-4xl font-semibold tracking-tight text-themeHeading">
            {heading}
          </h2>
        </div>

        <div className="mt-8 md:mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {students?.map((s, idx) => {
            const url = getMediaUrl(s.image)
            const alt = getMediaAlt(s.image, s.name || `Student ${idx + 1}`)

            return (
              <div
                key={s.id ?? `${s.name}-${idx}`}
                className="rounded-2xl bg-white shadow-sm border border-black/5 overflow-hidden"
              >
                <div className="relative aspect-square bg-black/5">
                  {url ? (
                    <Image
                      src={url}
                      alt={alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-sm text-black/50">
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
      </div>
    </section>
  )
}
