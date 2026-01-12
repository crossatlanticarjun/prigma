import Link from 'next/link'
import React from 'react'

type Program = {
  title: string
  meta: { label: string; value: string }[]
  featuresHeading?: string | null
  features: { text: string }[]
}

type Props = {
  pillText?: string | null
  heading: string
  programs: Program[]
  bottomNote?: {
    prefix?: string | null
    highlightText: string
    highlightHref: string
    suffix?: string | null
    newTab?: boolean | null
  } | null
}

export const ProgramsBlock: React.FC<Props> = ({ pillText, heading, programs, bottomNote }) => {
  const bn = bottomNote

  return (
    <section className="w-full bg-themeBlue/5 py-12 md:py-16">
      <div className="mx-auto container">
        <div className="text-center max-w-5xl mx-auto">
          <div className="mx-auto inline-flex rounded-full bg-themeBlue px-6 py-2 text-md text-white">
            {pillText ?? 'Our Programs'}
          </div>

          <h2 className="mt-6 text-balance text-3xl font-bold text-slate-950 md:text-5xl">
            {heading}
          </h2>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2">
          {programs?.map((p, i) => (
            <div key={i} className="rounded-xl bg-themeBlue px-6 pb-6 md:px-8 md:pb-8">
              {/* top title pill */}
              <div className="mx-auto w-full rounded-xl bg-white px-6 py-2 text-center text-base font-semibold text-themeBlue md:text-lg border-2 border-themeBlue -translate-y-[20px]">
                {p.title}
              </div>

              {/* meta rows */}
              <div className="space-y-4 text-white">
                {p.meta?.map((row, ri) => (
                  <div key={ri} className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                    <div className="text-sm font-medium md:text-base">{row.label}</div>
                    <div className="text-sm font-bold md:text-base">:</div>
                    <div className="text-sm md:text-base">{row.value}</div>
                  </div>
                ))}
              </div>

              {/* features card */}
              <div className="mt-7 rounded-2xl bg-white p-6 text-slate-950 shadow-sm">
                <div className="mb-3 text-lg font-semibold">
                  {p.featuresHeading ?? 'Course features'}
                </div>

                <ul className="space-y-1 text-sm leading-6 text-slate-600">
                  {p.features?.map((f, fi) => (
                    <li key={fi} className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-themeBlue" />
                      <span>{f.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* bottom note */}
        {bn ? (
          <div className="mt-10 text-center text-sm font-semibold text-slate-950">
            {bn.prefix ?? ''}{' '}
            {/^https?:\/\//i.test(bn.highlightHref) ? (
              <a
                href={bn.highlightHref}
                target={bn.newTab ? '_blank' : undefined}
                rel={bn.newTab ? 'noreferrer noopener' : undefined}
                className="text-themeOrange hover:text-themeBlue transition duration-500"
              >
                {bn.highlightText}
              </a>
            ) : (
              <Link
                href={bn.highlightHref}
                target={bn.newTab ? '_blank' : undefined}
                rel={bn.newTab ? 'noreferrer noopener' : undefined}
                className="text-themeOrange hover:text-themeBlue transition duration-500"
              >
                {bn.highlightText}
              </Link>
            )}
            {bn.suffix ?? ''}
          </div>
        ) : null}
      </div>
    </section>
  )
}
