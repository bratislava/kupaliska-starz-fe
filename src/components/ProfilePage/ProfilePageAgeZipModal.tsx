import { yupResolver } from '@hookform/resolvers/yup'
import { AxiosError, AxiosResponse } from 'axios'
import DatePicker from 'components/DatePicker/DatePicker'
import dayjs from 'dayjs'
import { TFunction } from 'i18next'
import { produce } from 'immer'
import { pick } from 'lodash'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useMutation, useQueryClient } from 'react-query'
import * as yup from 'yup'

import { ErrorWithMessages, useValidationSchemaTranslationIfPresent } from '../../helpers/general'
import { useErrorToast } from '../../hooks/useErrorToast'
import { updateUser, User } from '../../store/user/api'
import Dialog from '../Dialog/Dialog'
import { Button, InputField } from '../index'

interface ProfilePageAgeZipModalProps {
  type: 'dateOfBirth' | 'zip'
  user: User
  onClose: () => void
}

type FormData = Partial<Pick<User, 'dateOfBirth' | 'zip'>>

const today = new Date()
today.setHours(0, 0, 0, 0)
const THREE_YEARS_AGO = dayjs().subtract(3, 'years').startOf('day').toDate()
const HUNDRED_FIFTY_YEARS_FROM_NOW = dayjs().subtract(150, 'years').startOf('day')

const dataByType = (t: TFunction) => {
  return {
    dateOfBirth: {
      schema: yup.object({
        dateOfBirth: yup
          .date()
          .typeError(t('common.field-required'))
          .required(t('common.field-required'))
          .max(THREE_YEARS_AGO, t('common.additional-info-toddlers'))
          .min(HUNDRED_FIFTY_YEARS_FROM_NOW, t('common.additional-info-tutanchamon')),
      }),
      title: t('person-add.date-of-birth'),
      explanationSemiBold: t('profile.why-date-of-birth'),
      explanation: t('profile.data-explanation'),
    },
    zip: {
      schema: yup.object({
        zip: yup.string().nullable(),
      }),
      title: t('buy-page.zip'),
      explanationSemiBold: t('profile.why-zip'),
      explanation: t('profile.data-explanation'),
    },
  }
}

const ProfilePageAgeZipModal = ({ type, user, onClose }: ProfilePageAgeZipModalProps) => {
  const { t } = useTranslation()
  const { schema, title, explanationSemiBold, explanation } = dataByType(t)[type]
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: {
      ...pick(user, [type]),
    },
  })

  const { dispatchErrorToastForHttpRequest } = useErrorToast()

  const queryClient = useQueryClient()
  const mutation = useMutation(
    async (formData: FormData) => {
      return updateUser(formData)
    },
    {
      onSuccess: (response, formData) => {
        queryClient.setQueryData<AxiosResponse<User> | undefined>('user', (old) => {
          if (!old) {
            return
          }

          return produce(old, (draft) => {
            draft.data = { ...old.data, ...formData }
          })
        })
        queryClient.invalidateQueries('user')
        onClose()
      },
      onError: (err) => {
        dispatchErrorToastForHttpRequest(err as AxiosError<ErrorWithMessages>)
      },
    },
  )

  const onSubmit = (form: FormData) => {
    mutation.mutate(form)
  }

  // TODO The t function should be used individually on each key
  const errorInterpretedDateOfBirth = useValidationSchemaTranslationIfPresent(
    errors.dateOfBirth?.message,
  )
  // TODO The t function should be used individually on each key
  const errorInterpretedZip = useValidationSchemaTranslationIfPresent(errors.zip?.message)

  return (
    <Dialog
      open={true}
      onClose={onClose}
      footerButton={<Button htmlType="submit">{t('profile.save')}</Button>}
      wrapper={<form onSubmit={handleSubmit(onSubmit)} />}
      title={title}
      className="max-w-[488px]"
    >
      <div className="flex flex-col gap-1">
        <span className="font-semibold">{explanationSemiBold}</span>
        <span>{explanation}</span>
        {type === 'dateOfBirth' && (
          <DatePicker
            label={t('person-add.date-of-birth')}
            errorMessage={errorInterpretedDateOfBirth ? [errorInterpretedDateOfBirth] : []}
            required={true}
            onChange={(value) => {
              setValue('dateOfBirth', value ? new Date(value).toISOString() : null)
            }}
          />
        )}
        {type === 'zip' && (
          <InputField name="zip" register={register} error={errorInterpretedZip} />
        )}
      </div>
    </Dialog>
  )
}

export default ProfilePageAgeZipModal
