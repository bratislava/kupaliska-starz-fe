import './SwimmingPoolInfoCard.css'

import { Spinner, Typography } from 'components'
import { SwimmingPool } from 'models'
import { useTranslation } from 'react-i18next'

interface SwimmingPoolInfoCardProps {
  swimmingPool: SwimmingPool
  className?: string
}

const SwimmingPoolInfoCard = ({ swimmingPool, className = '' }: SwimmingPoolInfoCardProps) => {
  const { t } = useTranslation()

  return (
    <div
      className={` ${className} swimming-pool-card__container grid rounded-lg bg-backgroundGray`}
    >
      <div className={`relative row-span-1 sm:rounded-none`}>
        <img
          className={`swimming-pool-card__image relative rounded-t-lg`}
          src={swimmingPool.image ? swimmingPool.image.originalFile : '/kupalisko-delfin.png'}
          alt={swimmingPool.image ? swimmingPool.image.altText : t('landing.alt-img-text')}
        />
      </div>
      <div className={'row-span-11 m-6 flex flex-col'}>
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
