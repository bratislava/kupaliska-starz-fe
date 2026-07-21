import { PropsWithChildren } from 'react'

import SectionHeader from '../SectionHeader/SectionHeader'
import Typography from '../Typography/Typography'

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
  className = '',
  children,
}: PropsWithChildren<MessageScreenProps>) => {
  return (
    <div className={`grow ${className}`}>
      <div className="container mx-auto flex flex-col flex-1 py-8 xl:py-12">
        <SectionHeader title={title} />
        {description && (
          <Typography type="subtitle" className="mb-8">
            {description}
          </Typography>
        )}
        {children && <div className="mt-4 md:mt-8">{children}</div>}
      </div>
    </div>
  )
}

export default MessageScreen
