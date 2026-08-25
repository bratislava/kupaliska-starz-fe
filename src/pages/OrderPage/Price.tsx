import { FormatCurrencyFromCents } from 'helpers/currencyFormatter'
import { GetPriceResponse } from 'models'

interface PriceProps {
  pricing: GetPriceResponse['data']['pricing']
}

const Price = ({ pricing }: PriceProps) => {
  const fullPrice =
    pricing.discount > 0 ? (
      <div className="strikethrough-diagonal mr-2 inline-block">
        <FormatCurrencyFromCents value={pricing.orderPriceWithVat + pricing.discount} />
      </div>
    ) : null
  const orderPrice = (
    <div className="inline-block">
      <FormatCurrencyFromCents value={pricing.orderPriceWithVat} />
    </div>
  )

  return (
    <>
      {fullPrice}
      {orderPrice}
    </>
  )
}

export default Price
