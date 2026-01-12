import React from 'react'
import Image from 'next/image'

type Media = {
  url?: string | null
  alt?: string | null
  width?: number | null
  height?: number | null
}

type ValueItem = {
  icon: Media | string
  title: string
  description: string
}

type Props = {
  heading: string
  values: ValueItem[]
}

function isMediaObject(v: unknown): v is Media {
  return typeof v === 'object' && v !== null && 'url' in v
}

export const CoreValuesBlock: React.FC<Props> = ({ heading, values }) => {
  return (
    <section className="w-full bg-themeBlue/5 py-12 md:py-16">
      <div className="mx-auto container px-4">
        <h2 className="mb-8 text-center text-3xl font-extrabold text-slate-950 md:mb-10 md:text-5xl">
          {heading}
        </h2>

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {values?.map((item, i) => {
            const iconMedia = isMediaObject(item.icon) ? item.icon : null
            const src = iconMedia?.url ?? ''

            return (
              <div key={i} className="rounded-xl bg-themeBlue/5 p-6 text-center shadow-sm md:p-7">
                <div className="mx-auto mb-5 flex h-32 w-32 items-center justify-center rounded-full bg-themeOrange">
                  {src ? (
                    <Image
                      src={src}
                      alt={iconMedia?.alt ?? item.title}
                      width={72}
                      height={72}
                      className="h-20 w-20 object-contain"
                    />
                  ) : (
                    <span className="text-xs text-white">Icon</span>
                  )}
                </div>

                <h3 className="text-xl font-semibold text-slate-950">{item.title}</h3>
                <p className="mt-2 text-md leading-6 text-slate-600">{item.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
