import React, { useState } from 'react'
import { assignItemsToColumns } from 'helpers/general'
import { useAppSelector, useWindowSize } from 'hooks'
import { selectPools } from 'store/global'
import SwimmingPoolInfoCard from 'components/SwimmingPoolInfoCard/SwimmingPoolInfoCard'
import { Button, Icon } from 'components'
import { useTranslation } from 'react-i18next'

// reverted from https://github.com/bratislava/kupaliska-starz-fe/commit/a6935e20afb87fe0680affce148231dd7f1be0d2#diff-a788a2a4f1c90412bf2f1124cfc6b173dfce6821fb228ef865930f8b7a77afa5
const SwimmingPoolsInfo = () => {
  const [allSwimmingPools, setAllSwimmingPools] = useState<boolean>(false)
  const { width } = useWindowSize()
  const swimmingPools = useAppSelector(selectPools)
  const { t } = useTranslation()

  const getNumberOfSwimmingPoolCols = () => {
    if (width) {
      if (width >= 1024) {
        return 3
      }
      if (width >= 768) {
        return 2
      }
    }

    return 1
  }

  return (
    <div className="py-16 container mx-auto">
      <h2 className="text-center font-bold text-fontBlack mb-8 text-2xl xs:text-3xl 2xl:text-4xl">
        {t('landing.assumed-opening')}
      </h2>
      <div className="md:grid md:gap-x-16 md:grid-cols-2 lg:gap-x-32 lg:grid-cols-3 auto-rows-fr pb-8">
        {(allSwimmingPools
          ? assignItemsToColumns(getNumberOfSwimmingPoolCols(), swimmingPools)
          : assignItemsToColumns(
              getNumberOfSwimmingPoolCols(),
              swimmingPools.slice(0, width && width >= 1024 ? 3 : 2),
            )
        ).map((swimmingPoolsCol, index) => (
          <div key={`col-${index}`} className="flex flex-col">
            {swimmingPoolsCol.map((swimmingPool) => (
              <SwimmingPoolInfoCard
                key={swimmingPool.id}
                swimmingPool={swimmingPool}
                className={`lg:col-span-1 my-4`}
              />
            ))}
          </div>
        ))}
      </div>
      <Button
        onClick={() => setAllSwimmingPools(!allSwimmingPools)}
        className="w-full md:w-1/2 lg:w-1/4 mx-auto"
        color={'blueish'}
      >
        {allSwimmingPools
          ? t('landing.show-more-swimming-pools')
          : t('landing.show-less-swimming-pools')}
        <Icon className="ml-4" name={allSwimmingPools ? 'arrow-up' : 'arrow-down'} />
      </Button>
    </div>
  )
}

export default SwimmingPoolsInfo
