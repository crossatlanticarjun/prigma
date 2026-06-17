'use client'

import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { EnquiryPopup } from './EnquiryPopup'

type OpenOptions = {
  formId?: string
  heading?: string
  subheading?: string
  privacyHref?: string
}

type ProviderDefaults = {
  formId: string
  heading?: string
  subheading?: string
  privacyHref?: string
}

type Ctx = {
  open: (opts?: OpenOptions) => void
  close: () => void
  formId: string
  heading: string
  subheading: string
  privacyHref: string
}

const EnquiryPopupContext = createContext<Ctx | null>(null)

export function EnquiryPopupProvider({
  children,
  defaultOptions,
}: {
  children: React.ReactNode
  defaultOptions: ProviderDefaults
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [opts, setOpts] = useState<OpenOptions>({})

  const open = useCallback((next?: OpenOptions) => {
    setOpts(next ?? {})
    setIsOpen(true)
  }, [])

  const close = useCallback(() => setIsOpen(false), [])

  const formId = opts.formId ?? defaultOptions.formId
  const heading = opts.heading ?? defaultOptions.heading ?? 'Enquire Today!'
  const subheading =
    opts.subheading ??
    defaultOptions.subheading ??
    'Ready to take the next step? Reach out now to discuss admissions, programs, or any questions.'
  const privacyHref = opts.privacyHref ?? defaultOptions.privacyHref ?? '/privacy-policy'

  const value = useMemo<Ctx>(
    () => ({
      open,
      close,
      formId,
      heading,
      subheading,
      privacyHref,
    }),
    [open, close, formId, heading, subheading, privacyHref],
  )

  return (
    <EnquiryPopupContext.Provider value={value}>
      {children}

      <EnquiryPopup
        open={isOpen}
        onClose={close}
        formId={formId}
        heading={heading}
        subheading={subheading}
        privacyHref={privacyHref}
      />
    </EnquiryPopupContext.Provider>
  )
}

export function useEnquiryPopup() {
  const ctx = useContext(EnquiryPopupContext)
  if (!ctx) throw new Error('useEnquiryPopup must be used inside EnquiryPopupProvider')
  return ctx
}
