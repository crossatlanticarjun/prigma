import type { Metadata } from 'next'
import Script from 'next/script'
import { cn } from '@/utilities/ui'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import React from 'react'

import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'
import { HeaderScripts } from '@/components/Head/HeaderScripts'
import { getHeaderGlobal } from '@/utilities/getHeaderGlobal'

import { FooterScripts } from '@/components/Head/FooterScripts'
import { getFooterGlobal } from '@/utilities/getFooterGlobal'
import { EnquiryPopupProvider } from '@/components/EnquiryPopup/EnquiryPopupProvider'
import { TopLoader } from '@/components/TopBar'
import ScrollToTop from '@/components/ScrollToTop'

function buildGlobalJsonLd(siteUrl: string) {
  const SITE_NAME = 'PRiGma IIT JEE' // adjust if you want
  const LOGO_URL = `https://bba8wrr2lezn6wxq.public.blob.vercel-storage.com/logo-prigma.png` // ideally use a real logo PNG
  const SAME_AS: string[] = [
    // add socials if you have them
    // 'https://www.instagram.com/yourhandle',
    // 'https://www.youtube.com/@yourchannel',
  ].filter(Boolean)

  const organization = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: SITE_NAME,
    url: siteUrl,
    logo: LOGO_URL,
    sameAs: SAME_AS.length ? SAME_AS : undefined,
  }

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: siteUrl,
  }

  return { organization, website }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const header = await getHeaderGlobal()
  const footer = await getFooterGlobal()

  const ENQ_FORM_ID = process.env.ENQ_FORM_ID
  if (!ENQ_FORM_ID) throw new Error('Missing ENQ_FORM_ID in environment')

  const { isEnabled } = await draftMode()

  const siteUrl = getServerSideURL()
  const { organization, website } = buildGlobalJsonLd(siteUrl)

  return (
    <html className={cn(GeistSans.variable, GeistMono.variable)} lang="en" suppressHydrationWarning>
      <head>
        <InitTheme />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />

        {/* ✅ Global Schema (All Pages) */}
        <Script
          id="schema-org-organization"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
        />
        <Script
          id="schema-org-website"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
        />

        <HeaderScripts header={header} />
        <FooterScripts footer={footer} />
      </head>

      <body>
        <TopLoader />
        <Providers>
          <AdminBar adminBarProps={{ preview: isEnabled }} />

          <EnquiryPopupProvider
            defaultOptions={{
              formId: ENQ_FORM_ID,
              privacyHref: '/privacy-policy',
            }}
          >
            <Header />
            {children}
            <Footer />
          </EnquiryPopupProvider>
        </Providers>
        <ScrollToTop />
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: '@payloadcms',
  },
}
