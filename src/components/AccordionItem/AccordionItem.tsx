import React from 'react'
import cx from 'classnames'
import { Icon } from '../index'

// copied from https://github.com/bratislava/bratislava-monorepo/blob/master/libs/ui/bratislava/src/components/AccordionItem/AccordionItem.tsx

export interface AccordionItemProps {
  className?: string
  title: string | React.ReactNode
  secondaryTitle?: string
  initialState?: boolean
  isOpen?: boolean
  onOpen?: () => void
  children?: React.ReactNode
  paddingVariant?: 'normal' | 'narrow'
}

export const AccordionItem = ({
  initialState = false,
  isOpen,
  title,
  onOpen,
  children,
  className,
  secondaryTitle,
  paddingVariant = 'normal',
}: AccordionItemProps) => {
  const [active, setActive] = React.useState<boolean>(initialState)

  React.useEffect(() => {
    if (isOpen !== undefined) setActive(isOpen)
  }, [isOpen])

  const handleClick = () => {
    return onOpen ? onOpen() : setActive(!active)
  }

  return (
    <>
      <div
        className={cx(
          'rounded-lg py-4 px-4 md:px-10',
          {
            'border-transparent border-2 border-solid shadow-lg bg-blueish': active,
            'md:hover:bg-blueish md:hover:stroke-current border-2 border-primary bg-transparent':
              !active,
          },
          className,
        )}
      >
        <button
          className={cx('flex items-center cursor-pointer justify-between w-full font-medium')}
          onClick={handleClick}
        >
          <div className="flex flex-row font-medium grow text-left">
            {typeof title === 'string' ? (
              <p className="text-font text-md text-left">{title}</p>
            ) : (
              <>{title}</>
            )}
            {secondaryTitle && (
              <p className="text-md text-left text-gray-universal-500 ">&nbsp;{secondaryTitle}</p>
            )}
          </div>
          <div className="ml-5 grow-0">
            <Icon name="chevron" className={cx('w-6 h-3', { 'rotate-180': active })}></Icon>
          </div>
        </button>
      </div>
      <div
        className={cx('overflow-hidden text-fontBlack text-sm', {
          'h-auto': active,
          'h-0': !active,
          'p-6': active && paddingVariant === 'narrow',
          'py-14': active && paddingVariant === 'normal',
        })}
      >
        {children}
      </div>
    </>
  )
}

export default AccordionItem
