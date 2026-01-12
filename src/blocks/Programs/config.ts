import type { Block } from 'payload'

export const Programs: Block = {
  slug: 'programs',
  interfaceName: 'ProgramsBlock',
  fields: [
    { name: 'pillText', type: 'text', required: true, defaultValue: 'Our Programs' },
    {
      name: 'heading',
      type: 'text',
      required: true,
      defaultValue: 'A caring environment designed to inspire learning & joy',
    },
    {
      name: 'programs',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 2,
      fields: [
        { name: 'title', type: 'text', required: true },
        {
          name: 'meta',
          type: 'array',
          required: true,
          minRows: 1,
          maxRows: 6,
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'value', type: 'text', required: true },
          ],
        },
        {
          name: 'featuresHeading',
          type: 'text',
          required: true,
          defaultValue: 'Course features',
        },
        {
          name: 'features',
          type: 'array',
          required: true,
          minRows: 1,
          maxRows: 20,
          fields: [{ name: 'text', type: 'text', required: true }],
        },
      ],
    },
    {
      name: 'bottomNote',
      type: 'group',
      fields: [
        { name: 'prefix', type: 'text', required: false, defaultValue: '' },
        { name: 'highlightText', type: 'text', required: true, defaultValue: 'Contact us' },
        { name: 'highlightHref', type: 'text', required: true, defaultValue: '/contact' },
        {
          name: 'suffix',
          type: 'text',
          required: false,
          defaultValue: ' for a counselling session for your child',
        },
        { name: 'newTab', type: 'checkbox', defaultValue: false },
      ],
    },
  ],
}
