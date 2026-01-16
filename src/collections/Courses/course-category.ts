import type { CollectionConfig } from 'payload'
import { slugField } from './slug'

export const CourseCategory: CollectionConfig = {
  slug: 'course-category',
  admin: {
    group: 'Courses',
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    enableListViewSelectAPI: true,
  },
  versions: { drafts: true },
  fields: [
    { name: 'title', type: 'text', required: true, index: true },
    slugField('title'),
    { name: 'description', type: 'textarea' },
  ],
}
