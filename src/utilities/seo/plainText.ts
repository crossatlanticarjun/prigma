export function safeTrim(s: string, max = 160) {
  const t = (s || '').replace(/\s+/g, ' ').trim()
  if (!t) return ''
  return t.length > max ? `${t.slice(0, max - 1).trim()}…` : t
}

// Best-effort extraction from Lexical JSON
export function lexicalToPlainText(data: unknown): string {
  try {
    if (!data || typeof data !== 'object') return ''
    // Lexical payload usually has { root: { children: [...] } }
    const root = (data as any).root
    const out: string[] = []

    const walk = (node: any) => {
      if (!node) return
      if (typeof node.text === 'string') out.push(node.text)
      if (Array.isArray(node.children)) node.children.forEach(walk)
    }

    walk(root)
    return out.join(' ').replace(/\s+/g, ' ').trim()
  } catch {
    return ''
  }
}
