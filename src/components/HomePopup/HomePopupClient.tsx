'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import type { HomePopup as HomePopupType } from '@/payload-types'

type MediaLike =
  | {
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
  | string
  | number
  | null
  | undefined

type Props = {
  data: HomePopupType
}

const STORAGE_KEY_COUNT = 'prigma_home_popup_close_count_v1'
const STORAGE_KEY_DAY = 'prigma_home_popup_day_v1'
const MAX_SHOWS_PER_DAY = 5

function todayKey(): string {
  const d = new Date()
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

function ensureDailyReset(): void {
  try {
    const today = todayKey()
    const saved = window.localStorage.getItem(STORAGE_KEY_DAY)

    if (saved !== today) {
      window.localStorage.setItem(STORAGE_KEY_DAY, today)
      window.localStorage.setItem(STORAGE_KEY_COUNT, '0')
    }
  } catch {
    // ignore storage errors
  }
}

function getCloseCount(): number {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY_COUNT)
    const n = raw ? Number(raw) : 0
    return Number.isFinite(n) && n >= 0 ? n : 0
  } catch {
    return 0
  }
}

function setCloseCount(n: number): void {
  try {
    window.localStorage.setItem(STORAGE_KEY_COUNT, String(n))
  } catch {
    // ignore storage errors
  }
}

function getMediaObject(
  image: MediaLike,
): { url: string; alt?: string | null; width?: number | null; height?: number | null } | null {
  if (!image || typeof image !== 'object') return null

  const url =
    image.sizes?.medium?.url ||
    image.sizes?.small?.url ||
    image.sizes?.thumbnail?.url ||
    image.url ||
    null

  if (!url) return null

  return {
    url,
    alt: image.alt ?? null,
    width: image.sizes?.medium?.width ?? image.width ?? null,
    height: image.sizes?.medium?.height ?? image.height ?? null,
  }
}

export function HomePopupClient({ data }: Props) {
  const [open, setOpen] = useState(false)

  const media = useMemo(() => getMediaObject(data?.image as MediaLike), [data?.image])

  useEffect(() => {
    if (!data?.enabled) return
    if (!media?.url) return

    ensureDailyReset()

    const count = getCloseCount()
    if (count < MAX_SHOWS_PER_DAY) setOpen(true)
  }, [data?.enabled, media?.url])

  if (!data?.enabled) return null
  if (!media?.url) return null
  if (!open) return null

  const href = (data?.link ?? '').trim()
  const clickable = href.length > 0

  const onClose = () => {
    ensureDailyReset()
    const count = getCloseCount()
    const next = Math.min(count + 1, MAX_SHOWS_PER_DAY)
    setCloseCount(next)
    setOpen(false)
  }

  const width = typeof media.width === 'number' && media.width > 0 ? media.width : 1200
  const height = typeof media.height === 'number' && media.height > 0 ? media.height : 700

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4">
      <div className="relative w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-themeOrange text-sm text-white"
          aria-label="Close popup"
        >
          ✕
        </button>

        {clickable ? (
          <a
            href={href}
            target={data?.openInNewTab ? '_blank' : undefined}
            rel={data?.openInNewTab ? 'noreferrer noopener' : undefined}
            onClick={onClose}
            className="block"
          >
            <Image
              src={media.url}
              alt={media.alt ?? 'Popup'}
              width={width}
              height={height}
              className="h-auto w-full"
              sizes="(max-width: 768px) 92vw, 640px"
              priority
            />
          </a>
        ) : (
          <Image
            src={media.url}
            alt={media.alt ?? 'Popup'}
            width={width}
            height={height}
            className="h-auto w-full"
            sizes="(max-width: 768px) 92vw, 640px"
            priority
          />
        )}
      </div>
    </div>
  )
}
