import { InputField } from 'components'
import { OrderFormData } from 'pages/OrderPage/OrderPage'
import { UseFormRegister } from 'react-hook-form'
import { Trans, useTranslation } from 'react-i18next'

interface EmailFieldProps {
  register: UseFormRegister<OrderFormData>
  required: boolean
  email?: string
  errorMessage?: string
}

const EmailField = ({ register, required, email, errorMessage }: EmailFieldProps) => {
  const { t } = useTranslation()

  return required ? (
    <InputField
      className="flex flex-col gap-y-2"
      name="email"
      register={register}
      // TODO redo InputField styles
      label={<span className="text-base font-semibold">{t('common.email')}</span>}
      error={errorMessage}
    />
  ) : (
    <Trans
      i18nKey={'buy-page.email-send-to'}
      components={{ span: <span /> }}
      values={{ username: email }}
    />
  )
}

export default EmailField
