import cx from 'classnames'
import { ReactNode, useEffect, useState } from 'react'
import { Button as AriaButton } from 'react-aria-components'

import { Icon } from '../index'

// copied from https://github.com/bratislava/bratislava-monorepo/blob/master/libs/ui/bratislava/src/components/AccordionItem/AccordionItem.tsx

export interface AccordionItemProps {
  className?: string
  title: string | ReactNode
  secondaryTitle?: string
  initialState?: boolean
  isOpen?: boolean
  onOpen?: () => void
  children?: ReactNode
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
  const [active, setActive] = useState<boolean>(initialState)

  useEffect(() => {
    if (isOpen !== undefined) {setActive(isOpen)}
  }, [isOpen])

  const handleClick = () => {
    return onOpen ? onOpen() : setActive(!active)
  }

  return (
    <>
      <AriaButton
        className={cx(
          `
            flex w-full items-center justify-between rounded-lg px-4 py-4
            font-medium
            md:px-10
          `,
          {
            'border-2 border-solid border-transparent bg-blueish shadow-lg': active,
            'border-2 border-primary bg-transparent md:hover:bg-blueish md:hover:stroke-current':
              !active,
          },
          className,
        )}
        onPress={handleClick}
      >
        <div className="flex grow flex-row text-left font-medium">
          {typeof title === 'string' ? (
            <p className="text-font text-md text-left">{title}</p>
          ) : (
            <>{title}</>
          )}
          {secondaryTitle && (
            <p className="text-md text-gray-universal-500 text-left">&nbsp;{secondaryTitle}</p>
          )}
        </div>
        <div className="ml-5 grow-0">
          <Icon name="chevron" className={cx('h-3 w-6', { 'rotate-180': active })}></Icon>
        </div>
      </AriaButton>
      <div
        className={cx('overflow-hidden text-sm text-fontBlack', {
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
