'use client'

import React from 'react'
import Image from 'next/image'
import { ShieldCheck, Eye, HeartHandshake, Award, Focus, type LucideIcon } from 'lucide-react'
import { HiMiniArrowTopRightOnSquare } from 'react-icons/hi2'
import { useEnquiryPopup } from '@/components/EnquiryPopup/EnquiryPopupProvider'

type Media = {
  url?: string | null
  alt?: string | null
  sizes?: {
    thumbnail?: { url?: string | null }
    small?: { url?: string | null }
    medium?: { url?: string | null }
    large?: { url?: string | null }
  } | null
}

type ValueCardIcon = 'integrity' | 'transparency' | 'parentTrust' | 'excellence' | 'discipline'

type ValueCard = {
  id?: string | null
  icon: ValueCardIcon
  title: string
  subtitle?: string | null
}

export type HeroBannerBlockProps = {
  badgeText?: string | null
  heading: string
  description?: string | null
  cta?: {
    label: string
    href: string
    newTab?: boolean | null
  } | null
  backgroundImage?: Media | string | null
  foregroundImage?: Media | string | null
  valueCards?: ValueCard[] | null
  overlay?: {
    enabled?: boolean | null
    opacity?: number | null // 0–100
  } | null
}

const iconMap: Record<ValueCardIcon, LucideIcon> = {
  integrity: ShieldCheck,
  transparency: Eye,
  parentTrust: HeartHandshake,
  excellence: Award,
  discipline: Focus,
}

function pickMediaUrl(m?: Media | string | null): string | null {
  if (!m) return null
  if (typeof m === 'string') return m
  return (
    m.sizes?.large?.url ??
    m.sizes?.medium?.url ??
    m.sizes?.small?.url ??
    m.sizes?.thumbnail?.url ??
    m.url ??
    null
  )
}

function pickMediaAlt(m: Media | string | null | undefined, fallback: string): string {
  if (!m) return fallback
  if (typeof m === 'string') return fallback
  return (m.alt ?? fallback) || fallback
}

const defaultCards: ValueCard[] = [
  { id: 'integrity', icon: 'integrity', title: 'Integrity', subtitle: 'Our core value' },
  { id: 'transparency', icon: 'transparency', title: 'Transparency', subtitle: 'In our actions' },
  { id: 'parentTrust', icon: 'parentTrust', title: 'Parent Trust', subtitle: 'Paramount for us' },
]

export function HeroBanner(props: HeroBannerBlockProps) {
  const bgUrl = pickMediaUrl(props.backgroundImage)
  const fgUrl = pickMediaUrl(props.foregroundImage)

  const overlayEnabled = props.overlay?.enabled ?? true
  const overlayOpacity = Math.min(100, Math.max(0, props.overlay?.opacity ?? 55)) / 100

  const cards: ValueCard[] = (props.valueCards?.length ? props.valueCards : defaultCards).slice(
    0,
    3,
  )
  const { open } = useEnquiryPopup()
  return (
    <section className="relative isolate w-full overflow-hidden">
      <div className="relative w-full">
        {/* Background layer */}
        <div className="absolute inset-0 z-0">
          {bgUrl ? (
            <Image
              src={bgUrl}
              alt={pickMediaAlt(props.backgroundImage, 'Hero background')}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          ) : (
            <div className="h-full w-full bg-slate-900" />
          )}

          {overlayEnabled ? (
            <>
              <div
                className="absolute inset-0 bg-black"
                style={{ opacity: overlayOpacity }}
                aria-hidden="true"
              />
              <div
                className="absolute inset-0"
                aria-hidden="true"
                style={{
                  background:
                    'linear-gradient(90deg, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.55) 42%, rgba(0,0,0,0.12) 78%, rgba(0,0,0,0.00) 100%)',
                }}
              />
            </>
          ) : null}
        </div>

        {/* Desktop students (full-bleed right). Hidden on mobile */}
        <div className="absolute inset-y-0 right-0 z-10 hidden md:w-[50%] xl:w-[40%] translate-x-[6%] pointer-events-none lg:block">
          {fgUrl ? (
            <Image
              src={fgUrl}
              alt={pickMediaAlt(props.foregroundImage, 'Students')}
              fill
              priority
              className="object-cover object-right-bottom"
              sizes="42vw"
            />
          ) : null}
        </div>

        {/* Desktop center cards (pinned to middle). Hidden on mobile */}
        <div className="absolute left-1/2 top-1/2 z-30 hidden w-[320px] -translate-x-[10%] -translate-y-1/2 lg:block">
          <div className="flex flex-col gap-7">
            {cards.map((card, idx) => {
              const Icon = iconMap[card.icon] ?? ShieldCheck
              return (
                <div
                  key={card.id ?? `${card.icon}-${idx}`}
                  className="flex items-center gap-3 rounded-xl bg-white/95 p-3 shadow-[0_18px_40px_rgba(0,0,0,0.20)]"
                >
                  <div className="grid h-14 w-14 place-items-center rounded-xl bg-themeOrange text-white">
                    <Icon size={22} />
                  </div>

                  <div className="min-w-0">
                    <div className="text-lg font-semibold text-slate-900">{card.title}</div>
                    {card.subtitle ? (
                      <div className="text-sm text-slate-500">{card.subtitle}</div>
                    ) : null}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Content */}
        <div className="relative z-20 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid min-h-[630px] grid-cols-1 items-start gap-10 pt-12 lg:grid-cols-12 lg:items-center">
            {/* Left text */}
            <div className="lg:col-span-6">
              {props.badgeText ? (
                <div className="inline-flex items-center rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm text-white backdrop-blur">
                  <span className="mr-2 inline-block h-2 w-2 rounded-full bg-themeOrange" />
                  {props.badgeText}
                </div>
              ) : null}

              <h1 className="text-balance  mt-6 max-w-2xl text-[30px] font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[54px]">
                “{props.heading}”
              </h1>

              {props.description ? (
                <p className="mt-6 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
                  {props.description}
                </p>
              ) : null}

              {/* {props.cta?.href && props.cta?.label ? (
                <div className="mt-10">
                  <Link
                    href={props.cta.href}
                    target={props.cta.newTab ? '_blank' : undefined}
                    rel={props.cta.newTab ? 'noreferrer noopener' : undefined}
                    onClick={() => open()}
                    className="flex justify-between md:inline-flex items-center gap-4 rounded-full bg-themeOrange pl-10 pr-2 py-2 text-lg font-semibold text-white shadow-[0_18px_40px_rgba(0,0,0,0.35)] transition hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-white/60"
                  >
                    {props.cta.label}
                    <span className="grid h-12 w-12 place-items-center rounded-full bg-white text-xl">
                      <HiMiniArrowTopRightOnSquare className="text-themeOrange" />
                    </span>
                  </Link>
                </div>
              ) : null} */}

              <button
                onClick={() => open()}
                className="mt-10 hidden md:flex justify-between md:inline-flex items-center gap-4 rounded-full bg-themeOrange pl-10 pr-2 py-2 text-lg font-semibold text-white shadow-[0_18px_40px_rgba(0,0,0,0.35)] transition hover:bg-themeBlue focus:outline-none outline-none duration-500 group"
              >
                Enquire Now
                <span className="grid h-12 w-12 place-items-center rounded-full bg-white text-xl">
                  <HiMiniArrowTopRightOnSquare className="text-themeOrange group-hover:text-themeBlue" />
                </span>
              </button>
            </div>

            {/* Mobile cards */}
            <div className="lg:hidden">
              <div className="flex flex-col gap-4">
                {cards.map((card, idx) => {
                  const Icon = iconMap[card.icon] ?? ShieldCheck
                  return (
                    <div
                      key={card.id ?? `${card.icon}-${idx}`}
                      className="flex items-center gap-3 rounded-xl bg-white/95 p-3 shadow-[0_18px_40px_rgba(0,0,0,0.20)]"
                    >
                      <div className="grid h-14 w-14 place-items-center rounded-xl bg-themeOrange text-white">
                        <Icon size={22} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-lg font-semibold text-slate-900">{card.title}</div>
                        {card.subtitle ? (
                          <div className="text-sm text-slate-500">{card.subtitle}</div>
                        ) : null}
                      </div>
                    </div>
                  )
                })}
              </div>
              <button
                onClick={() => open()}
                className="mt-10 flex md:hidden mx-auto justify-between md:inline-flex items-center gap-4 rounded-full bg-themeOrange pl-10 pr-2 py-2 text-lg font-semibold text-white shadow-[0_18px_40px_rgba(0,0,0,0.35)] transition hover:bg-themeBlue focus:outline-none outline-none duration-500 group"
              >
                Enquire Now
                <span className="grid h-12 w-12 place-items-center rounded-full bg-white text-xl">
                  <HiMiniArrowTopRightOnSquare className="text-themeOrange group-hover:text-themeBlue" />
                </span>
              </button>
            </div>

            {/* Mobile students: contained, centered, safe height */}
            <div className="relative lg:hidden">
              <div className="relative mx-auto h-[400px] w-full max-w-[400px] sm:h-[260px]">
                {fgUrl ? (
                  <Image
                    src={fgUrl}
                    alt={pickMediaAlt(props.foregroundImage, 'Students')}
                    fill
                    priority
                    className="object-contain object-center"
                    sizes="(max-width: 440px) 90vw, 360px"
                  />
                ) : null}
              </div>
            </div>

            {/* Spacer on desktop */}
            <div className="hidden lg:block lg:col-span-6" />
          </div>
        </div>
      </div>
    </section>
  )
}
