import React from 'react'
import { InlineEnquiryForm } from '@/components/EnquiryPopup/InlineEnquiryForm'

type Item = {
  point?: string | null
  line?: string | null
  id?: string | null
}

type ScholarshipBatchFormBlockProps = {
  block?: {
    sectionId?: string | null

    scholarshipTitle?: string | null
    scholarshipPoints?: Item[] | null

    batchTitle?: string | null
    batchLines?: Item[] | null
  }
}

export const ScholarshipBatchFormBlockComponent: React.FC<ScholarshipBatchFormBlockProps> = ({
  block,
}) => {
  if (!block) return null

  const { sectionId, scholarshipTitle, scholarshipPoints, batchTitle, batchLines } = block

  return (
    <section id={sectionId || undefined} className="w-full bg-themeBlue/5 py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
          {/* Left side */}
          <div className="space-y-5">
            {/* Scholarship */}
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="rounded-tr-xl bg-themeBlue px-6 py-5">
                <h2 className="text-xl font-bold leading-tight text-white md:text-2xl">
                  {scholarshipTitle || 'Scholarship Test & Faculty Interaction'}
                </h2>
              </div>

              <div className="px-6 py-5">
                <ul className="space-y-3">
                  {scholarshipPoints?.map((item, index) => (
                    <li
                      key={item?.id || `scholarship-point-${index}`}
                      className="flex gap-3 text-base font-medium text-slate-800 md:text-lg"
                    >
                      <span className="mt-[9px] h-2 w-2 shrink-0 rounded-full bg-themeBlue" />
                      <span>{item?.point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* New Batch */}
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="rounded-tr-xl bg-themeOrange px-6 py-5">
                <h2 className="text-xl font-bold leading-tight text-white md:text-2xl">
                  {batchTitle || 'New Batch Commencement'}
                </h2>
              </div>

              <div className="px-6 py-5">
                <ul className="space-y-3">
                  {batchLines?.map((item, index) => (
                    <li
                      key={item?.id || `batch-line-${index}`}
                      className="flex gap-3 text-base font-medium text-slate-800 md:text-lg"
                    >
                      <span className="mt-[9px] h-2 w-2 shrink-0 rounded-full bg-themeBlue" />
                      <span>{item?.line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Right side form area */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:p-7">
            <InlineEnquiryForm />
          </div>
        </div>
      </div>
    </section>
  )
}
