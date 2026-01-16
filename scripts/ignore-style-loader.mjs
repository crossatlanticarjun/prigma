const STYLE_RE = /\.(css|scss|sass|less)(\?.*)?$/i

export async function resolve(specifier, context, nextResolve) {
  if (STYLE_RE.test(specifier)) {
    return { url: new URL(specifier, context.parentURL).href, shortCircuit: true }
  }
  return nextResolve(specifier, context)
}

export async function load(url, context, nextLoad) {
  if (STYLE_RE.test(url)) {
    return { format: 'module', source: 'export default ""', shortCircuit: true }
  }
  return nextLoad(url, context)
}
