import type { Block } from 'payload'

export const ScholarshipBatchForm: Block = {
  slug: 'scholarshipBatchForm',
  interfaceName: 'ScholarshipBatchFormBlock',
  labels: {
    singular: 'Scholarship + Batch + Form',
    plural: 'Scholarship + Batch + Form',
  },
  fields: [
    {
      name: 'sectionId',
      type: 'text',
      label: 'Section ID',
    },

    {
      type: 'collapsible',
      label: 'Scholarship Card',
      fields: [
        {
          name: 'scholarshipTitle',
          type: 'text',
          required: true,
          defaultValue: 'SCHOLARSHIP TEST & FACULTY INTERACTION',
        },
        {
          name: 'scholarshipPoints',
          type: 'array',
          required: true,
          minRows: 1,
          fields: [
            {
              name: 'point',
              type: 'text',
              required: true,
            },
          ],
          defaultValue: [
            { point: 'Every Sunday, March 15, 2026 onwards' },
            { point: 'Timings: Between 10 am – 3 pm' },
            { point: 'Test Duration: 1 Hour' },
          ],
        },
      ],
    },

    {
      type: 'collapsible',
      label: 'New Batch Card',
      fields: [
        {
          name: 'batchTitle',
          type: 'text',
          required: true,
          defaultValue: 'NEW BATCH COMMENCEMENT',
        },
        {
          name: 'batchLines',
          type: 'array',
          required: true,
          minRows: 1,
          fields: [
            {
              name: 'line',
              type: 'text',
              required: true,
            },
          ],
          defaultValue: [
            { line: '2 YR PROGRAM, April 15, 2026' },
            { line: '3 YR PROGRAM, April 12, 2026' },
          ],
        },
      ],
    },
  ],
}
