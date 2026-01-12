export type ScriptPropValue = string | boolean | undefined
export type ScriptProps = Record<string, ScriptPropValue>

export function toReactScriptProps(attrs: Record<string, string | boolean>): ScriptProps {
  const props: ScriptProps = {}

  for (const [k, v] of Object.entries(attrs)) {
    const key = k.toLowerCase()

    if (key === 'crossorigin') props.crossOrigin = v === true ? 'anonymous' : String(v)
    else if (key === 'referrerpolicy') props.referrerPolicy = String(v)
    else if (key === 'charset') props.charSet = String(v)
    else if (key.startsWith('data-')) props[k] = v
    else props[k] = v
  }

  return props
}
