import { ANCHORS } from 'helpers/constants'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import { Button, Icon, SectionHeader, Typography } from '../index'

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
            <Button className={`mx-auto mb-4 w-full md:w-1/2 lg:ml-0`} color="outlined">
              {t('order-result.contact-us')}
              <Icon className="ml-4" name="mail" />
            </Button>
          </Link>
          <Link to={ANCHORS.TICKET_BUY}>
            <Button className={`mx-auto w-full md:w-1/2 lg:ml-0`}>
              {t('order-result.try-again')}
              <Icon className="ml-4" name="retry" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default OrderFailure
