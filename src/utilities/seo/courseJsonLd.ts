const SITE_NAME = 'PRiGma IIT JEE'

export function courseJsonLd(opts: {
  siteUrl: string
  urlPath: string
  title: string
  description?: string
}) {
  const url = `${opts.siteUrl}${opts.urlPath}`

  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: opts.title,
    description: opts.description || undefined,
    url,
    provider: {
      '@type': 'EducationalOrganization',
      name: SITE_NAME,
      url: opts.siteUrl,
    },
  }
}
