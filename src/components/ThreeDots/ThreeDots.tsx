import { Dialog, DialogTrigger, Popover } from 'react-aria-components'
import { useTranslation } from 'react-i18next'

import ButtonComponentLibraryWrapper from '@/components/Button/ButtonComponentLibraryWrapper'
import Icon, { IconName } from '@/components/Icon/Icon'
import cn from '@/utils/cn'

interface ThreeDotsProps {
  buttons: {
    title: string
    icon: IconName
    className: string
    onPress: () => void
  }[]
}

const ThreeDots = ({ buttons }: ThreeDotsProps) => {
  const { t } = useTranslation()

  return (
    <DialogTrigger>
      <ButtonComponentLibraryWrapper
        variant="icon-wrapped-negative-margin"
        icon={<Icon name="three-dots" />}
        aria-label={t('three-dots.more')}
      />
      <Popover>
        <Dialog className="inline-flex flex-col items-start overflow-clip rounded-lg bg-sunscreen py-2 drop-shadow-lg">
          {({ close }) => (
            <>
              {buttons.map((button, index) => (
                <ButtonComponentLibraryWrapper
                  key={index}
                  // TODO revisit styles
                  className={cn(`w-full px-5 py-3 hover:bg-gray-100 ${button.className}`)}
                  variant="plain"
                  onPress={() => {
                    close()
                    button.onPress()
                  }}
                  startIcon={<Icon name={button.icon} className="no-fill" />}
                >
                  {button.title}
                </ButtonComponentLibraryWrapper>
              ))}
            </>
          )}
        </Dialog>
      </Popover>
    </DialogTrigger>
  )
}

export default ThreeDots
