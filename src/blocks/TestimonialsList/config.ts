import type { Block } from 'payload'

export const testimonialsList: Block = {
  slug: 'testimonialsList',
  interfaceName: 'TestimonialsListBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
      defaultValue: 'What our students say',
    },
    {
      name: 'items',
      type: 'relationship',
      relationTo: 'testimonials',
      hasMany: true,
      required: true,
    },
  ],
}
