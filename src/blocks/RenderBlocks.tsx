import React, { Fragment } from 'react'
import type { Page } from '@/payload-types'

import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { HeroBanner } from '@/blocks/HeroBanner/Component'
import { PrigmaHeroBlock } from '@/blocks/PrigmaHero/Component'
import { CoreValuesBlock } from '@/blocks/CoreValues/Component'
import { CoreTeamBlock } from '@/blocks/CoreTeam/Component'
import { ProgramsBlock } from '@/blocks/Programs/Component'
import { TestimonialsCarouselBlock } from '@/blocks/TestimonialsCarousel/Component'
import { TestimonialsListBlock } from '@/blocks/TestimonialsList/Component'
import { PageHeaderBlock } from '@/blocks/PageHeader/Component'
import { StudentsShowcaseBlock } from '@/blocks/StudentsShowcase/Component'
import { StudyCentresBlock } from '@/blocks/StudyCentres/Component'

type LayoutBlock = NonNullable<Page['layout']>[number]
type BlockRenderer = React.ComponentType<{ block: LayoutBlock }>

function asSpreadProps<TProps extends object>(Comp: React.ComponentType<TProps>): BlockRenderer {
  const Wrapped: BlockRenderer = ({ block }) => <Comp {...(block as unknown as TProps)} />
  return Wrapped
}

const blockMap: Record<string, BlockRenderer> = {
  archive: asSpreadProps(ArchiveBlock),
  content: asSpreadProps(ContentBlock),
  cta: asSpreadProps(CallToActionBlock),
  formBlock: asSpreadProps(FormBlock),
  mediaBlock: asSpreadProps(MediaBlock),
  heroBanner: asSpreadProps(HeroBanner),
  prigmaHero: asSpreadProps(PrigmaHeroBlock),
  coreValues: asSpreadProps(CoreValuesBlock),
  coreTeam: asSpreadProps(CoreTeamBlock),
  programs: asSpreadProps(ProgramsBlock),
  pageHeader: asSpreadProps(PageHeaderBlock),
  testimonialsList: asSpreadProps(TestimonialsListBlock),
  studentsShowcase: asSpreadProps(StudentsShowcaseBlock),
  studyCentres: asSpreadProps(StudyCentresBlock),

  // This one already expects { block }
  testimonialsCarousel: TestimonialsCarouselBlock as unknown as BlockRenderer,
}

export const RenderBlocks: React.FC<{ blocks: LayoutBlock[] }> = ({ blocks: layout }) => {
  if (!Array.isArray(layout) || layout.length === 0) return null

  return (
    <Fragment>
      {layout.map((block, i) => {
        const Block = blockMap[block.blockType]
        if (!Block) return null

        return (
          <div key={(block as { id?: string | null }).id ?? `${block.blockType}-${i}`}>
            <Block block={block} />
          </div>
        )
      })}
    </Fragment>
  )
}
