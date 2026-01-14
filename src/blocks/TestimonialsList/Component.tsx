import React from 'react'
import type { Testimonial } from '@/payload-types'
import { TestimonialsListClient } from './Client'

export type TestimonialsListProps = {
  heading: string
  items: Testimonial[]
}

export const TestimonialsListBlock: React.FC<TestimonialsListProps> = (props) => {
  return <TestimonialsListClient {...props} />
}
