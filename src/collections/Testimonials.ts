// src/collections/Testimonials.ts
import type { CollectionConfig } from 'payload'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  labels: { singular: 'Testimonial', plural: 'Testimonials' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'marksObtained', 'updatedAt'],
    group: 'Content',
  },
  access: { read: () => true },
  fields: [
    { name: 'name', type: 'text', required: true, index: true },

    {
      name: 'marksObtained',
      label: 'Marks Obtained',
      type: 'text',
      required: true,
    },

    {
      name: 'description',
      label: 'Description',
      type: 'richText',
      required: true,
    },

    { name: 'photo', type: 'upload', relationTo: 'media', required: true },
  ],
}
