import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import ButtonComponentLibraryWrapper from '@/components/Button/ButtonComponentLibraryWrapper'
import Icon from '@/components/Icon/Icon'
import SectionHeader from '@/components/SectionHeader/SectionHeader'
import Typography from '@/components/Typography/Typography'
import { ANCHORS } from '@/helpers/constants'

const OrderFailure = () => {
  const { t } = useTranslation()

  return (
    <div className="grow bg-sunscreen">
      <div className="container mx-auto flex flex-1 flex-col justify-between py-8 md:justify-start">
        <div>
          <SectionHeader title={t('order-result.order-failed')} />
          <Typography type="subtitle" fontWeight="bold">
            {t('order-result.sry-fault')}
          </Typography>
          <p>{t('order-result.pls-contact')}</p>
        </div>
        <div className="mt-4 md:mt-12">
          <Link to={ANCHORS.CONTACT_US}>
            {/* TODO don't nest button in link */}
            <ButtonComponentLibraryWrapper
              className="mx-auto mb-4 flex w-full md:w-1/2 lg:ml-0"
              variant="outline"
              endIcon={<Icon name="mail" />}
            >
              {t('order-result.contact-us')}
            </ButtonComponentLibraryWrapper>
          </Link>
          <Link to={ANCHORS.TICKET_BUY}>
            {/* TODO don't nest button in link */}
            <ButtonComponentLibraryWrapper
              className="mx-auto flex w-full md:w-1/2 lg:ml-0"
              variant="solid"
              endIcon={<Icon name="retry" />}
            >
              {t('order-result.try-again')}
            </ButtonComponentLibraryWrapper>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default OrderFailure
