import React from 'react'
import { Button, Icon, SectionHeader, Typography } from '../index'
import { HashLink } from 'react-router-hash-link'
import { useTranslation } from 'react-i18next'

const OrderFailure = () => {
  const { t } = useTranslation()

  return (
    <div className="container mx-auto flex flex-col flex-1 justify-between md:justify-start py-8">
      <div>
        <SectionHeader title={t('order-result.order-failed')} />
        <Typography type="subtitle" fontWeight="bold">
          {t('order-result.sry-fault')}
        </Typography>
        <p>{t('order-result.pls-contact')}</p>
      </div>
      <div className="mt-4 md:mt-12">
        <HashLink to="/#contact-us">
          <Button className={`mb-4 w-full md:w-1/2 mx-auto lg:ml-0`} color="outlined">
            {t('order-result.contact-us')}
            <Icon className="ml-4" name="mail" />
          </Button>
        </HashLink>
        <HashLink to="/#ticket-buy">
          <Button className={`w-full md:w-1/2 mx-auto lg:ml-0`}>
            {t('order-result.try-again')}
            <Icon className="ml-4" name="retry" />
          </Button>
        </HashLink>
      </div>
    </div>
  )
}

export default OrderFailure
