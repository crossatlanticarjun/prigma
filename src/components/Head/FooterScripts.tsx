import React from 'react'
import type { Footer } from '@/payload-types'
import { toReactScriptProps } from '@/utilities/scriptProps'

type Props = { footer?: Footer | null }

type ParsedScript = {
  attrs: Record<string, string | boolean>
  content: string
}

function parseScripts(raw: string): ParsedScript[] {
  const out: ParsedScript[] = []
  const re = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi

  let match: RegExpExecArray | null
  while ((match = re.exec(raw)) !== null) {
    const attrString = match[1] ?? ''
    const content = match[2] ?? ''

    const attrs: Record<string, string | boolean> = {}
    const attrRe = /([^\s=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g

    let a: RegExpExecArray | null
    while ((a = attrRe.exec(attrString)) !== null) {
      const key = a[1]
      const val = a[2] ?? a[3] ?? a[4]
      if (!key) continue
      attrs[key] = val == null ? true : val
    }

    out.push({ attrs, content })
  }

  return out
}

export function FooterScripts({ footer }: Props) {
  const raw = footer?.footerScripts

  if (!raw || typeof raw !== 'string' || !raw.trim()) return null

  const scripts = parseScripts(raw)

  if (scripts.length === 0) {
    return <script dangerouslySetInnerHTML={{ __html: raw }} />
  }

  return (
    <>
      {scripts.map((s, i) => {
        const props = toReactScriptProps(s.attrs)

        if (s.content && s.content.trim()) {
          return (
            <script
              key={`ftr-script-${i}`}
              {...props}
              dangerouslySetInnerHTML={{ __html: s.content }}
            />
          )
        }

        return <script key={`ftr-script-${i}`} {...props} />
      })}
    </>
  )
}
