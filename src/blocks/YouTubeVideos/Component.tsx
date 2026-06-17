import React from 'react'

type VideoItem = {
  videoId: string
  title?: string | null
  type?: 'short' | 'video' | null
  id?: string | null
}

type Props = {
  heading?: string | null
  videos?: VideoItem[] | null
}

export const YouTubeVideosBlock: React.FC<Props> = ({ heading, videos }) => {
  if (!videos?.length) return null

  return (
    <section className="py-10 md:py-14">
      <div className="container mx-auto px-4">
        {heading ? (
          <h2 className="mb-6 text-2xl font-semibold text-slate-900 md:text-3xl text-center">
            {heading}
          </h2>
        ) : null}

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {videos.map((video, index) => {
            const isShort = video.type !== 'video'

            return (
              <div key={video.id || `${video.videoId}-${index}`} className="w-full">
                <div
                  className={[
                    'relative overflow-hidden rounded-2xl bg-black shadow-sm',
                    isShort ? 'aspect-[9/16] w-full' : 'aspect-video w-full',
                  ].join(' ')}
                >
                  <iframe
                    className="absolute inset-0 h-full w-full"
                    src={`https://www.youtube.com/embed/${video.videoId}`}
                    title={video.title || `YouTube video ${index + 1}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>

                {video.title ? (
                  <p className="mt-3 text-lg font-medium text-slate-800">{video.title}</p>
                ) : null}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
