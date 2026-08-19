import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import { convertBase64ToBlob } from '../../helpers/general'
import { FinalOrderResponse } from '../../store/order/api'
import Button from '../Button/Button'
import { Icon, Typography } from '../index'
import TicketsSwiper from './TicketsSwiper'

interface OrderSuccessProps {
  response: FinalOrderResponse
}

const OrderSuccess = ({ response }: OrderSuccessProps) => {
  const { tickets, pdf } = response
  const { t } = useTranslation()

  const downloadTickets = () => {
    const blob = convertBase64ToBlob(pdf, 'application/pdf')

    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob)

      return
    }

    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = t('order-success.ticket-filename')
    link.click()
  }

  return (
    <div className="container mx-auto">
      <div className="mx-auto flex max-w-[1112px] flex-col items-center justify-between gap-8 py-8 md:flex-row">
        <div className="flex max-w-[592px] flex-col gap-6">
          <Typography type="title" fontWeight="medium">
            {t('order-success.thank-you')}
          </Typography>
          <div className="flex flex-col gap-4">
            <p>{t('order-success.description')}</p>
          </div>
          <a
            href="https://bravo.staffino.com/bratislava/id=WWsxW0aq"
            className="link self-start"
            rel="noreferrer"
            target="_blank"
          >
            <Button>
              {t('order-result.feedback')} <Icon className="no-fill ml-4" name="arrow-right" />
            </Button>
          </a>
          <Link to="/" className="self-start">
            <Button color="outlined">
              {t('order-success.continue-home')} <Icon className="no-fill ml-4" name="arrow-right" />
            </Button>
          </Link>
        </div>
        <div className="w-full max-w-[464px] rounded-2xl border-2 border-solid border-divider">
          <div className="border-b-2 border-solid border-divider px-6 py-4 text-center">
            <Typography type="subtitle">
              {tickets.length > 1 ? t('order-success.your-tickets') : t('order-success.your-ticket')}
            </Typography>
          </div>
          <div className="py-6">
            <TicketsSwiper tickets={tickets} />
            <div className="flex flex-col items-center gap-4 px-8">
              <span className="text-sm">{t('order-success.or')}</span>
              <Button color="outlined" className="w-full" onClick={downloadTickets}>
                <Icon name="download" className="mr-2" />
                {tickets.length > 1 ? t('order-success.download-all') : t('order-success.download-one')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderSuccess
