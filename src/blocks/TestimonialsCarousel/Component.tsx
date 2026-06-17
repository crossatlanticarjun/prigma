import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { TestimonialsCarouselClient } from './Client'
import type { TestimonialsCarouselBlockProps } from './types'

type Props = {
  block?: TestimonialsCarouselBlockProps
}

export const TestimonialsCarouselBlock: React.FC<Props> = async ({ block }) => {
  if (!block) return null

  const payload = await getPayload({ config })

  const limit = typeof block.limit === 'number' ? block.limit : 8

  const res = await payload.find({
    collection: 'testimonials',
    depth: 2,
    limit,
    sort: '-createdAt',
  })

  return (
    <TestimonialsCarouselClient
      badge={block.badge ?? 'Our Testimonials'}
      heading={block.heading ?? 'Students Taught & mentored by PRiGma team'}
      viewMore={block.viewMore ?? undefined}
      items={res.docs}
    />
  )
}
