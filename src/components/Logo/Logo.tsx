'use client'

import React from 'react'
import clsx from 'clsx'
import Image from 'next/image'

type MediaSize = { url?: string | null }

export type Media = {
  url?: string | null
  alt?: string | null
  width?: number | null
  height?: number | null
  sizes?: {
    thumbnail?: MediaSize
    small?: MediaSize
    medium?: MediaSize
    large?: MediaSize
  } | null
}

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
  // Payload upload relation can be an ID string when not populated
  logo?: string | Media | null
  fallbackSrc?: string
}

export const Logo: React.FC<Props> = ({
  className,
  loading = 'lazy',
  priority = 'low',
  logo,
  fallbackSrc = 'https://bba8wrr2lezn6wxq.public.blob.vercel-storage.com/logo-prigma.png',
}) => {
  const media = typeof logo === 'object' && logo ? logo : null

  const src =
    media?.url ??
    media?.sizes?.medium?.url ??
    media?.sizes?.small?.url ??
    media?.sizes?.thumbnail?.url ??
    fallbackSrc

  const alt = media?.alt ?? 'Site Logo'

  // next/image needs width/height numbers. Use media dimensions if present.
  const width = (media?.width ?? 600) || 600
  const height = (media?.height ?? 177) || 177

  return (
    <Image
      alt={alt}
      width={width}
      height={height}
      loading={loading}
      fetchPriority={priority}
      className={clsx('h-auto max-h-[50px] w-auto object-contain', className)}
      src={src}
      // avoids remote domain config blocking during build
      unoptimized
    />
  )
}
