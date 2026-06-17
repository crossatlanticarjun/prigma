import type { Block } from 'payload'

const youtubeIdRegex = /^[a-zA-Z0-9_-]{11}$/

export const YouTubeVideos: Block = {
  slug: 'youtubeVideos',
  interfaceName: 'YouTubeVideosBlock',
  labels: {
    singular: 'YouTube Videos',
    plural: 'YouTube Videos',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
    },
    {
      name: 'videos',
      type: 'array',
      label: 'Videos',
      minRows: 1,
      fields: [
        {
          name: 'videoId',
          type: 'text',
          label: 'YouTube Video ID',
          required: true,
          admin: {
            placeholder: 'dQw4w9WgXcQ',
            description: 'Add only the YouTube video ID, not the full URL.',
          },
          validate: (value: string | null | undefined) => {
            if (!value) return 'Video ID is required'
            if (!youtubeIdRegex.test(value)) {
              return 'Enter a valid YouTube video ID'
            }
            return true
          },
        },
        {
          name: 'title',
          type: 'text',
          label: 'Title',
        },
        {
          name: 'type',
          type: 'select',
          label: 'Video Type',
          defaultValue: 'short',
          options: [
            {
              label: 'Short',
              value: 'short',
            },
            {
              label: 'Regular Video',
              value: 'video',
            },
          ],
        },
      ],
    },
  ],
}
