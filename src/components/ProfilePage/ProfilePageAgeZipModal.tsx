import React from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { AxiosError, AxiosResponse } from 'axios'
import { produce } from 'immer'
import { Button, InputField } from '../index'
import { updateUser, User } from '../../store/user/api'
import * as yup from 'yup'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { pick } from 'lodash'
import { ErrorWithMessages, useValidationSchemaTranslationIfPresent } from '../../helpers/general'
import Dialog from '../Dialog/Dialog'
import { useErrorToast } from '../../hooks/useErrorToast'
import DatePicker from 'components/DatePicker/DatePicker'
import dayjs from 'dayjs'

type ProfilePageAgeZipModalProps = {
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
    title: 'Dátum narodenia',
    explanationSemiBold: 'Prečo potrebujeme váš dátum narodenia?',
    explanation:
      'Dáta z online nákupu nám pomáhajú lepšie spoznať návštevníkov našich kúpalísk, aby sme vedeli lepšie prispôsobovať naše ponúkané služby.',
  },
  zip: {
    schema: yup.object({
      zip: yup.string().nullable(),
    }),
    title: 'PSČ',
    explanationSemiBold: 'Prečo potrebujeme vaše PSČ?',
    explanation:
      'Dáta z online nákupu nám pomáhajú lepšie spoznať návštevníkov našich kúpalísk, aby sme vedeli lepšie prispôsobovať naše ponúkané služby.',
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
    (formData: FormData) => {
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

  const errorInterpretedDateOfBirth = useValidationSchemaTranslationIfPresent(
    errors.dateOfBirth?.message,
  )
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
            label={t('person-add.dateOfBirth')}
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
