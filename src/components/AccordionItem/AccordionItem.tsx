import cx from 'classnames'
import { ReactNode, useEffect, useState } from 'react'

import ButtonComponentLibraryWrapper from '@/components/Button/ButtonComponentLibraryWrapper'
import Icon from '@/components/Icon/Icon'

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

// TODO use DisclosureGroup and remove AccordionItem
export const AccordionItem = ({
  initialState = false,
  isOpen,
  title,
  onOpen,
  children,
  className,
  secondaryTitle,
  // TODO only narrow variant is used, remove normal variant
  paddingVariant = 'normal',
}: AccordionItemProps) => {
  const [active, setActive] = useState<boolean>(initialState)

  useEffect(() => {
    if (isOpen !== undefined) {
      setActive(isOpen)
    }
  }, [isOpen])

  const handleClick = () => {
    return onOpen ? onOpen() : setActive(!active)
  }

  return (
    <>
      <ButtonComponentLibraryWrapper
        className={cx(
          `flex items-center justify-between rounded-lg p-4 font-medium md:px-10`,
          {
            'border-2 border-solid border-transparent bg-blueish shadow-lg': active,
            'border-2 border-primary bg-transparent md:hover:bg-blueish md:hover:stroke-current':
              !active,
          },
          className,
        )}
        fullWidth
        onPress={handleClick}
        endIcon={<Icon name="chevron" className={cx('h-3 w-6', { 'rotate-180': active })}></Icon>}
      >
        <div className="flex grow flex-row text-left font-medium">
          {typeof title === 'string' ? <p className="text-md text-left">{title}</p> : <>{title}</>}
          {secondaryTitle && (
            <p className="text-md text-gray-universal-500 text-left">&nbsp;{secondaryTitle}</p>
          )}
        </div>
      </ButtonComponentLibraryWrapper>
      <div
        className={cx('overflow-hidden text-sm', {
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
