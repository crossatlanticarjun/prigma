import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateHeader } from './hooks/revalidateHeader'

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
  },
  fields: [
    // 1) Contact number
    {
      name: 'contactNumber',
      label: 'Contact Number',
      type: 'text',
      admin: {
        placeholder: '+91 98765 43210',
      },
    },

    // 2) Email
    {
      name: 'contactEmail',
      label: 'Email',
      type: 'email',
      admin: {
        placeholder: 'support@yourdomain.com',
      },
    },

    // 3) Slogan
    {
      name: 'slogan',
      label: 'Slogan',
      type: 'text',
      admin: {
        placeholder: 'Your one-line tagline',
      },
    },

    // 4) Multiple social links with icons
    {
      name: 'socialLinks',
      label: 'Social Links',
      type: 'array',
      maxRows: 10,
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'label',
          label: 'Label',
          type: 'text',
          required: true,
          admin: { placeholder: 'Instagram' },
        },
        {
          name: 'iconKey',
          label: 'Icon',
          type: 'select',
          required: true,
          options: [
            { label: 'Instagram', value: 'FaInstagram' },
            { label: 'Facebook', value: 'FaFacebookF' },
            { label: 'Twitter (X)', value: 'FaXTwitter' },
            { label: 'LinkedIn', value: 'FaLinkedinIn' },
            { label: 'YouTube', value: 'FaYoutube' },
            { label: 'WhatsApp', value: 'FaWhatsapp' },
          ],
        },
        {
          name: 'url',
          label: 'URL',
          type: 'text',
          required: true,
        },
        {
          name: 'openInNewTab',
          label: 'Open in new tab',
          type: 'checkbox',
          defaultValue: true,
        },
      ],
    },

    // 5) Logo
    {
      name: 'logo',
      label: 'Logo',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },

    // 6) Menu (existing)
    {
      name: 'navItems',
      label: 'Menu',
      type: 'array',
      maxRows: 6,
      fields: [
        link({
          appearances: false,
        }),
      ],
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Header/RowLabel#RowLabel',
        },
      },
    },

    // 7) Contact button (single CTA)
    {
      name: 'contactButton',
      label: 'Contact Button',
      type: 'group',
      required: false,
      fields: [
        {
          name: 'enabled',
          label: 'Enable',
          type: 'checkbox',
          defaultValue: true,
        },

        // This is the link field group, named via overrides
        link({
          appearances: false,
          overrides: {
            name: 'link',
            label: 'Button Link',
          },
        }),

        {
          name: 'label',
          label: 'Button Label Override',
          type: 'text',
          admin: {
            placeholder: 'Contact',
            description: 'Optional. If empty, use the link label.',
          },
        },
      ],
    },

    // 8) Header Scripts (GA, pixels, etc.)
    {
      name: 'headerScripts',
      label: 'Header Scripts',
      type: 'code',
      required: false,
      admin: {
        language: 'html',
        description:
          'Paste scripts you want injected into <head>. Example: Google Analytics, Meta Pixel. Do not paste <body> scripts here.',
      },
    },
    // 9) Body Start Scripts (GTM noscript, etc.)
    {
      name: 'bodyStartScripts',
      label: 'Body Start Scripts',
      type: 'code',
      required: false,
      admin: {
        language: 'html',
        description:
          'Injected immediately after <body> opens. Use this for Google Tag Manager <noscript> or any body-start HTML. Do not paste <script> that requires head here unless you know what you are doing.',
      },
    },
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}
