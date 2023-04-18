import React from 'react'

import { Typography } from 'components'

interface SectionHeaderProps {
  title: string
  subtitle?: string
  className?: string
}

const SectionHeader = ({ title, subtitle, className = '' }: SectionHeaderProps) => {
  return (
    <div className={`${className}`}>
      <Typography type="title" fontWeight="bold" className={`${!subtitle ? 'mb-8' : ''}`}>
        {title}
      </Typography>
      {subtitle && (
        <Typography type="subtitle" className="mb-8">
          {subtitle}
        </Typography>
      )}
    </div>
  )
}

export default SectionHeader
