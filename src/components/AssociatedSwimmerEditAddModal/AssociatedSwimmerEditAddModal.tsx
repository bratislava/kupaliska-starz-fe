import {
  AssociatedSwimmer,
  AssociatedSwimmerFetchResponse,
  createAssociatedSwimmer,
  editAssociatedSwimmer,
} from '../../store/associatedSwimmers/api'
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

type FormData = Partial<Pick<AssociatedSwimmer, 'firstname' | 'lastname' | 'image' | 'age' | 'zip'>>

type AssociatedSwimmerEditAddFormModalProps = {
  swimmer?: AssociatedSwimmer | null
  onSaveSuccess?: (savedSwimmer: AssociatedSwimmer) => void
  onClose?: () => void
}

const validationSchema = yup.object({
  firstname: yup.string().required('common.field-required'),
  lastname: yup.string().required('common.field-required'),
  image: yup.string().required('common.field-required'),
  age: yup
    .number()
    .typeError('common.field-required')
    .required('common.field-required')
    .min(3, 'common.additional-info-toddlers')
    .max(150, 'common.additional-info-tutanchamon'),
  zip: yup.string().nullable(),
})

export const AssociatedSwimmerEditAddModal = ({
  swimmer,
  onSaveSuccess = () => {},
  onClose = () => {},
}: AssociatedSwimmerEditAddFormModalProps) => {
  const { t } = useTranslation()
  // For performance reasons, photo is stored in this variable instead of the form, instead if set "set" is stored in the form.
  const [photo, setPhoto] = useState<string | null>()

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
    defaultValues: swimmer
      ? {
          ...pick(swimmer, ['zip', 'age', 'firstname', 'lastname']),
          // Photo is not stored in the form for performance reasons.
          image: swimmer.image ? 'set' : undefined,
        }
      : undefined,
  })

  useEffect(() => {
    if (swimmer?.image) {
      setPhoto(swimmer?.image)
    }
  }, [swimmer])

  const queryClient = useQueryClient()
  const isEditing = Boolean(swimmer)
  const { dispatchErrorToastForHttpRequest } = useErrorToast()

  const mutation = useMutation(
    (formData: FormData) => {
      return isEditing
        ? editAssociatedSwimmer(swimmer!.id as string, formData)
        : createAssociatedSwimmer(formData as AssociatedSwimmer)
    },
    {
      onSuccess: (response) => {
        // Update data to see edited content before the refetch.
        queryClient.setQueryData<AxiosResponse<AssociatedSwimmerFetchResponse> | undefined>(
          'associatedSwimmers',
          (old) => {
            if (!old) {
              return
            }

            return produce(old, (draft) => {
              const newSwimmer = response.data.data.associatedSwimmer
              if (isEditing) {
                const index = old.data.associatedSwimmers.findIndex(
                  (swimmerInList) => swimmerInList.id === swimmer!.id,
                )
                draft.data.associatedSwimmers[index] = newSwimmer
              } else {
                draft.data.associatedSwimmers.push(newSwimmer)
              }
            })
          },
        )
        queryClient.invalidateQueries('associatedSwimmers')
        onSaveSuccess(response.data.data.associatedSwimmer)
        onClose()
      },
      onError: (err) => {
        dispatchErrorToastForHttpRequest(err as AxiosError<ErrorWithMessages>)
      },
    },
  )

  const onSubmit = (form: FormData) => {
    // Get only changed properties, for instance, if we provide the same image it will trigger the upload on the BE.
    const changes = getObjectChanges(swimmer ?? {}, { ...form, image: photo })
    mutation.mutate(changes)
  }

  let errorInterpretedFirstname = useValidationSchemaTranslationIfPresent(errors.firstname?.message)
  let errorInterpretedLastname = useValidationSchemaTranslationIfPresent(errors.lastname?.message)
  let errorInterpretedAge = useValidationSchemaTranslationIfPresent(errors.age?.message)
  let errorInterpretedZip = useValidationSchemaTranslationIfPresent(errors.zip?.message)

  return (
    <Dialog
      title={swimmer ? 'Upraviť osobu' : 'Nová osoba'}
      open={true}
      footerButton={<Button htmlType="submit">{t('profile.save')}</Button>}
      wrapper={
        <form
          onSubmit={handleSubmit(onSubmit, (err) => {
            console.log(err)
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
            className="col-span-1 lg:col-span-2 max-w-formMax"
            name="firstname"
            register={register}
            label={t('person-add.firstname')}
            error={errorInterpretedFirstname}
            newLabel
          />
          <InputField
            className="col-span-1 lg:col-span-2 max-w-formMax"
            name="lastname"
            register={register}
            label={t('person-add.lastname')}
            error={errorInterpretedLastname}
            newLabel
          />
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

export default AssociatedSwimmerEditAddModal