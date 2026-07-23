import { Icon } from 'components'
import { PropsWithChildren, useEffect, useState } from 'react'

interface ToastProps {
  type?: 'success' | 'error' | 'info'
  open: boolean
  text?: string
  onClose?: () => void
  timeToClose?: number
  closeButton?: boolean
}

const Toast = ({
  type = 'success',
  open,
  children,
  text,
  timeToClose,
  onClose,
  closeButton,
}: PropsWithChildren<ToastProps>) => {
  const [_open, _setOpen] = useState<boolean>(open)
  let visualClasses = ''

  useEffect(() => {
    _setOpen(open)
    if (open && timeToClose) {
      setTimeout(() => {
        _setOpen(false)
      }, timeToClose)
    }
  }, [open])

  useEffect(() => {
    if (!_open) {
      onClose && onClose()
    }
  }, [_open])

  if (type === 'success') {
    visualClasses = 'bg-success text-white'
  } else if (type === 'error') {
    visualClasses = 'bg-error text-white'
  } else {
    visualClasses = 'bg-primary text-white'
  }

  return (
    <div
      className={` ${
        _open ? 'top-4' : '-top-full'
      } ${visualClasses} fixed left-0 right-0 z-toast mx-auto flex w-9/10 justify-between rounded-lg p-4 text-center font-bold shadow-xs transition-all duration-500 ease-in-out md:w-1/2 lg:w-3/10`}
    >
      <div className="flex-1">{text ? text : children}</div>
      {closeButton && (
        <button onClick={onClose}>
          <Icon name="close" />
        </button>
      )}
    </div>
  )
}

export default Toast
