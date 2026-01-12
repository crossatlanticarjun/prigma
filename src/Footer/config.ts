import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateFooter } from './hooks/revalidateFooter'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
  },
  fields: [
    // Centres (Top cards)
    {
      name: 'centres',
      type: 'array',
      maxRows: 4,
      admin: { initCollapsed: true },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'address', type: 'text', required: true },
        { name: 'email', type: 'email', required: true },
        { name: 'phone', type: 'text', required: true },
      ],
    },

    // Quick Links (your existing navItems)
    {
      name: 'navItems',
      label: 'Quick Links',
      type: 'array',
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 6,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Footer/RowLabel#RowLabel',
        },
      },
    },

    // Legal Links
    {
      name: 'legalItems',
      label: 'Legal Links',
      type: 'array',
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 6,
      admin: { initCollapsed: true },
    },

    // Socials
    {
      name: 'socials',
      type: 'array',
      maxRows: 10,
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'platform',
          type: 'select',
          required: true,
          options: [
            { label: 'Facebook', value: 'facebook' },
            { label: 'Instagram', value: 'instagram' },
            { label: 'YouTube', value: 'youtube' },
            { label: 'LinkedIn', value: 'linkedin' },
            { label: 'X', value: 'x' },
          ],
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
      ],
    },

    // Contact block (right column)
    {
      name: 'contact',
      type: 'group',
      fields: [
        {
          name: 'phones',
          type: 'array',
          maxRows: 6,
          fields: [{ name: 'phone', type: 'text', required: true }],
          admin: { initCollapsed: true },
        },
        {
          name: 'emails',
          type: 'array',
          maxRows: 6,
          fields: [{ name: 'email', type: 'email', required: true }],
          admin: { initCollapsed: true },
        },
      ],
    },

    // Footer bottom line
    {
      name: 'copyrightText',
      type: 'text',
      required: true,
      defaultValue:
        '© Copyright 2026 PRiGma Classes (IIT JEE MAINS & ADVANCED) All Rights Reserved. | Designed By: Cross Atlantic Software',
    },
    // Footer Scripts (pixels, chat, etc.)
    {
      name: 'footerScripts',
      label: 'Footer Scripts',
      type: 'code',
      required: false,
      admin: {
        language: 'html',
        description:
          'Paste scripts injected before </body>. Example: chat widget, tracking pixels, GTM noscript. Avoid <head> only scripts here.',
      },
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}
