import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { MobileCarousel, Typography } from '../index'

const items = [
  {
    imgSrc: '/ticket-buy-diagram-1.png',
    textKey: 'landing.steps.0',
  },
  {
    imgSrc: '/ticket-buy-diagram-2.png',
    textKey: 'landing.steps.1',
  },
  {
    imgSrc: '/ticket-buy-diagram-3.png',
    textKey: 'landing.steps.2',
  },
  {
    imgSrc: '/ticket-buy-diagram-4.png',
    textKey: 'landing.steps.3',
  },
]

const HomepageHowTo = () => {
  const { t } = useTranslation()

  // Must be like this because MobileCarousel only accepts array of components.
  const itemsComponents = useMemo(
    () =>
      items.map((item, index) => (
        <div
          className="relative inline-flex flex-col gap-y-8 items-center flex-1 px-6 pt-16 pb-6 bg-white border-2 rounded-2xl border-secondary"
          key={index}
        >
          <div className="absolute flex flex-col items-center justify-center bg-secondary rounded-full text-2xl font-semibold text-primary w-16 h-16 -top-8">
            {index + 1}
          </div>
          <div className="w-28 h-28 pl-0.5 pt-1 pb-0.5">
            <img className="flex-1 h-full" src={item.imgSrc} alt="" />
          </div>
          <p className="w-full text-base leading-normal text-center text-gray-800">
            {t(item.textKey)}
          </p>
        </div>
      )),
    [t],
  )

  return (
    <section id="ticket-buy-diagram" className="my-4 lg:my-0">
      <div className="container mx-auto">
        <Typography type="title" fontWeight="bold" className="text-center mb-8">
          {t('landing.how-does-it-work')}
        </Typography>
      </div>
      <div className="hidden md:flex container mx-auto justify-center">
        <div className="inline-flex flex-col gap-y-20 items-center justify-start pt-12 pb-16 bg-white">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 justify-start max-w-[1216px]">
            {itemsComponents}
          </div>
        </div>
      </div>
      {/* Without overflow-y-clip a ghost scrollbar is displayed. */}
      <MobileCarousel className="md:hidden pt-4 overflow-y-clip">{itemsComponents}</MobileCarousel>
    </section>
  )
}

export default HomepageHowTo
