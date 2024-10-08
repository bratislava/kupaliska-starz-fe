import React, { cloneElement, PropsWithChildren, ReactElement, ReactNode } from 'react'
import { Button, Dialog as AriaDialog, Heading, Modal } from 'react-aria-components'

import { Icon } from '../index'
import cx from 'classnames'

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
      className={cx('container px-0 m-2', className)}
    >
      {cloneElement(
        wrapper,
        {},
        <AriaDialog className="bg-sunscreen rounded-lg flex flex-col max-h-[calc(70vh-8px)] max-w-[calc(100vw-8px)]">
          <div className="flex flex-row items-center justify-between gap-6 px-6 py-4 border-b-2 border-b-divider">
            <Heading className="text-gray-800 text-xl font-semibold">{title}</Heading>
            <Button onPress={() => onClose()} aria-label="Zatvoriť">
              <Icon name="close" className="no-fill" />
            </Button>
          </div>
          <div className="p-8 overflow-auto">{children}</div>
          {footerButton && (
            <div className="flex flex-col items-end px-6 py-4 border-t-2 border-t-divider">
              {footerButton}
            </div>
          )}
        </AriaDialog>,
      )}
    </Modal>
  )
}

export default Dialog
