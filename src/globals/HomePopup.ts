import type { GlobalConfig } from 'payload'

export const HomePopup: GlobalConfig = {
  slug: 'homePopup',
  label: 'Home Popup',
  admin: {
    group: 'Content',
  },
  access: {
    read: () => true, // public can read this global
  },
  fields: [
    {
      name: 'image',
      label: 'Popup Image',
      type: 'upload',
      relationTo: 'media', // IMPORTANT: your Media collection slug must be "media"
      required: false,
    },
    {
      name: 'link',
      label: 'Optional Link',
      type: 'text',
      required: false,
    },
    {
      name: 'openInNewTab',
      label: 'Open link in new tab',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'enabled',
      label: 'Enable Popup',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}
