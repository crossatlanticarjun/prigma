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
    }
  | string
  | number
  | null
  | undefined

type Props = {
  data: HomePopupType
}

const STORAGE_KEY_COUNT = 'prigma_home_popup_close_count_v1'
const MAX_SHOWS = 5

function getMediaObject(
  image: MediaLike,
): { url: string; alt?: string | null; width?: number | null; height?: number | null } | null {
  if (!image) return null
  if (typeof image === 'object' && 'url' in image && image.url) {
    return {
      url: image.url,
      alt: 'alt' in image ? (image.alt ?? null) : null,
      width: 'width' in image ? (image.width as number | null) : null,
      height: 'height' in image ? (image.height as number | null) : null,
    }
  }
  return null
}

function getCloseCount(): number {
  const raw = window.localStorage.getItem(STORAGE_KEY_COUNT)
  const n = raw ? Number(raw) : 0
  return Number.isFinite(n) && n >= 0 ? n : 0
}

export function HomePopupClient({ data }: Props) {
  const [open, setOpen] = useState(false)

  const media = useMemo(() => getMediaObject(data?.image as MediaLike), [data?.image])

  useEffect(() => {
    if (!data?.enabled) return
    if (!media?.url) return

    const count = getCloseCount()
    if (count < MAX_SHOWS) setOpen(true)
  }, [data?.enabled, media?.url])

  if (!data?.enabled) return null
  if (!media?.url) return null
  if (!open) return null

  const href = (data?.link ?? '').trim()
  const clickable = href.length > 0

  const onClose = () => {
    const count = getCloseCount()
    const next = Math.min(count + 1, MAX_SHOWS)
    window.localStorage.setItem(STORAGE_KEY_COUNT, String(next))
    setOpen(false)
  }

  const width = typeof media.width === 'number' && media.width > 0 ? media.width : 1200
  const height = typeof media.height === 'number' && media.height > 0 ? media.height : 700

  const imgEl = (
    <Image
      src={media.url}
      alt={media.alt ?? 'Popup'}
      width={width}
      height={height}
      className="h-auto w-full"
      sizes="(max-width: 768px) 92vw, 640px"
      priority
    />
  )

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4">
      <div className="relative w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 rounded-full bg-themeOrange w-8 h-8 justify-center flex items-center text-sm text-white"
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
            {imgEl}
          </a>
        ) : (
          imgEl
        )}
      </div>
    </div>
  )
}
