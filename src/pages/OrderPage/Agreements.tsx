import { CheckboxField } from 'components'
import { ROUTES } from 'helpers/constants'
import { OrderFormData } from 'pages/OrderPage/OrderPage'
import { UseFormRegister } from 'react-hook-form'
import { Trans, useTranslation } from 'react-i18next'
import { Link } from 'react-router'

interface AgreementsProps {
  isSeniorOrDisabledTicket: boolean
  register: UseFormRegister<OrderFormData>
  errorAgreementInterpreted?: string
  errorSeniorAgreementInterpreted?: string
}
const Agreements = ({
  isSeniorOrDisabledTicket,
  register,
  errorAgreementInterpreted,
  errorSeniorAgreementInterpreted,
}: AgreementsProps) => {
  const { t } = useTranslation()

  return (
    <>
      <CheckboxField
        register={register}
        name="agreement"
        error={errorAgreementInterpreted}
        label={
          <span>
            <Trans
              i18nKey="buy-page.agreements"
              components={{
                VopLink: <Link to={ROUTES.VOP} target="_blank" className="link text-primary" />,
                GdprLink: <Link to={ROUTES.GDPR} target="_blank" className="link text-primary" />,
              }}
            />
          </span>
        }
      />
      {isSeniorOrDisabledTicket && (
        <>
          <CheckboxField
            className="my-4"
            register={register}
            name="seniorOrDisabledAgreement"
            error={errorSeniorAgreementInterpreted}
            label={<span>{t('buy-page.senior-disabled-agreement')}</span>}
          />
          <div className="flex flex-col gap-2 italic">
            <span>{t('buy-page.senior-disabled-note')}</span>
          </div>
        </>
      )}
    </>
  )
}

export default Agreements
