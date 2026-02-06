export function safeTrim(s: string, max = 160) {
  const t = (s || '').replace(/\s+/g, ' ').trim()
  if (!t) return ''
  return t.length > max ? `${t.slice(0, max - 1).trim()}…` : t
}

type LexicalNode = {
  text?: string
  children?: LexicalNode[]
}

type LexicalEditorState = {
  root?: LexicalNode
}

// Best-effort extraction from Lexical JSON
export function lexicalToPlainText(data: unknown): string {
  try {
    if (!data || typeof data !== 'object') return ''

    const root = (data as LexicalEditorState).root
    if (!root) return ''

    const out: string[] = []

    const walk = (node: LexicalNode | undefined) => {
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
