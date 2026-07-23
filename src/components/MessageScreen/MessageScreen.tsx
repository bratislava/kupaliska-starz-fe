import { PropsWithChildren } from 'react'
import { twMerge } from 'tailwind-merge'

import SectionHeader from '../SectionHeader/SectionHeader'

interface MessageScreenProps {
  title: string
  description?: string
  className?: string
}

/**
 * Generic full-height screen for error and empty states.
 * Pass optional actions (e.g. a button/link) as children.
 */
const MessageScreen = ({
  title,
  description,
  className,
  children,
}: PropsWithChildren<MessageScreenProps>) => {
  return (
    <div className={twMerge(`grow ${className}`)}>
      <div className="container mx-auto flex flex-1 flex-col gap-y-8 py-8 xl:py-12">
        <SectionHeader title={title} subtitle={description} />
        {children}
      </div>
    </div>
  )
}

export default MessageScreen
