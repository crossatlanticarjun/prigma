import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')

  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const payload = await getPayload({ config: configPromise })

  try {
    const form = await payload.findByID({
      collection: 'forms', // change if your collection slug differs
      id,
      depth: 2,
      overrideAccess: true,
    })

    return NextResponse.json(form)
  } catch {
    return NextResponse.json({ error: 'Form not found' }, { status: 404 })
  }
}
