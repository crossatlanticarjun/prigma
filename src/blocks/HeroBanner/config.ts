import type { Block } from 'payload'

export const HeroBanner: Block = {
  slug: 'heroBanner',
  labels: {
    singular: 'Hero Banner',
    plural: 'Hero Banners',
  },
  fields: [
    {
      name: 'badgeText',
      type: 'text',
      required: false,
      defaultValue: 'Master JEE prep with PRiGma',
    },
    {
      name: 'heading',
      type: 'text',
      required: true,
      defaultValue: 'WHERE POTENTIAL MEETS PERFORMANCE',
    },
    {
      name: 'description',
      type: 'textarea',
      required: false,
      defaultValue:
        'PRiGma focuses on building strong conceptual foundations, encourages independent thinking, and instils the values of hard work, integrity, and resilience in our students. Our vision goes beyond IIT-JEE success to shaping individuals prepared for future challenges and who use their knowledge for betterment of the society also.',
    },

    {
      name: 'cta',
      type: 'group',
      fields: [
        { name: 'label', type: 'text', required: true, defaultValue: 'Enquire Now' },
        { name: 'href', type: 'text', required: true, defaultValue: '/contact' },
        { name: 'newTab', type: 'checkbox', defaultValue: false },
      ],
    },

    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
    {
      name: 'foregroundImage',
      type: 'upload',
      relationTo: 'media',
      required: false,
      admin: {
        description: 'Optional right-side student image (PNG/WebP preferred).',
      },
    },

    {
      name: 'valueCards',
      type: 'array',
      minRows: 0,
      maxRows: 6,
      fields: [
        {
          name: 'icon',
          type: 'select',
          required: true,
          defaultValue: 'integrity',
          options: [
            { label: 'Integrity', value: 'integrity' },
            { label: 'Transparency', value: 'transparency' },
            { label: 'Parent Trust', value: 'parentTrust' },
            { label: 'Excellence', value: 'excellence' },
            { label: 'Discipline', value: 'discipline' },
          ],
        },
        { name: 'title', type: 'text', required: true, defaultValue: 'Integrity' },
        { name: 'subtitle', type: 'text', required: false, defaultValue: 'Our core value' },
      ],
      defaultValue: [
        { icon: 'integrity', title: 'Integrity', subtitle: 'Our core value' },
        { icon: 'transparency', title: 'Transparency', subtitle: 'In our actions' },
        { icon: 'parentTrust', title: 'Parent Trust', subtitle: 'Paramount for us' },
      ],
    },

    {
      name: 'overlay',
      type: 'group',
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'opacity',
          type: 'number',
          min: 0,
          max: 100,
          defaultValue: 55,
          admin: { description: '0–100' },
        },
      ],
    },
  ],
}
