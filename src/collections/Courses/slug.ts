import type { Field } from 'payload'

const formatSlug = (val: string) =>
  val
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')

export const slugField = (from: string): Field => ({
  name: 'slug',
  type: 'text',
  unique: true,
  index: true,
  required: true,
  hooks: {
    beforeValidate: [
      ({ value, data }) => {
        const v = typeof value === 'string' ? value : ''
        if (v) return formatSlug(v)
        const source = data?.[from]
        if (typeof source === 'string' && source.trim()) return formatSlug(source)
        return v
      },
    ],
  },
  admin: {
    position: 'sidebar',
    description: 'Auto-generated from title if empty.',
  },
})
