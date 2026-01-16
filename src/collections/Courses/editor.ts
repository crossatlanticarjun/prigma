import {
  EXPERIMENTAL_TableFeature,
  FixedToolbarFeature,
  HeadingFeature,
  OrderedListFeature,
  UnorderedListFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const courseLexicalEditor = lexicalEditor({
  features: ({ defaultFeatures }) => [
    ...defaultFeatures,

    // Make the buttons visible (otherwise you mostly rely on inline toolbar + "/" menu)
    FixedToolbarFeature(),

    // Headings + lists (these are "included by default" normally, but templates often trim defaults)
    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
    UnorderedListFeature(),
    OrderedListFeature(),

    // Tables (not included by default)
    EXPERIMENTAL_TableFeature(),
  ],
})
