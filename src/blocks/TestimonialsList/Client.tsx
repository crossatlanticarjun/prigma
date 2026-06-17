'use client'

import React from 'react'
import Image from 'next/image'
import type { Testimonial } from '@/payload-types'
import RichText from '@/components/RichText'

type Media = {
  url?: string | null
  alt?: string | null
  width?: number | null
  height?: number | null
}

type Props = {
  heading: string
  items: Testimonial[]
}

const getMediaUrl = (photo: Testimonial['photo']): string | null => {
  if (!photo) return null
  if (typeof photo === 'string') return null
  const m = photo as unknown as Media
  return m?.url ?? null
}

export const TestimonialsListClient: React.FC<Props> = ({ heading, items }) => {
  if (!items?.length) return null

  return (
    <section className="w-full py-12 md:py-16">
      <div className="mx-auto container">
        <div className="text-center max-w-5xl mx-auto">
          <h2 className="mt-6 text-balance text-3xl font-bold text-slate-950 md:text-5xl">
            {heading}
          </h2>
        </div>

        <div className="mt-10 space-y-6">
          {items.map((t) => {
            const photoUrl = getMediaUrl(t.photo)
            const name = (t.name ?? 'Student').trim()
            const marksText = (t.marksObtained ?? '').trim()

            return (
              <article key={t.id} className="rounded-xl bg-themeBlue/5 p-6 md:p-8">
                <div className="grid gap-6 sm:gap-8 sm:grid-cols-[260px_1fr] items-start">
                  <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                    <div className="relative h-[200px] w-[200px] overflow-hidden rounded-full bg-white">
                      {photoUrl ? (
                        <Image
                          src={photoUrl}
                          alt={name}
                          fill
                          className="object-cover"
                          sizes="200px"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-black/50">
                          No Photo
                        </div>
                      )}
                    </div>

                    <div className="mt-4 min-w-0">
                      <div className="text-xl font-semibold text-slate-950 truncate">{name}</div>
                      {!!marksText && (
                        <div className="mt-1 text-sm font-medium text-slate-600">{marksText}</div>
                      )}
                    </div>
                  </div>

                  <div className="prose prose-base max-w-none text-slate-700 leading-7">
                    <RichText data={t.description} />
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
