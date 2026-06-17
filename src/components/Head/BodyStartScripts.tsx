import React from 'react'

export function BodyStartScripts({ html }: { html?: string | null }) {
  if (!html) return null

  return (
    <div
      // Intentionally injecting admin-provided HTML.
      // Keep this field locked to trusted admins only.
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
