'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { useHeaderTheme } from '@/providers/HeaderTheme'
import type { Header } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { HeaderNav } from './Nav'

import {
  FaXTwitter,
  FaLinkedinIn,
  FaInstagram,
  FaFacebookF,
  FaYoutube,
  FaWhatsapp,
  FaPhone,
  FaEnvelope,
  FaBars,
  FaXmark,
} from 'react-icons/fa6'
import type { IconType } from 'react-icons'
import { MoveRight } from 'lucide-react'

/** ---------- Social Icons Map ---------- */
const ICONS = {
  FaXTwitter,
  FaLinkedinIn,
  FaInstagram,
  FaFacebookF,
  FaYoutube,
  FaWhatsapp,
} satisfies Record<string, IconType>

type IconKey = keyof typeof ICONS

function SocialIcon({ iconKey, className }: { iconKey?: IconKey; className?: string }) {
  if (!iconKey) return null
  const Icon = ICONS[iconKey]
  return <Icon className={className ?? 'h-4 w-4'} aria-hidden="true" />
}

/** ---------- Local Types (no any) ---------- */
type HeaderLink = {
  url?: string | null
  href?: string | null
  link?: string | null
  label?: string | null
  text?: string | null
  title?: string | null
}

type HeaderContactButton = {
  enabled?: boolean | null
  label?: string | null
  link?: HeaderLink | null
}

type HeaderLogoMedia = {
  url?: string | null
  alt?: string | null
  width?: number | null
  height?: number | null
  sizes?: Record<string, { url?: string | null } | undefined> | null
}

type SocialLink = {
  label?: string | null
  url?: string | null
  openInNewTab?: boolean | null
  iconKey?: IconKey | null
}

type HeaderExtended = Header & {
  contactNumber?: string | null
  contactEmail?: string | null
  slogan?: string | null
  contactButton?: HeaderContactButton | null
  logo?: HeaderLogoMedia | null
  socialLinks?: SocialLink[] | null
}

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  const header = data as HeaderExtended

  const [theme, setTheme] = useState<string | null>(null)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    setHeaderTheme(null)
    setMobileOpen(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  useEffect(() => {
    if (!mobileOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [mobileOpen])

  const socials = useMemo(() => header?.socialLinks ?? [], [header])

  const phone = header?.contactNumber ?? undefined
  const email = header?.contactEmail ?? undefined
  const slogan = header?.slogan ?? undefined

  const contactBtn = header?.contactButton ?? undefined
  const contactEnabled = contactBtn?.enabled !== false

  const contactLabel =
    contactBtn?.label ||
    contactBtn?.link?.label ||
    contactBtn?.link?.text ||
    contactBtn?.link?.title ||
    'Contact us'

  const contactHref =
    contactBtn?.link?.url || contactBtn?.link?.href || contactBtn?.link?.link || '/contact'

  return (
    <header className="relative z-50" {...(theme ? { 'data-theme': theme } : {})}>
      {/* TOP BAR */}
      <div className="w-full bg-themeBlue text-white">
        <div className="mx-auto container">
          <div className="flex h-11 items-center justify-between gap-4">
            {/* left */}
            <div className="flex items-center gap-6 text-sm">
              {phone ? (
                <a href={`tel:${phone.replace(/\s+/g, '')}`} className="flex items-center gap-2">
                  <FaPhone className="h-4 w-4" aria-hidden="true" />
                  <span className="hidden sm:inline">{phone}</span>
                </a>
              ) : null}

              {email ? (
                <a href={`mailto:${email}`} className="flex items-center gap-2">
                  <FaEnvelope className="h-4 w-4" aria-hidden="true" />
                  <span className="hidden sm:inline">{email}</span>
                </a>
              ) : null}
            </div>

            {/* center */}
            {slogan ? (
              <div className="hidden flex-1 text-center text-sm md:block">
                <span className="opacity-95">{slogan}</span>
              </div>
            ) : (
              <div className="hidden flex-1 md:block" />
            )}

            {/* right */}
            <div className="flex items-center gap-4">
              {socials.map((s, idx) => {
                if (!s?.url) return null
                const newTab = s.openInNewTab !== false

                return (
                  <a
                    key={`${s.url}-${idx}`}
                    href={s.url}
                    target={newTab ? '_blank' : undefined}
                    rel={newTab ? 'noreferrer' : undefined}
                    aria-label={s.label ?? 'social'}
                    className="hover:opacity-90"
                  >
                    <SocialIcon iconKey={s.iconKey ?? undefined} />
                  </a>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* MAIN BAR */}
      <div className="w-full bg-white">
        <div className="mx-auto container">
          <div className="flex items-center justify-between py-4 lg:py-5">
            {/* logo */}
            <Link href="/" className="flex items-center">
              <Logo logo={header.logo ?? null} loading="eager" priority="high" />
            </Link>

            {/* desktop nav */}
            <div className="hidden flex-1 justify-center lg:flex">
              <HeaderNav data={data} />
            </div>

            {/* actions */}
            <div className="flex items-center gap-3">
              {contactEnabled ? (
                <Link
                  href={contactHref}
                  className="hidden sm:inline-flex items-center gap-3 rounded-md bg-themeOrange px-5 py-3 text-sm font-semibold text-white hover:bg-orange-600 duration-500"
                >
                  <span>{contactLabel}</span>
                  <MoveRight aria-hidden="true" />
                </Link>
              ) : null}

              {/* hamburger */}
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-black/10 lg:hidden"
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileOpen}
                onClick={() => setMobileOpen((v) => !v)}
              >
                {mobileOpen ? <FaXmark className="h-5 w-5" /> : <FaBars className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* MOBILE DRAWER */}
        <div className={mobileOpen ? 'lg:hidden' : 'hidden lg:hidden'}>
          {/* overlay */}
          <button
            type="button"
            aria-label="Close menu overlay"
            className="fixed inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />

          {/* panel */}
          <div className="fixed right-0 top-0 h-dvh w-[85vw] max-w-[360px] bg-white shadow-xl flex flex-col">
            {/* header */}
            <div className="flex items-center justify-between border-b px-4 py-4">
              <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center">
                <Logo logo={header.logo ?? null} loading="eager" priority="high" />
              </Link>

              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-black/10"
                aria-label="Close menu"
                onClick={() => setMobileOpen(false)}
              >
                <FaXmark className="h-5 w-5" />
              </button>
            </div>

            {/* nav area */}
            <div className="flex-1 overflow-auto px-4 py-4">
              <HeaderNav
                data={data}
                variant="mobileChips"
                onNavigate={() => setMobileOpen(false)}
              />
            </div>

            {/* bottom CTA */}
            {contactEnabled ? (
              <div className="border-t px-4 py-4">
                <Link
                  href={contactHref}
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex w-full items-center justify-center gap-3 rounded-md bg-themeOrange px-5 py-3 text-sm font-semibold text-white hover:bg-orange-600 duration-500"
                >
                  <span>{contactLabel}</span>
                  <MoveRight aria-hidden="true" />
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  )
}
