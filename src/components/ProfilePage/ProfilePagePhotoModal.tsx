import { yupResolver } from '@hookform/resolvers/yup'
import { AxiosError, AxiosResponse } from 'axios'
import { ErrorWithMessages } from 'helpers/general'
import { produce } from 'immer'
import { pick } from 'lodash'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useMutation, useQueryClient } from 'react-query'
import * as yup from 'yup'

import { useErrorToast } from '../../hooks/useErrorToast'
import { updateUser, User } from '../../store/user/api'
import Dialog from '../Dialog/Dialog'
import { Button } from '../index'
import PhotoField from '../PhotoField/PhotoField'

interface ProfilePagePhotoModalProps {
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
  const { dispatchErrorToastForHttpRequest } = useErrorToast()

  const queryClient = useQueryClient()
  const mutation = useMutation(
    async () => {
      return updateUser({ image })
    },
    {
      onSuccess: (response, formData) => {
        queryClient.setQueryData<AxiosResponse<User> | undefined>('user', (old) => {
          if (!old) {
            return
          }

          return produce(old, (draft) => {
            draft.data = { ...old.data, image }
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
      className="max-w-[488px]"
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
