import type { Block } from 'payload'

export const TestimonialsCarousel: Block = {
  slug: 'testimonialsCarousel',
  labels: {
    singular: 'Testimonials Carousel',
    plural: 'Testimonials Carousels',
  },
  fields: [
    {
      name: 'badge',
      label: 'Top Badge Text',
      type: 'text',
      defaultValue: 'Our Testimonials',
    },
    {
      name: 'heading',
      label: 'Heading',
      type: 'text',
      defaultValue: 'Students Taught & mentored by PRiGma team',
    },
    {
      name: 'limit',
      label: 'Number of testimonials to show',
      type: 'number',
      defaultValue: 8,
      min: 1,
      max: 50,
      admin: { step: 1 },
    },
    {
      name: 'viewMore',
      label: 'View More Link',
      type: 'group',
      fields: [
        { name: 'label', type: 'text', defaultValue: 'View More' },
        { name: 'href', type: 'text' },
        { name: 'newTab', type: 'checkbox', defaultValue: false },
      ],
    },
  ],
}
