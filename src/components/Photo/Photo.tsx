import cx from 'classnames'
import { HTMLAttributes } from 'react'

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
          'h-[156px] w-[132px] [box-shadow-width:2px]': size === 'normal',
          '[box-shadow:0px_0px_0px_2px_rgba(214,_214,_214,_1)_inset]': size === 'normal' && !error,
          '[box-shadow:0px_0px_0px_2px_rgba(220,_38,_38,_1)_inset]': size === 'normal' && error,
          'h-[56px] w-[48px]': size === 'small',
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
