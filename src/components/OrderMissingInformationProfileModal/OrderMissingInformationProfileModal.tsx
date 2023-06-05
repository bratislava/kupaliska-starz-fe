import { useTranslation } from 'react-i18next'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQueryClient } from 'react-query'
import { Button, InputField } from '../index'
import PhotoField from '../PhotoField/PhotoField'
import * as yup from 'yup'
import { pick } from 'lodash'
import { getObjectChanges } from '../../helpers/getObjectChanges'
import { useValidationSchemaTranslationIfPresent } from 'helpers/general'
import { AxiosError, AxiosResponse } from 'axios'
import { produce } from 'immer'
import Dialog from '../Dialog/Dialog'
import { ErrorWithMessages, useErrorToast } from '../../hooks/useErrorToast'
import { updateUser, User } from '../../store/user/api'
import logger from 'helpers/logger'

type FormData = Partial<Pick<User, 'image' | 'age' | 'zip'>>

type OrderMissingInformationProfileModalProps = {
  user: User
  onClose?: () => void
}

const validationSchema = yup.object({
  image: yup.string().required('common.field-required'),
  age: yup
    .number()
    .typeError('common.field-required')
    .required('common.field-required')
    .min(3, 'common.additional-info-toddlers')
    .max(150, 'common.additional-info-tutanchamon'),
  zip: yup.string().nullable(),
})

export const OrderMissingInformationProfileModal = ({
  user,
  onClose = () => {},
}: OrderMissingInformationProfileModalProps) => {
  const { t } = useTranslation()
  // For performance reasons, photo is stored in this variable instead of the form, instead if set "set" is stored in the form.
  const [photo, setPhoto] = useState<string | null>(user.image)

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<FormData>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
    defaultValues: user
      ? {
          ...pick(user, ['zip', 'age']),
          // Photo is not stored in the form for performance reasons.
          image: user.image ? 'set' : undefined,
        }
      : undefined,
  })

  useEffect(() => {
    if (user?.image) {
      setPhoto(user?.image)
    }
  }, [user])

  const queryClient = useQueryClient()
  const { dispatchErrorToastForHttpRequest } = useErrorToast()

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
    // Get only changed properties, for instance, if we provide the same image it will trigger the upload on the BE.
    const changes = getObjectChanges(user ?? {}, { ...form, image: photo })
    mutation.mutate(changes)
  }

  let errorInterpretedAge = useValidationSchemaTranslationIfPresent(errors.age?.message)
  let errorInterpretedZip = useValidationSchemaTranslationIfPresent(errors.zip?.message)

  return (
    <Dialog
      title={'Doplnenie povinných údajov'}
      open={true}
      footerButton={<Button htmlType="submit">{t('profile.save')}</Button>}
      wrapper={
        <form
          onSubmit={handleSubmit(onSubmit, (err) => {
            logger.error(err)
          })}
        />
      }
      className="max-w-[800px]"
      onClose={onClose}
    >
      <div className="flex flex-col gap-12">
        <div>
          <PhotoField
            setValue={setValue}
            setError={setError}
            clearErrors={clearErrors}
            errors={errors}
            onPhotoSet={setPhoto}
            image={photo}
            showLabel
          ></PhotoField>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <InputField
            className="col-span-1 lg:col-span-1 max-w-formMax"
            name="age"
            register={register}
            label={t('person-add.age')}
            error={errorInterpretedAge}
            type="number"
            valueAsNumber={true}
            newLabel
          />
          <InputField
            className="col-span-1 lg:col-span-1 max-w-formMax"
            name="zip"
            register={register}
            label={t('person-add.zip')}
            error={errorInterpretedZip}
            newLabel
          />
        </div>
      </div>
    </Dialog>
  )
}

export default OrderMissingInformationProfileModal
