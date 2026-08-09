// cn helper function inspired by https://ui.shadcn.com/docs/installation/manual
import { type ClassValue, clsx } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

/**
 * Inspired by https://github.com/bratislava/konto.bratislava.sk/blob/649ce9a5c85576dc7ca77fbbd745e3029ace5d3e/next/src/utils/cn.ts
 */

const baTwMerge = extendTailwindMerge({
  extend: {
    // Add custom theme values
    theme: {
      // Custom breakpoints
      breakpoint: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],

      // Custom shadows
      shadow: ['lg', 'default', 'xs'],
    },
  },
})

const cn = (...args: ClassValue[]) => {
  return baTwMerge(clsx(args))
}

export default cn
