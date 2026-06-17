import type { Access, FieldHook } from 'payload'

type UserLike = {
  role?: string
  roles?: string[]
}

export const isAdmin = ({ req }: Parameters<Access>[0]) => {
  const user = req.user as unknown as UserLike | null | undefined
  const roles = Array.isArray(user?.roles) ? user!.roles : user?.role ? [user.role] : []
  return roles.includes('admin')
}

/**
 * Only admins can create/update/delete.
 * Read is public but only for published docs (when drafts are enabled).
 */
export const adminsOnly: Access = (args) => isAdmin(args)

export const publishedOrAdmins: Access = (args) => {
  if (isAdmin(args)) return true
  return {
    _status: {
      equals: 'published',
    },
  }
}

// Simple, predictable slugify (no deps)
export const slugify = (input: string) =>
  input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)

export const slugFromField =
  (sourceField: string): FieldHook =>
  ({ value, siblingData }) => {
    const direct = typeof value === 'string' ? value.trim() : ''
    if (direct) return slugify(direct)

    const src = siblingData?.[sourceField]
    if (typeof src === 'string' && src.trim()) return slugify(src)

    return value
  }

export const validateSlug = (val: unknown) => {
  if (typeof val !== 'string' || !val.trim()) return 'Slug is required.'
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(val)) {
    return 'Use lowercase letters, numbers, and hyphens only.'
  }
  return true
}
