import { useMemo } from 'react'
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
          className="relative inline-flex flex-1 flex-col items-center gap-y-8 rounded-2xl border-2 border-orange bg-sunscreen px-6 pt-16 pb-6"
          key={index}
        >
          <div className="absolute -top-8 flex size-16 flex-col items-center justify-center rounded-full bg-orange text-2xl font-semibold text-white">
            {index + 1}
          </div>
          <div className="size-28 pt-1 pb-0.5 pl-0.5">
            <img className="h-full flex-1" src={item.imgSrc} alt="" />
          </div>
          {/* TODO The t function should be used individually on each key */}
          <p className="w-full text-center text-base/normal text-gray-800">{t(item.textKey)}</p>
        </div>
      )),
    [t],
  )

  return (
    <section id="ticket-buy-diagram" className="my-4 lg:my-0">
      <div className="container mx-auto">
        <Typography type="title" fontWeight="bold" className="mb-8 text-center">
          {t('landing.how-does-it-work')}
        </Typography>
      </div>
      <div className="container mx-auto hidden justify-center md:flex">
        <div className="inline-flex flex-col items-center justify-start gap-y-20 bg-sunscreen pt-12 pb-16">
          <div className="grid max-w-[1216px] grid-cols-2 justify-start gap-8 lg:grid-cols-4">
            {itemsComponents}
          </div>
        </div>
      </div>
      {/* Without overflow-y-clip a ghost scrollbar is displayed. */}
      <MobileCarousel className="overflow-y-clip pt-4 md:hidden">{itemsComponents}</MobileCarousel>
    </section>
  )
}

export default HomepageHowTo
