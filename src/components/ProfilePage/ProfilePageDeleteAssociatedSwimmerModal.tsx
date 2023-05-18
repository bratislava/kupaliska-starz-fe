import React from 'react'
import {
  AssociatedSwimmer,
  AssociatedSwimmerFetchResponse,
  deleteAssociatedSwimmer,
} from '../../store/associatedSwimmers/api'
import { useTranslation } from 'react-i18next'
import { useMutation, useQueryClient } from 'react-query'
import { AxiosError, AxiosResponse } from 'axios'
import { produce } from 'immer'
import Dialog from '../Dialog/Dialog'
import { Button } from '../index'
import Photo from '../Photo/Photo'
import { ErrorWithMessages, useErrorToast } from '../../hooks/useErrorToast'

type ProfilePageDeleteAssociatedSwimmerModalProps = {
  swimmer: AssociatedSwimmer
  onClose: () => void
}

const ProfilePageDeleteAssociatedSwimmerModal = ({
  swimmer,
  onClose,
}: ProfilePageDeleteAssociatedSwimmerModalProps) => {
  const { t } = useTranslation()
  const { dispatchErrorToastForHttpRequest } = useErrorToast()

  const queryClient = useQueryClient()
  const mutation = useMutation(() => deleteAssociatedSwimmer(swimmer.id!), {
    onSuccess: () => {
      // Update data to see edited content before the refetch.
      queryClient.setQueryData<AxiosResponse<AssociatedSwimmerFetchResponse> | undefined>(
        'associatedSwimmers',
        (old) => {
          if (!old) {
            return
          }

          return produce(old, (draft) => {
            draft.data.associatedSwimmers = old.data.associatedSwimmers.filter(
              (swimmerFromList) => swimmerFromList.id !== swimmer.id,
            )
          })
        },
      )
      queryClient.invalidateQueries('associatedSwimmers')
      onClose()
    },
    onError: (err) => {
      dispatchErrorToastForHttpRequest(err as AxiosError<ErrorWithMessages>)
    },
  })
  const handleRemove = () => {
    mutation.mutate()
  }

  return (
    <Dialog
      title="Odstrániť z profilu"
      open={true}
      onClose={onClose}
      footerButton={<Button onClick={handleRemove}>Odstrániť</Button>}
      className="max-w-[488px]"
    >
      <div className="flex flex-col gap-4">
        <span>Naozaj chcete odstrániť túto osobu z vášho profilu?</span>
        <div className="flex flex-col gap-1 items-center">
          <Photo size="normal" photo={swimmer.image} />
          <div className="mt-2">
            {swimmer.firstname} {swimmer.lastname}
          </div>
          <div>{t('person-component.age', { age: swimmer.age })}</div>
        </div>
      </div>
    </Dialog>
  )
}

export default ProfilePageDeleteAssociatedSwimmerModal
