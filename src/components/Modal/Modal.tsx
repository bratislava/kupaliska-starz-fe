/* eslint-disable react-hooks/exhaustive-deps */
import React, { PropsWithChildren, useEffect, useMemo, useState } from 'react'
import { useElementSize, useLockedBody } from 'usehooks-ts'
import FocusTrap from 'focus-trap-react'
import cx from 'classnames'
import { Portal } from 'react-portal'

import './Modal.css'

const ModalButton = ({
  button,
  onOverflowChange,
}: {
  button: React.ReactNode
  onOverflowChange: (height: number) => void
}) => {
  const [contentRef, { height: contentHeight }] = useElementSize()

  const overflow = useMemo(() => contentHeight / 2, [contentHeight])
  useEffect(() => {
    onOverflowChange(overflow)
  }, [overflow])

  return (
    <div style={{ height: overflow }}>
      <div className="-translate-y-2/4" ref={contentRef}>
        {button}
      </div>
    </div>
  )
}

interface ModalProps {
  open: boolean
  onClose?: () => void
  button?: React.ReactNode
  modalClassName?: string
  closeButton?: boolean
}
const Modal = ({
  open,
  onClose = () => {},
  children,
  button,
  modalClassName,
  closeButton = false,
}: PropsWithChildren<ModalProps>) => {
  useLockedBody(open)
  const [buttonOverflow, setButtonOverflow] = useState<number>()

  return open ? (
    <Portal>
      <FocusTrap>
        <div
          id="modal-backdrop"
          onClick={(event: React.MouseEvent<HTMLDivElement>) => {
            if ((event.target as Element).id === 'modal-backdrop') {
              onClose()
            }
          }}
          className="fixed inset-0 flex flex-col justify-center items-center bg-fontBlack bg-opacity-30 z-50"
        >
          <div className={cx('relative', { 'px-4': closeButton })}>
            <div
              className={cx(
                'relative bg-white rounded-lg shadow-lg overflow-y-auto',
                modalClassName,
              )}
              /* Calculates max height of modal, subtracts the overflow of button and close button. */
              style={{
                maxHeight: `calc(100vh${closeButton ? ' - 16px' : ''}${
                  button && buttonOverflow ? ` - ${buttonOverflow}px` : ''
                })`,
              }}
            >
              {children}
            </div>
            {closeButton && (
              <img
                src="/red-cross-circle.svg"
                alt=""
                className="absolute right-0 top-0 -translate-y-2/4 w-8 h-8 cursor-pointer"
                onClick={() => onClose()}
              />
            )}
          </div>

          {button && (
            <ModalButton button={button} onOverflowChange={setButtonOverflow}></ModalButton>
          )}
        </div>
      </FocusTrap>
    </Portal>
  ) : null
}

export default Modal
