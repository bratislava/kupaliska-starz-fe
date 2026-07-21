import cx from 'classnames'
import { Button, Dialog, DialogTrigger, Popover } from 'react-aria-components'

import { IconName } from '../Icon/Icon'
import { Icon } from '../index'

interface ThreeDotsProps {
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
        <Dialog className="
          inline-flex flex-col items-start overflow-clip rounded-lg bg-sunscreen
          py-2 drop-shadow-lg
        ">
          {({ close }) => (
            <>
              {buttons.map((button, index) => (
                <Button
                  key={index}
                  className={cx(
                    `
                      inline-flex items-center gap-2.5 self-stretch bg-sunscreen
                      px-5 text-left
                      hover:bg-gray-100
                    `,
                    button.className,
                  )}
                  onPress={() => {
                    close()
                    button.onPress()
                  }}
                >
                  <div className="flex flex-1 flex-grow items-center gap-3 py-3">
                    <Icon name={button.icon} className="no-fill" />
                    <p className="m-0 flex-1 text-base leading-6">{button.title}</p>
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
