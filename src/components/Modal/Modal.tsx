/* eslint-disable react-hooks/exhaustive-deps */
import './Modal.css'

import cx from 'classnames'
import FocusTrap from 'focus-trap-react'
import { MouseEvent, PropsWithChildren, ReactNode, useEffect, useMemo, useState } from 'react'
import { Portal } from 'react-portal'
import { useElementSize, useLockedBody } from 'usehooks-ts'

const ModalButton = ({
  button,
  onOverflowChange,
}: {
  button: ReactNode
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
  button?: ReactNode
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
          onClick={(event: MouseEvent<HTMLDivElement>) => {
            if ((event.target as Element).id === 'modal-backdrop') {
              onClose()
            }
          }}
          className="
            fixed inset-0 z-50 flex flex-col items-center justify-center
            bg-fontBlack bg-opacity-30
          "
        >
          <div className={cx('relative', { 'px-4': closeButton })}>
            <div
              className={cx(
                'relative overflow-y-auto rounded-lg bg-sunscreen shadow-lg',
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
                className="
                  absolute right-0 top-0 h-8 w-8 -translate-y-2/4 cursor-pointer
                "
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
