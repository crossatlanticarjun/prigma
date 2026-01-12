import type { Block } from 'payload'

export const PrigmaHero: Block = {
  slug: 'prigmaHero',
  interfaceName: 'PrigmaHeroBlock',
  labels: {
    singular: 'Prigma Hero',
    plural: 'Prigma Heroes',
  },
  fields: [
    {
      name: 'leftImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },

    {
      name: 'pillText',
      type: 'text',
      required: true,
      defaultValue: 'About PRiGma',
    },

    {
      name: 'heading',
      type: 'text',
      required: true,
      defaultValue: 'Prigma: Redefining IIT JEE preparation',
    },

    {
      name: 'description',
      type: 'richText',
      required: true,
    },

    {
      name: 'primaryCTA',
      type: 'group',
      fields: [
        { name: 'label', type: 'text', required: true, defaultValue: 'Learn More' },
        {
          name: 'href',
          type: 'text',
          required: true,
          defaultValue: '/about',
          admin: { description: 'Internal path or full URL.' },
        },
        {
          name: 'newTab',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
    },

    {
      name: 'phoneCTA',
      type: 'group',
      fields: [
        { name: 'label', type: 'text', required: true, defaultValue: 'Phone Number' },
        {
          name: 'phone',
          type: 'text',
          required: true,
          defaultValue: '+91 79050 74634',
        },
      ],
    },
  ],
}
