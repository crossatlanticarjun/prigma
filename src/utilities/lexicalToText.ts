// src/utilities/lexicalToText.ts

type LexicalNode = {
  text?: string
  children?: LexicalNode[]
}

type LexicalEditorState = {
  root?: LexicalNode
}

function walk(node?: LexicalNode): string[] {
  if (!node) return []
  const out: string[] = []

  if (typeof node.text === 'string') out.push(node.text)

  const children = node.children
  if (Array.isArray(children)) {
    for (const child of children) out.push(...walk(child))
  }

  return out
}

function isLexicalEditorState(value: unknown): value is LexicalEditorState {
  if (!value || typeof value !== 'object') return false
  return 'root' in value
}

export function lexicalToText(value: unknown): string {
  const state = isLexicalEditorState(value) ? value : undefined
  const text = walk(state?.root).join(' ')
  return text.replace(/\s+/g, ' ').trim()
}
