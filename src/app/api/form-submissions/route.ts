import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

type Body = {
  form: string
  submissionData: { field: string; value: string }[]
}

export async function POST(req: Request) {
  const payload = await getPayload({ config: configPromise })

  try {
    const body = (await req.json()) as Body

    if (!body?.form) {
      return NextResponse.json({ message: 'Missing form id' }, { status: 400 })
    }

    if (!Array.isArray(body?.submissionData) || body.submissionData.length === 0) {
      return NextResponse.json({ message: 'Missing submissionData' }, { status: 400 })
    }

    // Create a Form Submission doc in Payload
    const doc = await payload.create({
      collection: 'form-submissions',
      data: {
        form: body.form,
        submissionData: body.submissionData,
      },
      overrideAccess: true,
    })

    // IMPORTANT: your frontend expects data.id
    return NextResponse.json({ id: doc.id }, { status: 201 })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Submit failed'
    return NextResponse.json({ message: msg }, { status: 500 })
  }
}
