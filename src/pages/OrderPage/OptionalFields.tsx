import { InputField, Tooltip } from 'components'
import { OrderFormData } from 'pages/OrderPage/OrderPage'
import { UseFormRegister } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

interface OptionalFieldsProps {
  register: UseFormRegister<OrderFormData>
  errorMessageZip?: string
  errorMessageAge?: string
}

const OptionalFields = ({ register, errorMessageZip, errorMessageAge }: OptionalFieldsProps) => {
  const { t } = useTranslation()

  return (
    <>
      <Tooltip multiline={true} id="tooltip-customer-form" />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <InputField
          className="col-span-2 mt-6 flex max-w-formMax flex-col gap-y-2 lg:col-span-1"
          name="age"
          register={register}
          // TODO The t function should be used individually on each key
          error={errorMessageAge ? t(errorMessageAge) : undefined}
          type="number"
          valueAsNumber={true}
          label={
            <>
              <span className="text-base font-semibold">{t('buy-page.age')}</span>
              <span className="text-base">{t('buy-page.optional')}</span>
            </>
          }
        />
        <InputField
          className="col-span-2 mt-6 flex max-w-formMax flex-col gap-y-2 lg:col-span-1"
          name="zip"
          register={register}
          // TODO The t function should be used individually on each key
          error={errorMessageZip ? t(errorMessageZip) : undefined}
          label={
            <>
              <span className="text-base font-semibold">{t('buy-page.zip')}</span>
              <span className="text-base">{t('buy-page.optional')}</span>
            </>
          }
        />
      </div>
    </>
  )
}

export default OptionalFields
