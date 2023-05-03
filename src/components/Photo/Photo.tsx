import React, { HTMLAttributes } from 'react'
import cx from 'classnames'

type PhotoProps = {
  photo?: string | null
  size: 'normal' | 'small'
  className?: string
  error?: boolean
} & HTMLAttributes<HTMLDivElement>

const Photo = ({ photo, size, className, error = false }: PhotoProps) => {
  return (
    <div
      className={cx(
        'rounded-lg bg-backgroundGray bg-cover bg-center',
        {
          'w-[132px] h-[156px] [box-shadow-width:2px]': size === 'normal',
          '[box-shadow:0px_0px_0px_2px_rgba(214,_214,_214,_1)_inset]': size === 'normal' && !error,
          '[box-shadow:0px_0px_0px_2px_rgba(220,_38,_38,_1)_inset]': size === 'normal' && error,
          'w-[48px] h-[56px]': size === 'small',
        },
        className,
      )}
      style={{
        backgroundImage: photo ? `url(${photo})` : undefined,
      }}
    ></div>
  )
}

export default Photo
