'use client'

import { Send } from 'lucide-react'
import React, { useEffect, useMemo, useState } from 'react'

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

type Props = {
  open: boolean
  onClose: () => void
  formId: string
  heading: string
  subheading: string
  privacyHref: string
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

export function EnquiryPopup({ open, onClose, formId, heading, subheading, privacyHref }: Props) {
  const [form, setForm] = useState<PayloadForm | null>(null)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [values, setValues] = useState<Record<string, unknown>>({})

  // reset on close
  useEffect(() => {
    if (!open) {
      setForm(null)
      setDone(false)
      setError(null)
      setSubmitting(false)
      setValues({})
    }
  }, [open])

  // ESC to close
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  // Fetch form by ID via server proxy route
  useEffect(() => {
    if (!open) return
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
  }, [open, formId])

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

      if (typeof v !== 'string' || v.trim().length === 0) return `${f.label ?? f.name} is required`
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
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Submit failed')
    } finally {
      setSubmitting(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[9999]">
      {/* backdrop */}
      <button
        aria-label="Close enquiry popup"
        onClick={onClose}
        className="absolute inset-0 bg-black/50"
      />

      {/* modal */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-[460px] overflow-hidden rounded-xl bg-themeBlue shadow-2xl">
          <div className="p-4 sm:p-6 text-center text-white">
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="rounded-full bg-white/10 w-8 h-8 text-sm hover:bg-white/20"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <h2 className="text-3xl font-semibold">{heading}</h2>
            <p className="mx-auto mt-3 max-w-[42ch] text-white/90">{subheading}</p>

            <div className="mt-8">
              {loading && <p className="text-white/90">Loading form…</p>}

              {!loading && error && (
                <div className="rounded-lg bg-rose-600 p-3 text-left text-sm text-white mb-3">
                  {error}
                </div>
              )}

              {!loading && done && (
                <div className="rounded-xl bg-white/10 p-5 text-left">
                  <p className="text-lg font-semibold">Request received.</p>
                  <p className="mt-1 text-white/90">We will get back to you shortly.</p>
                  <button
                    onClick={onClose}
                    className="mt-4 rounded-full bg-white px-5 py-2 text-sm font-semibold text-[#0A6D7D]"
                  >
                    Close
                  </button>
                </div>
              )}

              {!loading && !done && form && (
                <form onSubmit={onSubmit} className="space-y-3">
                  {fields.map((f) => {
                    const placeholder = f.label ?? f.name

                    if (f.blockType === 'textarea') {
                      return (
                        <textarea
                          key={f.name}
                          placeholder={placeholder}
                          value={(values[f.name] as string) ?? ''}
                          onChange={(e) => setVal(f.name, e.target.value)}
                          className="w-full rounded-lg bg-white p-3 text-sm text-slate-800 outline-none placeholder:text-slate-600"
                        />
                      )
                    }

                    if (f.blockType === 'checkbox') {
                      return (
                        <label
                          key={f.name}
                          className="flex items-start gap-3 text-left text-sm text-white/95"
                        >
                          <input
                            type="checkbox"
                            checked={(values[f.name] as boolean) ?? false}
                            onChange={(e) => setVal(f.name, e.target.checked)}
                            className="h-8 w-8 mt-0.5 rounded border border-slate-600"
                          />
                          <span>
                            I understand that your personal data will be used in accordance with the{' '}
                            <a className="underline underline-offset-4" href={privacyHref}>
                              Privacy Policy
                            </a>{' '}
                            here*
                          </span>
                        </label>
                      )
                    }

                    const inputType =
                      f.blockType === 'email' ? 'email' : f.blockType === 'number' ? 'tel' : 'text'

                    return (
                      <input
                        key={f.name}
                        type={inputType}
                        placeholder={placeholder}
                        value={(values[f.name] as string) ?? ''}
                        onChange={(e) => setVal(f.name, e.target.value)}
                        className="w-full rounded-lg bg-white p-3 text-sm text-slate-800 outline-none placeholder:text-slate-600"
                      />
                    )
                  })}

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex justify-between md:inline-flex items-center gap-4 rounded-full bg-themeOrange pl-10 pr-2 py-2 text-lg font-semibold text-white shadow-[0_18px_40px_rgba(0,0,0,0.35)] transition hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-white/60 disabled:opacity-60"
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
                <p className="text-white/90">Form not available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
