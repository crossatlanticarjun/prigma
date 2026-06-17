import React from 'react'
import Image from 'next/image'

type Media = {
  url?: string | null
  alt?: string | null
  width?: number | null
  height?: number | null
}

type Member = {
  photo: Media | string
  tag: string
  name: string
  subtitle?: string | null
  bullets?: { text: string }[] | null
}

type Props = {
  pillText?: string | null
  heading: string
  members: Member[]
}

function isMediaObject(v: unknown): v is Media {
  return typeof v === 'object' && v !== null && 'url' in v
}

export const CoreTeamBlock: React.FC<Props> = ({ pillText, heading, members }) => {
  return (
    <section className="w-full py-12 md:py-16">
      <div className="mx-auto container">
        <div className="flex flex-col items-center text-center">
          <span className="mx-auto inline-flex rounded-full bg-themeBlue px-6 py-2 text-md text-white">
            {pillText ?? 'PRiGma Core Team'}
          </span>

          <h2 className="mt-6 max-w-4xl text-balance text-3xl font-bold leading-tight text-slate-950 md:text-5xl">
            {heading}
          </h2>
        </div>

        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {members?.map((m, i) => {
            const media = isMediaObject(m.photo) ? m.photo : null
            const src = media?.url ?? ''

            return (
              <div key={i} className="">
                {/* Photo card */}
                <div className="relative overflow-hidden rounded-xl bg-themeBlue/5 p-2">
                  <div className="relative aspect-[4/5] w-full">
                    {src ? (
                      <Image
                        src={src}
                        alt={media?.alt ?? m.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-sm text-neutral-500">
                        No photo
                      </div>
                    )}
                  </div>

                  {/* Tag */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
                    <span className="rounded-md bg-themeBlue px-6 py-2 text-sm font-semibold tracking-wide text-white">
                      {m.tag}
                    </span>
                  </div>
                </div>

                {/* Text */}
                <div className="mt-2">
                  <div className="text-md font-semibold text-slate-950">{m.name}</div>
                  {m.subtitle ? (
                    <div className="mt-1 text-sm font-medium text-slate-600">{m.subtitle}</div>
                  ) : null}

                  {m.bullets?.length ? (
                    <ul className="mt-3 space-y-2 text-left text-sm text-slate-600">
                      {m.bullets.map((b, bi) => (
                        <li key={bi} className="flex gap-2">
                          <span className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full bg-themeBlue" />
                          <span>{b.text}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
