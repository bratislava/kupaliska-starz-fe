import React from 'react'
import Button from '../Button/Button'
import TicketsSwiper from './TicketsSwiper'
import { Icon, Typography } from '../index'
import { FinalOrderResponse } from '../../store/order/api'
import { convertBase64ToBlob } from '../../helpers/general'
import { Link } from 'react-router-dom'

type OrderSuccessProps = { response: FinalOrderResponse }

const OrderSuccess = ({ response }: OrderSuccessProps) => {
  const { tickets, pdf } = response

  const downloadTickets = () => {
    const blob = convertBase64ToBlob(pdf, 'application/pdf')

    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob)
      return
    }

    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'Lístok na kúpaliská STaRZ'
    link.click()
  }

  return (
    <div className="container mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center py-8 gap-8 max-w-[1112px] mx-auto">
        <div className="flex gap-6 flex-col max-w-[592px]">
          <Typography type="title" fontWeight="medium">
            Ďakujeme za nákup!
          </Typography>
          <div className="flex gap-4 flex-col">
            <p>
              Na stránke nájdete lístok ako QR kód, ktorým sa môžete preukázať pri vstupe. Rovnako
              máte možnosť si lístok stiahnuť do vášho zariadenia. Lístok sme zaslali aj na váš
              e-mail.
            </p>
          </div>
          <a
            href="https://forms.office.com/e/tpB1R623sd"
            className="link self-start"
            rel="noreferrer"
            target="_blank"
          >
            <Button>
              Zanechať spätnú väzbu <Icon className="ml-4 no-fill" name="arrow-right" />
            </Button>
          </a>
          <Link to="/" className="self-start">
            <Button color="outlined">
              Pokračovať na domovskú stránku <Icon className="ml-4 no-fill" name="arrow-right" />
            </Button>
          </Link>
        </div>
        <div className="w-full max-w-[464px] rounded-2xl border-2 border-solid border-[#D6D6D6]">
          <div className="px-6 py-4 border-b-2 border-solid border-[#D6D6D6] text-center">
            <Typography type="subtitle">
              {tickets.length > 1 ? 'Vaše lístky' : 'Váš lístok'}
            </Typography>
          </div>
          <div className="py-6">
            <TicketsSwiper tickets={tickets} />
            <div className="flex px-8 flex-col gap-4 items-center">
              <span className="text-sm">alebo</span>
              <Button color="outlined" className="w-full" onClick={downloadTickets}>
                <Icon name="download" className="mr-2" />
                {tickets.length > 1 ? 'Stiahnuť všetky lístky' : 'Stiahnuť lístok'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderSuccess
