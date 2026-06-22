import { Button, Icon, SectionHeader, Typography } from '../index'
import { useTranslation } from 'react-i18next'
import { ANCHORS } from 'helpers/constants'
import { Link } from 'react-router'

const OrderFailure = () => {
  const { t } = useTranslation()

  return (
    <div className="bg-sunscreen grow">
      <div className="container mx-auto flex flex-col flex-1 justify-between md:justify-start py-8">
        <div>
          <SectionHeader title={t('order-result.order-failed')} />
          <Typography type="subtitle" fontWeight="bold">
            {t('order-result.sry-fault')}
          </Typography>
          <p>{t('order-result.pls-contact')}</p>
        </div>
        <div className="mt-4 md:mt-12">
          <Link to={ANCHORS.CONTACT_US}>
            <Button className={`mb-4 w-full md:w-1/2 mx-auto lg:ml-0`} color="outlined">
              {t('order-result.contact-us')}
              <Icon className="ml-4" name="mail" />
            </Button>
          </Link>
          <Link to={ANCHORS.TICKET_BUY}>
            <Button className={`w-full md:w-1/2 mx-auto lg:ml-0`}>
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
