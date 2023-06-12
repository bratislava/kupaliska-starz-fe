import React from 'react'

import { SwimmingPool } from 'models'

import { Typography, Spinner } from 'components'

import './SwimmingPoolInfoCard.css'
import { useTranslation } from 'react-i18next'

interface SwimmingPoolInfoCardProps {
  swimmingPool: SwimmingPool
  className?: string
}

const SwimmingPoolInfoCard = ({ swimmingPool, className = '' }: SwimmingPoolInfoCardProps) => {
  const { t } = useTranslation()

  return (
    <div className={`${className} grid bg-backgroundGray rounded-lg swimming-pool-card__container`}>
      <div className={`sm:rounded-none row-span-1  relative`}>
        <img
          className={`swimming-pool-card__image rounded-t-lg relative`}
          src={swimmingPool.image ? swimmingPool.image.originalFile : '/kupalisko-delfin.png'}
          alt={swimmingPool.image ? swimmingPool.image.altText : t('landing.alt-img-text')}
        />
      </div>
      <div className={'row-span-11 flex-col flex m-6'}>
        <Typography type="subtitle" fontWeight="bold">
          {swimmingPool.name}
        </Typography>
        {swimmingPool.description ? (
          <div className="flex-1">
            <p className="my-4 whitespace-pre-wrap">{swimmingPool.description}</p>
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center text-xl">
            <div className="w-1/10 py-4">
              <Spinner />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SwimmingPoolInfoCard
