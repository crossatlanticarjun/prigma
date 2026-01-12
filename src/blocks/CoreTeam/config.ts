import type { Block } from 'payload'

export const CoreTeam: Block = {
  slug: 'coreTeam',
  interfaceName: 'CoreTeamBlock',
  fields: [
    {
      name: 'pillText',
      type: 'text',
      required: true,
      defaultValue: 'PRiGma Core Team',
    },
    {
      name: 'heading',
      type: 'text',
      required: true,
      defaultValue: 'Dedicated Tutors shaping the young bright minds',
    },
    {
      name: 'members',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 8,
      fields: [
        { name: 'photo', type: 'upload', relationTo: 'media', required: true },
        {
          name: 'tag',
          type: 'text',
          required: true,
          admin: { description: 'PHYSICS / MATHS / CHEMISTRY / OPERATIONS' },
        },
        { name: 'name', type: 'text', required: true },
        {
          name: 'subtitle',
          type: 'text',
          required: false,
          admin: { description: 'e.g., B-Tech IIT Kharagpur' },
        },
        {
          name: 'bullets',
          type: 'array',
          required: false,
          fields: [{ name: 'text', type: 'text', required: true }],
        },
      ],
    },
  ],
}
