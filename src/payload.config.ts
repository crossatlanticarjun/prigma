import { mongooseAdapter } from '@payloadcms/db-mongodb'
import sharp from 'sharp'
import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { fileURLToPath } from 'url'

import { Categories } from './collections/Categories'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Users } from './collections/Users'
import { Footer } from './Footer/config'
import { Header } from './Header/config'
import { plugins } from './plugins'
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'

// ✅ S3 storage adapter (official)
import { s3Storage } from '@payloadcms/storage-s3'

// ✅ Vercel Blob storage adapter (DISABLED)
// import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'

import { Testimonials } from './collections/Testimonials'
import { HomePopup } from './globals/HomePopup'
import { CoursesCollections } from './collections/Courses'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

/**
 * Enforce required env vars at runtime and fix TS `string | undefined` issues.
 */
function mustEnv(key: string): string {
  const value = process.env[key]
  if (!value || value.trim() === '') {
    throw new Error(`Missing required environment variable: ${key}`)
  }
  return value
}

export default buildConfig({
  admin: {
    components: {
      beforeLogin: ['@/components/BeforeLogin'],
      beforeDashboard: ['@/components/BeforeDashboard'],
    },
    importMap: {
      baseDir: path.resolve(dirname, 'src'),
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        { label: 'Mobile', name: 'mobile', width: 375, height: 667 },
        { label: 'Tablet', name: 'tablet', width: 768, height: 1024 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      ],
    },
  },

  editor: defaultLexical,

  db: mongooseAdapter({
    url: mustEnv('DATABASE_URL'),
  }),

  collections: [Pages, Posts, Testimonials, Media, Categories, ...CoursesCollections, Users],

  cors: [getServerSideURL()].filter(Boolean),

  globals: [Header, Footer, HomePopup],

  plugins: [
    /**
     * ✅ DISABLED: Vercel Blob adapter (kept for reference)
     */
    // vercelBlobStorage({
    //   enabled: true,
    //   collections: { media: true },
    //   cacheControlMaxAge: 60 * 60 * 24 * 30,
    //   token: mustEnv('BLOB_READ_WRITE_TOKEN'),
    // }),

    /**
     * ✅ ENABLED: AWS S3 adapter (matches Payload docs typing)
     * Docs: https://payloadcms.com/docs/upload/storage-adapters
     */
    s3Storage({
      collections: {
        media: {
          prefix: 'images',
        },
      },
      bucket: process.env.S3_BUCKET!,
      config: {
        region: process.env.S3_REGION!,
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID!,
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
        },
      },
    }),

    ...plugins,
    // storage-adapter-placeholder
  ],

  email: nodemailerAdapter({
    defaultFromName: process.env.EMAIL_FROM_NAME || 'PRiGma IIT JEE Classes',
    defaultFromAddress: process.env.EMAIL_FROM_ADDR || 'no-reply@prigmaiitjee.com',
    transportOptions: {
      host: mustEnv('SMTP_HOST'),
      port: Number(process.env.SMTP_PORT || 587),
      auth: {
        user: mustEnv('SMTP_USER'),
        pass: mustEnv('SMTP_PASS'),
      },
      // secure: true for 465, false for 587
    },
  }),

  secret: mustEnv('PAYLOAD_SECRET'),

  sharp,

  typescript: {
    outputFile: path.resolve(process.cwd(), 'src/payload-types.ts'),
  },

  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        // Allow logged in users
        if (req.user) return true

        // Vercel Cron secret support
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${process.env.CRON_SECRET}`
      },
    },
    tasks: [],
  },
})
