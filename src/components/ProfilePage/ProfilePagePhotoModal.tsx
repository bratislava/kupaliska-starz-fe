import React, { useEffect, useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { AxiosResponse } from 'axios'
import { produce } from 'immer'
import { Button } from '../index'
import { updateUser, User } from '../../store/user/api'
import * as yup from 'yup'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { pick } from 'lodash'
import Dialog from '../Dialog/Dialog'
import PhotoField from '../PhotoField/PhotoField'

type ProfilePagePhotoModalProps = {
  user: User
  onClose: () => void
}

const validationSchema = yup.object({
  image: yup.string().required('common.field-required'),
})

const ProfilePagePhotoModal = ({ user, onClose }: ProfilePagePhotoModalProps) => {
  const {
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
    defaultValues: {
      ...pick(user, ['image']),
    },
  })

  const [image, setImage] = useState<string | null>(null)

  useEffect(() => {
    if (user?.image) {
      setImage(user?.image)
    }
  }, [user])

  const { t } = useTranslation()

  const queryClient = useQueryClient()
  const mutation = useMutation(
    () => {
      return updateUser({ image })
    },
    {
      onSuccess: (response, formData) => {
        queryClient.setQueryData<AxiosResponse<User> | undefined>('user', (old) => {
          if (!old) {
            return
          }

          return produce(old, (draft) => {
            draft!.data = { ...old!.data, image }
          })
        })
        queryClient.invalidateQueries('user')
        onClose()
      },
    },
  )

  const onSubmit = () => {
    mutation.mutate()
  }

  return (
    <Dialog
      open={true}
      onClose={onClose}
      footerButton={<Button htmlType="submit">{t('profile.save')}</Button>}
      wrapper={<form onSubmit={handleSubmit(onSubmit)} />}
      title={'Nahrať fotografiu'}
      className="max-w-[488px] container"
    >
      <div className="flex flex-col gap-1">
        <PhotoField
          setValue={setValue}
          setError={setError}
          clearErrors={clearErrors}
          errors={errors}
          onPhotoSet={setImage}
          image={image}
        ></PhotoField>
      </div>
    </Dialog>
  )
}

export default ProfilePagePhotoModal
