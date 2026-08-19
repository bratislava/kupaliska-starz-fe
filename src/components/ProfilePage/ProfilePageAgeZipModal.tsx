import { yupResolver } from '@hookform/resolvers/yup'
import { AxiosError, AxiosResponse } from 'axios'
import DatePicker from 'components/DatePicker/DatePicker'
import dayjs from 'dayjs'
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

const dataByType = {
  dateOfBirth: {
    schema: yup.object({
      dateOfBirth: yup
        .date()
        .typeError('common.field-required')
        .required('common.field-required')
        .max(THREE_YEARS_AGO, 'common.additional-info-toddlers')
        .min(HUNDRED_FIFTY_YEARS_FROM_NOW, 'common.additional-info-tutanchamon'),
    }),
    title: 'person-add.date-of-birth',
    explanationSemiBold: 'profile.why-date-of-birth',
    explanation: 'profile.data-explanation',
  },
  zip: {
    schema: yup.object({
      zip: yup.string().nullable(),
    }),
    title: 'buy-page.zip',
    explanationSemiBold: 'profile.why-zip',
    explanation: 'profile.data-explanation',
  },
}

const ProfilePageAgeZipModal = ({ type, user, onClose }: ProfilePageAgeZipModalProps) => {
  const { schema, title, explanationSemiBold, explanation } = dataByType[type]
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

  const { t } = useTranslation()
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
      // TODO The t function should be used individually on each key
      title={t(title)}
      className="max-w-[488px]"
    >
      <div className="flex flex-col gap-1">
        {/* TODO The t function should be used individually on each key */}
        <span className="font-semibold">{t(explanationSemiBold)}</span>
        {/* TODO The t function should be used individually on each key */}
        <span>{t(explanation)}</span>
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
