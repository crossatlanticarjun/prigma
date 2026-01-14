import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { FaPhone } from 'react-icons/fa6'

type Media = {
  url?: string | null
  alt?: string | null
  width?: number | null
  height?: number | null
}

type Props = {
  leftImage: Media | string
  pillText?: string | null
  heading: string
  description: SerializedEditorState
  primaryCTA?: { label: string; href: string; newTab?: boolean | null } | null
  phoneCTA?: { label: string; phone: string } | null
}

function isMediaObject(v: unknown): v is Media {
  return typeof v === 'object' && v !== null && 'url' in v
}

function normalizePhoneToTel(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, '')
  return digits.startsWith('+') ? digits : `+${digits}`
}

export const PrigmaHeroBlock: React.FC<Props> = (props) => {
  const img = isMediaObject(props.leftImage) ? props.leftImage : null
  const imgSrc = img?.url ?? ''

  const cta = props.primaryCTA ?? { label: 'Learn More', href: '/about', newTab: false }
  const phone = props.phoneCTA ?? { label: 'Phone Number', phone: '+91 79050 74634' }

  const isExternal = /^https?:\/\//i.test(cta.href)
  const ctaTarget = cta.newTab ? '_blank' : undefined
  const ctaRel = cta.newTab ? 'noreferrer noopener' : undefined

  return (
    <section className="w-full">
      <div className="mx-auto container py-8 md:py-16">
        <div className="grid items-stretch gap-6 md:grid-cols-2 md:gap-10">
          <div className="relative overflow-hidden rounded-2xl bg-neutral-900 order-2 md:order-1">
            {imgSrc ? (
              <Image
                src={imgSrc}
                alt={img?.alt ?? 'Prigma Hero'}
                width={img?.width ?? 1400}
                height={img?.height ?? 900}
                className="h-full w-full object-cover"
                priority
              />
            ) : (
              <div className="flex h-[260px] w-full items-center justify-center text-sm text-neutral-400 md:h-full">
                No image selected
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center order-1 md:order-2">
            <div className="mb-4">
              <span className="mx-auto inline-flex rounded-full bg-themeBlue px-6 py-2 text-md text-white">
                {props.pillText ?? 'About PRiGma'}
              </span>
            </div>

            <h1 className="text-balance text-3xl font-bold leading-tight text-slate-950 md:text-5xl">
              {props.heading}
            </h1>

            <div className="mt-5 text-pretty text-sm leading-7 text-slate-600 md:text-base">
              <RichText data={props.description} />
            </div>

            <div className="md:hidden">
              {isExternal ? (
                <a
                  href={cta.href}
                  target={ctaTarget}
                  rel={ctaRel}
                  className="text-themeOrange font-semibold text-sm mt-2"
                >
                  {cta.label}
                </a>
              ) : (
                <Link
                  href={cta.href}
                  target={ctaTarget}
                  rel={ctaRel}
                  className="text-themeOrange font-semibold text-sm mt-2"
                >
                  {cta.label}
                </Link>
              )}
            </div>

            <div className="mt-8 hidden md:flex flex-col gap-4 sm:flex-row sm:items-center">
              {isExternal ? (
                <a
                  href={cta.href}
                  target={ctaTarget}
                  rel={ctaRel}
                  className="inline-flex items-center justify-between gap-4 rounded-full bg-themeOrange pl-10 pr-2 py-2 text-lg font-semibold text-white transition hover:bg-slate-950 duration-500 focus:outline-none"
                >
                  {cta.label}
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-white text-xl">
                    →
                  </span>
                </a>
              ) : (
                <Link
                  href={cta.href}
                  target={ctaTarget}
                  rel={ctaRel}
                  className="inline-flex items-center justify-between gap-4 rounded-full bg-themeOrange pl-10 pr-2 py-2 text-lg font-semibold text-white transition hover:bg-slate-950 duration-500 focus:outline-none"
                >
                  {cta.label}
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-white text-themeOrange text-xl">
                    →
                  </span>
                </Link>
              )}

              <div className="flex items-center gap-4">
                <a
                  href={`tel:${normalizePhoneToTel(phone.phone)}`}
                  className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-themeBlue text-white"
                  aria-label="Call"
                >
                  <FaPhone className="text-xl" />
                </a>

                <div>
                  <div className="text-md font-medium text-slate-950">{phone.label}</div>
                  <Link
                    href={`tel:${normalizePhoneToTel(phone.phone)}`}
                    className="text-xl font-semibold text-slate-950 hover:text-themeOrange transition duration-500"
                  >
                    {phone.phone}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
