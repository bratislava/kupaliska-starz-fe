import React from 'react'
import { DialogTrigger, Button, Popover, Dialog } from 'react-aria-components'
import { Icon } from '../index'
import { IconName } from '../Icon/Icon'
import cx from 'classnames'

type ThreeDotsProps = {
  buttons: {
    title: string
    icon: IconName
    className: string
    onPress: () => void
  }[]
}

const ThreeDots = ({ buttons }: ThreeDotsProps) => {
  return (
    <DialogTrigger>
      <Button>
        <Icon name="three-dots" className="no-fill" />
      </Button>
      <Popover>
        <Dialog className="py-2 bg-white inline-flex flex-col items-start rounded-lg drop-shadow-lg overflow-clip">
          {({ close }) => (
            <>
              {buttons.map((button, index) => (
                <Button
                  key={index}
                  className={cx(
                    'px-5 bg-white gap-2.5 inline-flex items-center self-stretch text-left hover:bg-gray-100',
                    button.className,
                  )}
                  onPress={() => {
                    close()
                    button.onPress()
                  }}
                >
                  <div className="py-3 flex-1 gap-3 flex items-center flex-grow">
                    <Icon name={button.icon} className="no-fill" />
                    <p className="flex-1 text-base leading-6 m-0">{button.title}</p>
                  </div>
                </Button>
              ))}
            </>
          )}
        </Dialog>
      </Popover>
    </DialogTrigger>
  )
}

export default ThreeDots
