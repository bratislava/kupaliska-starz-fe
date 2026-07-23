import cx from 'classnames'
import { cloneElement, PropsWithChildren, ReactElement, ReactNode } from 'react'
import { Button, Dialog as AriaDialog, Heading, Modal } from 'react-aria-components'

import { Icon } from '../index'

type DialogProps = {
  title: string
  open: boolean
  onClose?: () => void
  footerButton?: ReactNode
  wrapper?: ReactElement
  className?: string
} & PropsWithChildren<{}>

const Dialog = ({
  title,
  open,
  onClose = () => {},
  footerButton,
  children,
  wrapper = <div />,
  className,
}: DialogProps) => {
  return (
    <Modal
      isDismissable
      isOpen={open}
      onOpenChange={(value) => {
        if (!value) {
          onClose()
        }
      }}
      className={cx('container m-2 px-0', className)}
    >
      {cloneElement(
        wrapper,
        {},
        <AriaDialog className="flex max-h-[calc(70vh-8px)] max-w-[calc(100vw-8px)] flex-col rounded-lg bg-sunscreen">
          <div className="flex flex-row items-center justify-between gap-6 border-b-2 border-b-divider px-6 py-4">
            <Heading className="text-xl font-semibold text-gray-800">{title}</Heading>
            <Button onPress={() => onClose()} aria-label="Zatvoriť">
              <Icon name="close" className="no-fill" />
            </Button>
          </div>
          <div className="overflow-auto p-8">{children}</div>
          {footerButton && (
            <div className="flex flex-col items-end border-t-2 border-t-divider px-6 py-4">
              {footerButton}
            </div>
          )}
        </AriaDialog>,
      )}
    </Modal>
  )
}

export default Dialog
