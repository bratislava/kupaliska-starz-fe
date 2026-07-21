import { Link } from 'react-router'

import { convertBase64ToBlob } from '../../helpers/general'
import { FinalOrderResponse } from '../../store/order/api'
import Button from '../Button/Button'
import { Icon, Typography } from '../index'
import TicketsSwiper from './TicketsSwiper'

interface OrderSuccessProps { response: FinalOrderResponse }

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
      <div className="
        mx-auto flex max-w-[1112px] flex-col items-center justify-between gap-8
        py-8
        md:flex-row
      ">
        <div className="flex max-w-[592px] flex-col gap-6">
          <Typography type="title" fontWeight="medium">
            Ďakujeme za nákup!
          </Typography>
          <div className="flex flex-col gap-4">
            <p>
              Na stránke nájdete lístok ako QR kód, ktorým sa môžete preukázať pri vstupe. Rovnako
              máte možnosť si lístok stiahnuť do vášho zariadenia. Lístok sme zaslali aj na váš
              e-mail.
            </p>
          </div>
          <a
            href="https://bravo.staffino.com/bratislava/id=WWsxW0aq"
            className="link self-start"
            rel="noreferrer"
            target="_blank"
          >
            <Button>
              Zanechať spätnú väzbu <Icon className="no-fill ml-4" name="arrow-right" />
            </Button>
          </a>
          <Link to="/" className="self-start">
            <Button color="outlined">
              Pokračovať na domovskú stránku <Icon className="no-fill ml-4" name="arrow-right" />
            </Button>
          </Link>
        </div>
        <div className="
          w-full max-w-[464px] rounded-2xl border-2 border-solid
          border-[#D6D6D6]
        ">
          <div className="
            border-b-2 border-solid border-[#D6D6D6] px-6 py-4 text-center
          ">
            <Typography type="subtitle">
              {tickets.length > 1 ? 'Vaše lístky' : 'Váš lístok'}
            </Typography>
          </div>
          <div className="py-6">
            <TicketsSwiper tickets={tickets} />
            <div className="flex flex-col items-center gap-4 px-8">
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
