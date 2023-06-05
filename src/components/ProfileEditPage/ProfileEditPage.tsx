import React, { useEffect, useState } from 'react'
import PhotoField from '../PhotoField/PhotoField'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Icon, InputField } from '../index'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { fetchUser, updateUser, User } from '../../store/user/api'
import { useHistory } from 'react-router-dom'
import ProfileLine from '../ProfileLine/ProfileLine'
import ProfileBack from '../ProfileBack/ProfileBack'
import { pick } from 'lodash'
import { getObjectChanges } from '../../helpers/getObjectChanges'
import { useValidationSchemaTranslationIfPresent } from 'helpers/general'
import { AxiosError } from 'axios'
import { ErrorWithMessages, useErrorToast } from '../../hooks/useErrorToast'
import logger from 'helpers/logger'

type FormData = Partial<Pick<User, 'image' | 'age' | 'zip'>>

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

const ProfileEditForm = ({ user }: { user: User }) => {
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
    defaultValues: {
      ...pick(user, ['age', 'zip']),
      // Photo is not stored in the form for performance reasons.
      image: user.image ? 'set' : undefined,
    },
  })

  const { t } = useTranslation()
  // For performance reasons, photo is stored in this variable instead of the form, instead if set "set" is stored in the form.
  const [photo, setPhoto] = useState<string | null>()

  const queryClient = useQueryClient()
  const history = useHistory()
  const { dispatchErrorToastForHttpRequest } = useErrorToast()

  useEffect(() => {
    if (user?.image) {
      setPhoto(user?.image)
    }
  }, [user])

  const mutation = useMutation(
    (formData: FormData) => {
      return updateUser(formData)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('user')
        history.push('/profile')
      },
      onError: (err) => {
        dispatchErrorToastForHttpRequest(err as AxiosError<ErrorWithMessages>)
      },
    },
  )

  const onSubmit = (form: FormData) => {
    // Get only changed properties, for instance, if we provide the same image it will trigger the upload on the BE.
    const changes = getObjectChanges(user, { ...form, image: photo })
    mutation.mutate(changes)
  }

  let errorInterpretedAge = useValidationSchemaTranslationIfPresent(errors.age?.message)
  let errorInterpretedZip = useValidationSchemaTranslationIfPresent(errors.zip?.message)

  return (
    <form className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <div>
        <InputField
          className="col-span-2 lg:col-span-1 max-w-formMax"
          name="age"
          register={register}
          label={t('profile.age')}
          error={errorInterpretedAge}
          type="number"
          valueAsNumber={true}
        />
        <InputField
          className="col-span-2 lg:col-span-1 mt-6 max-w-formMax"
          name="zip"
          register={register}
          label={t('profile.zip')}
          error={errorInterpretedZip}
        />
        <Button
          className="my-8"
          htmlType="button"
          onClick={handleSubmit(onSubmit, (err) => {
            logger.error(err)
          })}
        >
          {t('profile.save')}
          <Icon className="ml-4" name="arrow-left" />
        </Button>
      </div>
      <div className="flex">
        <PhotoField
          setValue={setValue}
          setError={setError}
          clearErrors={clearErrors}
          errors={errors}
          onPhotoSet={setPhoto}
          image={photo}
        ></PhotoField>
      </div>
    </form>
  )
}

const ProfileEditPage = () => {
  const { dispatchErrorToastForHttpRequest } = useErrorToast()

  const userQuery = useQuery('user', fetchUser, {
    onError: (err) => {
      dispatchErrorToastForHttpRequest(err as AxiosError<ErrorWithMessages>)
    },
  })
  const { t } = useTranslation()

  return (
    <section className="w-full">
      <div className="container mx-auto">
        <ProfileBack></ProfileBack>
        <ProfileLine></ProfileLine>

        {userQuery.isSuccess &&
          (userQuery.data.data.age == null || userQuery.data.data.image == null) && (
            <div className="bg-warningSoft py-5 px-6 mt-14 shadow-lg flex items-center flex-col md:flex-row">
              <img src="/warning.svg" alt="" className="mr-0 md:mr-4 mb-5 md:mb-0" />
              <div className="text-center">{t('profile.age-photo-required')}</div>
            </div>
          )}
        <div className="mt-14">
          <div className="font-medium text-2xl mb-4 md:mb-8">{t('profile.user')}</div>
        </div>
        {userQuery.isSuccess && <ProfileEditForm user={userQuery.data.data}></ProfileEditForm>}
      </div>
    </section>
  )
}

export default ProfileEditPage
