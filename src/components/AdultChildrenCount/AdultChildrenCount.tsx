import { useTranslation } from 'react-i18next'

// pricing.numberOfChildren is not available in response, keeping code for later when available

interface AdultChildrenCount {
  adultCount: number
  childrenCount: number
}

const AdultChildrenCount = ({ adultCount, childrenCount }: AdultChildrenCount) => {
  const { t } = useTranslation()

  const adult = adultCount > 0 ? t('buy-page.adult-count', { count: adultCount }) : null
  const children = childrenCount > 0 ? t('buy-page.children-count', { count: childrenCount }) : null

  return <>({[adult, children].filter(Boolean).join(' + ')})</>
}

export default AdultChildrenCount
