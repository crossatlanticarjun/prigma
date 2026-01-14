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
  formId: string // REQUIRED
  heading?: string
  subheading?: string
  privacyHref?: string
}

type Ctx = {
  open: (opts?: OpenOptions) => void
  close: () => void
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

  const value = useMemo(() => ({ open, close }), [open, close])

  const formId = opts.formId ?? defaultOptions.formId

  return (
    <EnquiryPopupContext.Provider value={value}>
      {children}

      <EnquiryPopup
        open={isOpen}
        onClose={close}
        formId={formId}
        heading={opts.heading ?? defaultOptions.heading ?? 'Enquire Today!'}
        subheading={
          opts.subheading ??
          defaultOptions.subheading ??
          'Ready to take the next step? Reach out now to discuss admissions, programs, or any questions.'
        }
        privacyHref={opts.privacyHref ?? defaultOptions.privacyHref ?? '/privacy-policy'}
      />
    </EnquiryPopupContext.Provider>
  )
}

export function useEnquiryPopup() {
  const ctx = useContext(EnquiryPopupContext)
  if (!ctx) throw new Error('useEnquiryPopup must be used inside EnquiryPopupProvider')
  return ctx
}
