'use client'

import React, { useRef } from 'react'
import Image from 'next/image'
import type { Testimonial } from '@/payload-types'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, A11y } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper/types'

import 'swiper/css'
import 'swiper/css/navigation'

import RichText from '@/components/RichText'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type Media = {
  url?: string | null
  alt?: string | null
  width?: number | null
  height?: number | null
}

type Props = {
  badge: string
  heading: string
  viewMore?: {
    label?: string | null
    href?: string | null
    newTab?: boolean | null
  }
  items: Testimonial[]
}

const getMediaUrl = (photo: Testimonial['photo']): string | null => {
  if (!photo) return null
  if (typeof photo === 'string') return null
  const m = photo as unknown as Media
  return m?.url ?? null
}

export const TestimonialsCarouselClient: React.FC<Props> = ({
  badge,
  heading,
  viewMore,
  items,
}) => {
  const swiperRef = useRef<SwiperType | null>(null)

  if (!items?.length) return null

  return (
    <section className="w-full py-12 md:py-16">
      <div className="mx-auto container">
        <div className="text-center max-w-5xl mx-auto">
          <div className="mx-auto inline-flex rounded-full bg-themeBlue px-6 py-2 text-md text-white">
            {badge}
          </div>

          <h2 className="mt-6 text-balance text-3xl font-bold text-slate-950 md:text-5xl">
            {heading}
          </h2>
        </div>

        {/* Slider area */}
        <div className="relative mt-10">
          {/* Left nav */}
          <button
            type="button"
            aria-label="Previous testimonial"
            onClick={() => swiperRef.current?.slidePrev()}
            className="hidden md:flex absolute left-[-56px] top-1/2 -translate-y-1/2 z-10 h-12 w-12 items-center justify-center rounded-full border-2 border border-themeOrange text-themeOrange bg-white shadow-sm hover:bg-themeOrange hover:text-white transition duration-500"
          >
            <span>
              <ChevronLeft width={30} height={30} />
            </span>
          </button>

          {/* Right nav */}
          <button
            type="button"
            aria-label="Next testimonial"
            onClick={() => swiperRef.current?.slideNext()}
            className="hidden md:flex absolute right-[-56px] top-1/2 -translate-y-1/2 z-10 h-12 w-12 items-center justify-center rounded-full border-2 border border-themeOrange text-themeOrange bg-white shadow-sm hover:bg-themeOrange hover:text-white transition duration-500"
          >
            <span>
              <ChevronRight width={30} height={30} />
            </span>
          </button>

          <Swiper
            modules={[Navigation, A11y]}
            onSwiper={(s) => (swiperRef.current = s)}
            spaceBetween={18}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 2 },
            }}
            className="!pb-10"
          >
            {items.map((t) => {
              const photoUrl = getMediaUrl(t.photo)
              const name = t.name ?? 'Student'
              const marksText = (t.marksObtained ?? '').trim()

              return (
                <SwiperSlide key={t.id}>
                  <article className="h-full rounded-xl bg-themeBlue/5 p-6">
                    <div className="flex items-center gap-4">
                      <div className="relative h-20 w-20 md:h-24 md:w-24 shrink-0 overflow-hidden rounded-full">
                        {photoUrl ? (
                          <Image
                            src={photoUrl}
                            alt={name}
                            fill
                            className="object-cover"
                            sizes="96px"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs text-black/50">
                            No Photo
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="text-lg font-semibold text-slate-950 truncate">{name}</div>

                        {!!marksText && (
                          <div className="mt-1 text-sm font-medium text-slate-600">{marksText}</div>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 prose prose-sm max-w-full text-slate-600 leading-6 line-clamp-6">
                      <RichText data={t.description} />
                    </div>
                  </article>
                </SwiperSlide>
              )
            })}
          </Swiper>

          {/* Mobile nav (below) */}
          <div className="flex md:hidden items-center justify-center gap-3">
            <button
              type="button"
              aria-label="Previous testimonial"
              onClick={() => swiperRef.current?.slidePrev()}
              className="h-11 w-11 flex items-center justify-center rounded-full border-2 border border-themeOrange text-themeOrange bg-white shadow-sm hover:bg-themeOrange hover:text-white transition duration-500"
            >
              <span>
                <ChevronLeft width={30} height={30} />
              </span>
            </button>
            <button
              type="button"
              aria-label="Next testimonial"
              onClick={() => swiperRef.current?.slideNext()}
              className="h-11 w-11 flex items-center justify-center rounded-full border-2 border border-themeOrange text-themeOrange bg-white shadow-sm hover:bg-themeOrange hover:text-white transition duration-500"
            >
              <span>
                <ChevronRight width={30} height={30} />
              </span>
            </button>
          </div>
        </div>

        {viewMore?.href ? (
          <div className="mt-4 flex justify-center">
            <a
              href={viewMore.href}
              target={viewMore.newTab ? '_blank' : undefined}
              rel={viewMore.newTab ? 'noreferrer noopener' : undefined}
              className="inline-flex items-center justify-between gap-4 rounded-full bg-themeOrange pl-10 pr-2 py-2 text-lg font-semibold text-white transition hover:bg-slate-950 duration-500 focus:outline-none"
            >
              {viewMore.label ?? 'View More'}
              <span className="grid h-12 w-12 place-items-center rounded-full bg-white text-themeOrange text-xl">
                →
              </span>
            </a>
          </div>
        ) : null}
      </div>
    </section>
  )
}
