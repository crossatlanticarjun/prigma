import type { CollectionConfig } from 'payload'
import { slugField } from './slug'
import { courseLexicalEditor } from './editor'

export const Course: CollectionConfig = {
  slug: 'course',
  admin: {
    group: 'Courses',
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'slug', 'updatedAt'],
    enableListViewSelectAPI: true,
  },
  versions: { drafts: true },
  fields: [
    { name: 'title', type: 'text', required: true, index: true },
    slugField('title'),
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'course-category',
      required: true,
      index: true,
    },
    { name: 'shortDescription', type: 'textarea' },
    { name: 'description', type: 'richText', editor: courseLexicalEditor },
    {
      name: 'level',
      type: 'select',
      defaultValue: 'beginner',
      options: [
        { label: 'Beginner', value: 'beginner' },
        { label: 'Intermediate', value: 'intermediate' },
        { label: 'Advanced', value: 'advanced' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'mode',
      type: 'select',
      defaultValue: 'offline',
      options: [
        { label: 'Offline', value: 'offline' },
        { label: 'Online', value: 'online' },
        { label: 'Hybrid', value: 'hybrid' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'durationText', type: 'text', admin: { position: 'sidebar' } },
    { name: 'priceINR', type: 'number', min: 0, admin: { position: 'sidebar' } },
    { name: 'isFeatured', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
    { name: 'sortOrder', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
  ],
}
