import type { FieldHook } from 'payload'

export const formatSlug =
  (fallbackField = 'title'): FieldHook =>
  ({ value, data, originalDoc }) => {
    const fallback =
      (data?.[fallbackField] as string | undefined) ||
      (originalDoc?.[fallbackField] as string | undefined)

    const input = (typeof value === 'string' && value.trim().length ? value : fallback) || ''

    return input
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }
