import type { CollectionConfig } from 'payload'
import { slugField } from './slug'

export const CourseCategory: CollectionConfig = {
  slug: 'course-category',

  // ✅ default sort for Admin List View + API when no sort is specified
  defaultSort: 'sortOrder',

  admin: {
    group: 'Courses',
    useAsTitle: 'title',
    defaultColumns: ['title', 'sortOrder', 'slug', 'updatedAt'],
    enableListViewSelectAPI: true,
  },

  versions: { drafts: true },

  fields: [
    { name: 'title', type: 'text', required: true, index: true },

    {
      name: 'sortOrder',
      label: 'Order',
      type: 'number',
      index: true,
      admin: { step: 1, description: 'Lower number shows first.' },
    },

    slugField('title'),

    { name: 'description', type: 'textarea' },
  ],
}
