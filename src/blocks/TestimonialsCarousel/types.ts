export type TestimonialsCarouselBlockProps = {
  blockType: 'testimonialsCarousel'
  blockName?: string | null
  badge?: string | null
  heading?: string | null
  limit?: number | null
  viewMore?: {
    label?: string | null
    href?: string | null
    newTab?: boolean | null
  } | null
}
