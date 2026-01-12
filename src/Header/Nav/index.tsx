'use client'

import React from 'react'
import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import clsx from 'clsx'

type Props = {
  data: HeaderType
  variant?: 'desktop' | 'mobileChips'
  onNavigate?: () => void
}

export const HeaderNav: React.FC<Props> = ({ data, variant = 'desktop', onNavigate }) => {
  const navItems = data?.navItems || []
  const isMobile = variant === 'mobileChips'

  return (
    <nav
      className={clsx(!isMobile && 'flex items-center gap-3', isMobile && 'flex flex-col gap-3')}
      onClick={(e) => {
        if (!onNavigate) return
        const target = e.target as HTMLElement | null
        if (!target) return

        // close only when clicking a link inside nav
        const anchor = target.closest('a')
        if (anchor) onNavigate()
      }}
    >
      {navItems.map(({ link }, i) => {
        return (
          <CMSLink
            key={i}
            {...link}
            appearance="link"
            className={clsx(
              !isMobile &&
                `
                px-3
                text-md
                text-slate-800
                no-underline hover:no-underline
                hover:text-themeOrange
                transition duration-300
                flex-shrink-0
              `,
              isMobile &&
                `
                px-2 py-3
                text-md font-medium
                text-slate-800
                transition
              `,
            )}
          />
        )
      })}
    </nav>
  )
}
