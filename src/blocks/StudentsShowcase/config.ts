import type { Block } from 'payload'

export const StudentsShowcase: Block = {
  slug: 'studentsShowcase',
  labels: {
    singular: 'Students Showcase',
    plural: 'Students Showcases',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
      admin: {
        placeholder: 'Top Rankers / Our Achievers / Students Results',
      },
    },
    {
      name: 'students',
      type: 'array',
      required: true,
      minRows: 1,
      labels: {
        singular: 'Student',
        plural: 'Students',
      },
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'stream',
          type: 'text',
          required: true,
        },
        {
          name: 'rank',
          type: 'text',
          admin: {
            description: 'Example: 1, 23, 145 (must be >= 1)',
          },
        },
      ],
    },
  ],
}
