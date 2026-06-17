'use client'

import { Send } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useMemo, useState } from 'react'
import { useEnquiryPopup } from '@/components/EnquiryPopup/EnquiryPopupProvider'

type Field =
  | { name: string; label?: string; required?: boolean; blockType: 'text' }
  | { name: string; label?: string; required?: boolean; blockType: 'email' }
  | { name: string; label?: string; required?: boolean; blockType: 'textarea' }
  | { name: string; label?: string; required?: boolean; blockType: 'checkbox' }
  | { name: string; label?: string; required?: boolean; blockType: 'number' }

type PayloadForm = {
  id: string
  title?: string
  fields?: Field[]
}

type SubmitSuccess = { id: string }
type SubmitError = { message?: string; errors?: { message?: string }[] }
type SubmitResponse = SubmitSuccess | SubmitError | null

function isSubmitSuccess(v: unknown): v is SubmitSuccess {
  return (
    typeof v === 'object' &&
    v !== null &&
    'id' in v &&
    typeof (v as Record<string, unknown>).id === 'string'
  )
}

function getErrorMessage(v: unknown): string | null {
  if (typeof v !== 'object' || v === null) return null
  const obj = v as Record<string, unknown>

  const errors = obj.errors
  if (Array.isArray(errors) && errors.length > 0) {
    const first = errors[0]
    if (typeof first === 'object' && first !== null) {
      const em = (first as Record<string, unknown>).message
      if (typeof em === 'string' && em.trim()) return em
    }
  }

  const message = obj.message
  return typeof message === 'string' && message.trim() ? message : null
}

type Props = {
  className?: string
  titleClassName?: string
  descriptionClassName?: string
}

export function InlineEnquiryForm({
  className = '',
  titleClassName = '',
  descriptionClassName = '',
}: Props) {
  const { formId, heading, subheading, privacyHref } = useEnquiryPopup()

  const [form, setForm] = useState<PayloadForm | null>(null)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [values, setValues] = useState<Record<string, unknown>>({})

  useEffect(() => {
    if (!formId) {
      setError('Missing form id')
      setForm(null)
      return
    }

    let cancelled = false

    ;(async () => {
      setLoading(true)
      setError(null)

      try {
        const res = await fetch(`/api/enquiry-form?id=${encodeURIComponent(formId)}`, {
          cache: 'no-store',
        })

        if (!res.ok) {
          const txt = await res.text().catch(() => '')
          throw new Error(txt || `Failed to load form (${res.status})`)
        }

        const f = (await res.json()) as PayloadForm
        if (!f?.id) throw new Error('Form not found')

        if (!cancelled) setForm(f)
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : 'Something went wrong'
        if (!cancelled) setError(msg)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [formId])

  const fields = useMemo(() => (form?.fields ?? []).filter(Boolean), [form])

  const setVal = (name: string, v: unknown) => setValues((prev) => ({ ...prev, [name]: v }))

  const validate = (): string | null => {
    for (const f of fields) {
      if (!f?.required) continue
      const v = values[f.name]

      if (f.blockType === 'checkbox') {
        if (v !== true) return `${f.label ?? f.name} is required`
        continue
      }

      if (f.blockType === 'number') {
        const s = typeof v === 'string' ? v.trim() : String(v ?? '').trim()
        if (!s) return `${f.label ?? f.name} is required`
        if (!/^\d+$/.test(s)) return `${f.label ?? f.name} must be a valid number`
        continue
      }

      if (typeof v !== 'string' || v.trim().length === 0) {
        return `${f.label ?? f.name} is required`
      }
    }
    return null
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formId) {
      setError('Missing form id')
      return
    }

    const vErr = validate()
    if (vErr) {
      setError(vErr)
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const submissionData = fields.map((f) => {
        const raw = values[f.name]
        const value =
          typeof raw === 'string'
            ? raw
            : typeof raw === 'boolean'
              ? raw
                ? 'true'
                : 'false'
              : raw == null
                ? ''
                : String(raw)

        return { field: f.name, value }
      })

      const res = await fetch('/api/form-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ form: formId, submissionData }),
      })

      const data: SubmitResponse = await res.json().catch(() => null)

      if (!res.ok) {
        const msg = getErrorMessage(data) || `Submit failed (${res.status})`
        throw new Error(msg)
      }

      if (!isSubmitSuccess(data)) {
        throw new Error('Submission saved but response did not include an id')
      }

      setDone(true)
      setValues({})
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Submit failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={` ${className}`}>
      <div className="max-w-[92%]">
        <h3
          className={`text-xl font-bold leading-[1.05] tracking-[-0.02em] text-slate-800 md:text-3xl ${titleClassName}`}
        >
          {heading}
        </h3>

        <p className={`my-4 text-md leading-[1.55] text-slate-600 ${descriptionClassName}`}>
          {subheading}
        </p>
      </div>

      <div className="">
        {loading && <p className="text-[#334a70]">Loading form…</p>}

        {!loading && error && (
          <div className="mb-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error}</div>
        )}

        {!loading && done && (
          <div className="rounded-xl bg-[#f8fbff] p-5 text-left">
            <p className="text-lg font-semibold text-[#081b44]">Request received.</p>
            <p className="mt-1 text-[#334a70]">We will get back to you shortly.</p>
          </div>
        )}

        {!loading && !done && form && (
          <form onSubmit={onSubmit} className="space-y-4 scholarship-batch-form__form">
            {fields.map((f) => {
              const placeholder = f.label ?? f.name

              if (f.blockType === 'textarea') {
                return (
                  <div key={f.name}>
                    <textarea
                      placeholder={placeholder}
                      value={(values[f.name] as string) ?? ''}
                      onChange={(e) => setVal(f.name, e.target.value)}
                      className="w-full rounded-lg border border-slate-300 bg-white p-2 text-sm text-slate-800 outline-none placeholder:text-slate-500"
                    />
                  </div>
                )
              }

              if (f.blockType === 'checkbox') {
                return (
                  <label
                    key={f.name}
                    className="flex items-start gap-3 text-left text-sm text-[#334a70]"
                  >
                    <input
                      type="checkbox"
                      checked={(values[f.name] as boolean) ?? false}
                      onChange={(e) => setVal(f.name, e.target.checked)}
                      className="mt-1 h-5 w-5 rounded border border-slate-300"
                    />
                    <span>
                      I hereby authorize to send notifications on
                      SMS/Messages/Promotional/Informational messages I understand that your*
                    </span>
                  </label>
                )
              }

              const inputType =
                f.blockType === 'email' ? 'email' : f.blockType === 'number' ? 'tel' : 'text'

              return (
                <div key={f.name}>
                  <input
                    type={inputType}
                    placeholder={placeholder}
                    value={(values[f.name] as string) ?? ''}
                    onChange={(e) => setVal(f.name, e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white p-2 text-sm text-slate-800 outline-none placeholder:text-slate-500"
                  />
                </div>
              )
            })}

            <p className="text-sm leading-relaxed text-[#334a70]">
              By clicking Submit, you agree to our{' '}
              <Link className="underline underline-offset-4" href="/terms-and-conditions">
                Terms of Services
              </Link>{' '}
              and that you have read our{' '}
              <Link className="underline underline-offset-4" href={privacyHref}>
                Privacy Policy
              </Link>
            </p>

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-4 rounded-full bg-themeOrange pl-8 pr-2 py-2 text-lg font-semibold text-white shadow-[0_18px_40px_rgba(0,0,0,0.18)] transition hover:brightness-95 disabled:opacity-60"
              >
                {submitting ? 'Submitting…' : 'Submit Request'}
                <span className="grid h-12 w-12 place-items-center rounded-full bg-white text-xl">
                  <Send className="text-themeOrange" />
                </span>
              </button>
            </div>
          </form>
        )}

        {!loading && !done && !form && !error && (
          <p className="text-[#334a70]">Form not available.</p>
        )}
      </div>
    </div>
  )
}
