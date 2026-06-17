import type { Block } from 'payload'

export const StudyCentres: Block = {
  slug: 'studyCentres',
  labels: {
    singular: 'Study Centres',
    plural: 'Study Centres',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
      admin: {
        placeholder: 'Our Study Centres',
      },
    },
    {
      name: 'subheading',
      type: 'textarea',
      required: false,
      admin: {
        placeholder: 'Find the nearest centre and connect with us.',
      },
    },
    {
      name: 'centres',
      type: 'array',
      required: true,
      minRows: 1,
      labels: { singular: 'Centre', plural: 'Centres' },
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'locationTitle',
          label: 'Center location title',
          type: 'text',
          required: true,
        },
        {
          name: 'locationAddress',
          label: 'Center location Address',
          type: 'text',
          required: true,
        },
        {
          name: 'emailPrimary',
          label: 'Center email (primary)',
          type: 'email',
          required: true,
        },
        {
          name: 'phone',
          label: 'Center phone number',
          type: 'text',
          required: true,
        },
        {
          name: 'emailSecondary',
          label: 'Center email (secondary)',
          type: 'email',
          required: false,
        },
        {
          name: 'googleMapUrl',
          label: 'Google map location URL',
          type: 'text',
          required: true,
          admin: {
            placeholder:
              'Paste Google Maps link (https://maps.google.com/... or https://maps.app.goo.gl/...)',
          },
          validate: (val: unknown) => {
            if (val == null) return 'Google map URL is required'
            const s = String(val).trim()
            const ok =
              /^https?:\/\/(www\.)?(google\.com\/maps|maps\.app\.goo\.gl|goo\.gl\/maps)\/.+/i.test(
                s,
              )
            return ok ? true : 'Paste a valid Google Maps URL'
          },
        },
      ],
    },
  ],
}
