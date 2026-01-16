import type { Block } from 'payload'

export const CoursesExplorerBlock: Block = {
  slug: 'coursesExplorer',
  labels: {
    singular: 'Courses Explorer',
    plural: 'Courses Explorer',
  },
  fields: [
    { name: 'heading', type: 'text', defaultValue: 'Courses' },
    {
      name: 'basePath',
      type: 'text',
      defaultValue: '/prigma-courses',
      admin: {
        description: 'Used for course detail links. Example: /prigma-courses',
      },
    },
    {
      name: 'maxCourses',
      type: 'number',
      defaultValue: 200,
      min: 1,
      max: 2000,
      admin: { description: 'Safety cap for list page queries.' },
    },
    { name: 'showCategoryDescription', type: 'checkbox', defaultValue: false },
    { name: 'showCourseDescription', type: 'checkbox', defaultValue: true },
    { name: 'hideEmptyCategories', type: 'checkbox', defaultValue: true },
  ],
}
