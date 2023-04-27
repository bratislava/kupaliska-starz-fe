import React from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { AxiosResponse } from 'axios'
import { produce } from 'immer'
import { Button, InputField } from '../index'
import { updateUser, User } from '../../store/user/api'
import * as yup from 'yup'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { pick } from 'lodash'
import { useValidationSchemaTranslationIfPresent } from '../../helpers/general'
import Dialog from '../Dialog/Dialog'

type ProfilePageAgeModalProps = {
  type: 'age' | 'zip'
  open: boolean
  user: User
  onClose: () => void
}

type FormData = Partial<Pick<User, 'age' | 'zip'>>

const validationSchemaAge = yup.object({
  age: yup
    .number()
    .typeError('common.field-required')
    .required('common.field-required')
    .min(3, 'common.additional-info-toddlers')
    .max(150, 'common.additional-info-tutanchamon'),
})

const validationSchemaZip = yup.object({
  zip: yup.string().nullable(),
})

const getSchemeByType = (type: 'age' | 'zip') => {
  if (type === 'age') {
    return validationSchemaAge
  }
  if (type === 'zip') {
    return validationSchemaZip
  }
}

const ProfilePageAgeModal = ({ type, open, user, onClose }: ProfilePageAgeModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(getSchemeByType(type)!),
    defaultValues: {
      ...pick(user, [type]),
    },
  })

  const { t } = useTranslation()

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
            draft!.data = { ...old!.data, ...formData }
          })
        })
        queryClient.invalidateQueries('user')
        onClose()
      },
    },
  )

  const onSubmit = (form: FormData) => {
    mutation.mutate(form)
  }

  const errorInterpretedAge = useValidationSchemaTranslationIfPresent(errors.age?.message)
  const errorInterpretedZip = useValidationSchemaTranslationIfPresent(errors.zip?.message)

  return (
    <Dialog
      open={open}
      onClose={onClose}
      footerButton={<Button htmlType="submit">{t('profile.save')}</Button>}
      wrapper={<form onSubmit={handleSubmit(onSubmit)} />}
      title={'Fotografia'}
      className="max-w-[488px] container"
    >
      <div className="flex flex-col gap-1">
        <span className="font-semibold">Prečo potrebujeme váš vek?</span>
        <span>
          Dáta z online nákupu nám pomáhajú lepšie spoznať návštevníkov našich kúpalísk, aby sme
          vedeli lepšie prispôsobovať naše ponúkané služby.
        </span>
        {type === 'age' && (
          <InputField
            name="age"
            register={register}
            type="number"
            valueAsNumber={true}
            error={errorInterpretedAge}
          />
        )}
        {type === 'zip' && (
          <InputField name="zip" register={register} error={errorInterpretedZip} />
        )}
      </div>
    </Dialog>
  )
}

export default ProfilePageAgeModal
