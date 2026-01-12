import type { Block } from 'payload'

export const PageHeader: Block = {
  slug: 'pageHeader',
  interfaceName: 'PageHeaderBlock',
  labels: { singular: 'Page Header', plural: 'Page Headers' },
  fields: [{ name: 'title', type: 'text', label: 'Title (optional override)' }],
}
