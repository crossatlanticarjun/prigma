import React from 'react'
import { MapPin, Mail, Phone, ExternalLink } from 'lucide-react'

type Centre = {
  id?: string | null
  locationTitle: string
  emailPrimary: string
  phone: string
  emailSecondary?: string | null
  googleMapUrl: string
}

type Props = {
  heading: string
  subheading?: string | null
  centres: Centre[]
}

export const StudyCentresBlock: React.FC<Props> = ({ heading, subheading, centres }) => {
  return (
    <section className="w-full py-12 md:py-16 bg-themeBlue/5">
      <div className="mx-auto container">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-2xl md:text-4xl font-semibold tracking-tight text-themeHeading">
            {heading}
          </h2>
          {subheading ? (
            <p className="mt-3 text-sm md:text-base text-themeText/80">{subheading}</p>
          ) : null}
        </div>

        <div className="mt-8 md:mt-10 grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          {centres?.map((c, idx) => (
            <div
              key={c.id ?? `${c.locationTitle}-${idx}`}
              className="rounded-xl bg-white border border-black/5 shadow-sm overflow-hidden"
            >
              <div className="p-5 md:p-6">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-full bg-themeOrange/5 p-4">
                    <MapPin className="h-5 w-5 text-themeOrange" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-base md:text-lg font-semibold text-themeHeading">
                      {c.locationTitle}
                    </h3>
                    <p className="mt-1 text-xs md:text-sm text-themeText/70">
                      Tap below to contact or open the map.
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  <a
                    href={`mailto:${c.emailPrimary}`}
                    className="flex items-center gap-3 rounded-lg border border-black/5 px-4 py-3 hover:bg-black/[0.02] transition"
                  >
                    <Mail className="h-4 w-4 text-themeOrange shrink-0" />
                    <span className="text-sm text-themeHeading truncate">{c.emailPrimary}</span>
                  </a>

                  {c.emailSecondary ? (
                    <a
                      href={`mailto:${c.emailSecondary}`}
                      className="flex items-center gap-3 rounded-lg border border-black/5 px-4 py-3 hover:bg-black/[0.02] transition"
                    >
                      <Mail className="h-4 w-4 text-themeOrange shrink-0" />
                      <span className="text-sm text-themeHeading truncate">{c.emailSecondary}</span>
                    </a>
                  ) : null}

                  <a
                    href={`tel:${c.phone}`}
                    className="flex items-center gap-3 rounded-lg border border-black/5 px-4 py-3 hover:bg-black/[0.02] transition"
                  >
                    <Phone className="h-4 w-4 text-themeOrange shrink-0" />
                    <span className="text-sm text-themeHeading">{c.phone}</span>
                  </a>
                </div>

                <div className="mt-5">
                  <a
                    href={c.googleMapUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-themeBlue text-white px-4 py-3 text-sm font-semibold hover:bg-slate-950 transition"
                  >
                    Open in Google Maps
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>

              <div className="px-5 md:px-6 pb-5 md:pb-6">
                <div className="rounded-lg bg-themeBlue/5 border border-black/5 p-4 text-xs md:text-sm text-themeText/80">
                  Pro tip: Share this centre link with parents for instant directions.
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
