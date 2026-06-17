import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'

import type { Footer as FooterType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import type { IconType } from 'react-icons'
import {
  FaXTwitter,
  FaLinkedinIn,
  FaInstagram,
  FaFacebookF,
  FaYoutube,
  FaWhatsapp,
} from 'react-icons/fa6'
import { MapPin } from 'lucide-react'

const ICONS = {
  facebook: FaFacebookF,
  instagram: FaInstagram,
  youtube: FaYoutube,
  linkedin: FaLinkedinIn,
  x: FaXTwitter,
  whatsapp: FaWhatsapp,
} satisfies Record<string, IconType>

type SocialKey = keyof typeof ICONS
const isSocialKey = (v: string): v is SocialKey => v in ICONS

type ElementOf<T> = T extends readonly (infer U)[] ? U : never

type Centres = NonNullable<FooterType['centres']>
type CentreItem = ElementOf<Centres>

type NavItems = NonNullable<FooterType['navItems']>
type NavItem = ElementOf<NavItems>

type Socials = NonNullable<FooterType['socials']>
type SocialItem = ElementOf<Socials>

// If you added legalItems but did not regenerate payload types yet, this keeps builds green.
type FooterWithLegal = FooterType & { legalItems?: NavItems }

// If you kept a legacy single email field, this safely reads it without any/ts-ignore.
type FooterWithLegacyEmail = FooterType & { contact?: FooterType['contact'] & { email?: unknown } }

type CentreWithMap = CentreItem & { googlemaplink?: unknown }

function getGoogleMapLink(c: CentreItem): string | null {
  const url = (c as CentreWithMap).googlemaplink
  if (typeof url !== 'string') return null
  const trimmed = url.trim()
  return trimmed ? trimmed : null
}

function getLegalItems(footerData: FooterType): NavItems {
  const maybe = footerData as unknown as FooterWithLegal
  return maybe.legalItems ?? []
}

function getLegacyEmail(footerData: FooterType): string | undefined {
  const maybe = footerData as unknown as FooterWithLegacyEmail
  const v = maybe.contact?.email
  return typeof v === 'string' && v.trim() ? v.trim() : undefined
}

function normalizePhones(footerData: FooterType): string[] {
  const list = footerData.contact?.phones?.map((p) => p.phone).filter(Boolean) ?? []
  const cleaned = list.map((p) => String(p).trim()).filter(Boolean)
  return Array.from(new Set(cleaned))
}

function normalizeEmails(footerData: FooterType): string[] {
  const list = footerData.contact?.emails?.map((e) => e.email).filter(Boolean) ?? []
  const cleaned = list.map((e) => String(e).trim()).filter(Boolean)

  const legacy = getLegacyEmail(footerData)
  if (legacy) cleaned.push(legacy)

  return Array.from(new Set(cleaned)).filter(Boolean)
}

export async function Footer() {
  const footerData = (await getCachedGlobal('footer', 1)()) as FooterType

  const centres: Centres = footerData.centres ?? []
  const navItems: NavItems = footerData.navItems ?? []
  const legalItems: NavItems = getLegalItems(footerData)
  const socials: Socials = footerData.socials ?? []

  const phones = normalizePhones(footerData)
  const emails = normalizeEmails(footerData)

  const copyright =
    footerData.copyrightText ||
    '© Copyright 2026 PRiGma Classes (IIT JEE MAINS & ADVANCED) All Rights Reserved.'

  return (
    <footer className="mt-auto bg-slate-950 text-white rounded-t-[60px] overflow-hidden">
      <div className="container pt-10">
        {/* Top: Centre cards */}
        {centres.length > 0 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {centres.map((c: CentreItem, idx: number) => (
              <div
                key={`${c?.title ?? 'centre'}-${idx}`}
                className="flex items-start gap-4 rounded-2xl bg-[#081a24] p-5 shadow-sm ring-1 ring-white/5"
              >
                <div className="flex h-14 w-14 flex-none items-center justify-center rounded-full bg-[#ff4d1a]">
                  <MapPin className="h-6 w-6 text-white" />
                </div>

                <div className="min-w-0">
                  <h3 className="text-lg font-semibold">{c?.title}</h3>

                  {c?.address ? <p className="mt-1 text-sm text-white/75">{c.address}</p> : null}

                  <div className="mt-3 space-y-1 text-sm">
                    {c?.email ? (
                      <p className="text-white/90">
                        <span className="font-semibold text-white">Email:</span>{' '}
                        <Link
                          href={`mailto:${c.email}`}
                          className="break-all text-white/90 hover:text-white"
                        >
                          {c.email}
                        </Link>
                      </p>
                    ) : null}

                    {c?.phone ? (
                      <p className="text-white/90">
                        <span className="font-semibold text-white">Phone:</span>{' '}
                        <Link
                          href={`tel:${String(c.phone).replace(/\s+/g, '')}`}
                          className="text-white/90 hover:text-white"
                        >
                          {c.phone}
                        </Link>
                      </p>
                    ) : null}

                    {(() => {
                      const url = getGoogleMapLink(c)
                      if (!url) return null

                      return (
                        <p className="text-white/90">
                          <Link
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-white/90 hover:text-white font-semibold underline"
                            aria-label={`Locate ${c?.title ?? 'centre'} on Google Maps`}
                          >
                            Locate on Google Maps
                          </Link>
                        </p>
                      )
                    })()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Divider */}
        <div className="mt-10 h-px w-full bg-white/10" />

        {/* Middle: Quick links + Socials | Legal + Contact */}
        <div className="grid grid-cols-1 gap-10 py-10 md:grid-cols-2">
          {/* Left column */}
          <div className="space-y-8">
            <div>
              <h4 className="text-lg font-semibold">Quick Links</h4>

              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/80">
                {navItems.length ? (
                  navItems.map((item: NavItem, idx: number) => (
                    <React.Fragment key={idx}>
                      <CMSLink className="hover:text-white" {...item.link} />
                      {idx !== navItems.length - 1 ? (
                        <span className="text-white/25">|</span>
                      ) : null}
                    </React.Fragment>
                  ))
                ) : (
                  <span className="text-white/60">No links added.</span>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold">Follow us on Socials</h4>

              <div className="mt-4 flex flex-wrap gap-3">
                {socials.length ? (
                  socials.map((s: SocialItem, idx: number) => {
                    const raw = String(s?.platform ?? '')
                      .toLowerCase()
                      .trim()
                    const href = s?.url || '#'
                    const Icon = isSocialKey(raw) ? ICONS[raw] : null

                    return (
                      <Link
                        key={`${raw || 'social'}-${idx}`}
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={raw || 'social'}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#06131b] transition hover:scale-[1.03] hover:bg-white/90 active:scale-[0.98]"
                      >
                        {Icon ? (
                          <Icon className="h-5 w-5" />
                        ) : (
                          <span className="text-xs">link</span>
                        )}
                      </Link>
                    )
                  })
                ) : (
                  <span className="text-sm text-white/60">No social links added.</span>
                )}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6 md:pl-8">
            <div>
              <h4 className="text-lg font-semibold">Legal</h4>

              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/80">
                {legalItems.length ? (
                  legalItems.map((item: NavItem, idx: number) => (
                    <React.Fragment key={idx}>
                      <CMSLink className="hover:text-white" {...item.link} />
                      {idx !== legalItems.length - 1 ? (
                        <span className="text-white/25">|</span>
                      ) : null}
                    </React.Fragment>
                  ))
                ) : (
                  <span className="text-white/60">No legal links added.</span>
                )}
              </div>
            </div>

            <div className="space-y-3 text-sm text-white/85">
              {phones.length ? (
                <p className="leading-relaxed">
                  <span className="font-semibold text-white">Phone:</span>{' '}
                  <span className="break-words">
                    {phones.map((p, idx) => (
                      <React.Fragment key={p}>
                        <Link href={`tel:${p.replace(/\s+/g, '')}`} className="hover:text-white">
                          {p}
                        </Link>
                        {idx !== phones.length - 1 ? <span>, </span> : null}
                      </React.Fragment>
                    ))}
                  </span>
                </p>
              ) : null}

              {emails.length ? (
                <p className="leading-relaxed">
                  <span className="font-semibold text-white">Email:</span>{' '}
                  <span className="break-all">
                    {emails.map((e, idx) => (
                      <React.Fragment key={e}>
                        <Link href={`mailto:${e}`} className="hover:text-white">
                          {e}
                        </Link>
                        {idx !== emails.length - 1 ? <span>, </span> : null}
                      </React.Fragment>
                    ))}
                  </span>
                </p>
              ) : null}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pb-6">
          <div className="h-px w-full bg-white/10" />
          <p className="pt-6 text-center text-sm text-white/75">{copyright}</p>
        </div>
      </div>
    </footer>
  )
}
