import React, { useState } from 'react'
import { AssociatedSwimmerEditAddForm, Button, Icon, Modal, Spinner } from '../index'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import {
  AssociatedSwimmer,
  AssociatedSwimmerFetchResponse,
  deleteAssociatedSwimmer,
  fetchAssociatedSwimmers,
} from '../../store/associatedSwimmers/api'
import ThreeDots from '../ThreeDots/ThreeDots'
import { AxiosResponse } from 'axios'
import { produce } from 'immer'
import PersonComponent, { PersonComponentMode } from '../PersonComponent/PersonComponent'

const OrderPageCreateSwimmerModal = ({
  open = false,
  swimmer,
  onClose,
  onAdd,
}: {
  open: boolean
  swimmer?: AssociatedSwimmer
  onClose: () => void
  onAdd: (addedSwimmer: Partial<AssociatedSwimmer>) => void
}) => {
  const handleSaveSuccess = (addedSwimmer: Partial<AssociatedSwimmer>) => {
    onAdd(addedSwimmer)
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} closeButton={true}>
      <div
        className="block bg-white rounded-lg p-10 text-primary shadow-lg modal-with-close-width-screen"
        style={{ maxWidth: '1100px' }}
      >
        <AssociatedSwimmerEditAddForm
          onSaveSuccess={handleSaveSuccess}
          swimmer={swimmer}
        ></AssociatedSwimmerEditAddForm>
      </div>
    </Modal>
  )
}

const DeleteAssociatedSwimmerModal = ({
  open = false,
  onClose,
  person = null,
}: {
  open: boolean
  onClose: any
  person: AssociatedSwimmer | null
}) => {
  const queryClient = useQueryClient()
  const mutation = useMutation(() => deleteAssociatedSwimmer(person!.id!), {
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
              (swimmerFromList) => swimmerFromList.id !== person!.id,
            )
          })
        },
      )
      queryClient.invalidateQueries('associatedSwimmers')
      onClose()
    },
  })
  const handleRemove = () => {
    mutation.mutate()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      button={
        <Button onClick={handleRemove} className="px-10">
          Odstrániť z profilu
        </Button>
      }
      modalClassName="w-full md:w-max max-w-sm"
      closeButton={true}
    >
      <div className="flex flex-col p-10 items-center">
        <span className="text-primary font-semibold text-xl mb-5 text-center">
          Naozaj chcete odstrániť túto osobu z vášho profilu?
        </span>
        {person && (
          <PersonComponent
            person={person}
            mode={PersonComponentMode.DisplayWithDescription}
          ></PersonComponent>
        )}
      </div>
    </Modal>
  )
}

const ProfilePageSwimmers = () => {
  const [addEditSwimmerModal, setAddEditSwimmerModal] = useState<{
    open: boolean
    swimmer?: AssociatedSwimmer
  }>({ open: false })

  const [swimmerToDelete, setSwimmerToDelete] = useState<AssociatedSwimmer | null>(null)

  const handleDeleteSwimmerModalClose = () => {
    setSwimmerToDelete(null)
  }

  const { data, isLoading, isError, isFetched } = useQuery(
    'associatedSwimmers',
    fetchAssociatedSwimmers,
  )

  return (
    <>
      <OrderPageCreateSwimmerModal
        open={addEditSwimmerModal.open}
        swimmer={addEditSwimmerModal.swimmer}
        onClose={() => setAddEditSwimmerModal({ open: false })}
        onAdd={() => {}}
      />

      <DeleteAssociatedSwimmerModal
        open={Boolean(swimmerToDelete)}
        onClose={handleDeleteSwimmerModalClose}
        person={swimmerToDelete}
      ></DeleteAssociatedSwimmerModal>

      <div className="inline-flex flex-col rounded-lg bg-white lg:col-span-5">
        <div className="px-6 py-4 gap-6 flex border-b-2 border-b-divider">
          <div className="flex-1 gap-1 flex flex-col flex-grow">
            <p className="text-xl font-semibold">Priradené osoby</p>
            <p>Pridajte do profilu osoby a zakúpte pre ne lístky a permanentky.</p>
          </div>
          <Button
            className="self-start"
            disabled={!isFetched}
            onClick={() => setAddEditSwimmerModal({ open: true })}
          >
            <Icon className="mr-2" name="plus" color="white" /> Pridať
          </Button>
        </div>

        {isLoading && (
          <div className="flex justify-center p-6">
            <Spinner />
          </div>
        )}
        {data && (
          <div className="gap-3 flex flex-col p-6">
            {data.data.associatedSwimmers.map((swimmer) => (
              <div
                className="px-4 py-3 gap-4 flex items-center h-20 rounded-lg bg-backgroundGray"
                key={swimmer.id}
              >
                <div
                  className="h-14 w-12 bg-cover bg-center rounded-lg bg-backgroundGray"
                  style={{
                    backgroundImage: swimmer.image ? `url(${swimmer.image})` : undefined,
                  }}
                ></div>
                <div className="flex flex-col flex-grow">
                  <p className="font-semibold">
                    {swimmer.firstname} {swimmer.lastname}
                  </p>
                  <p className="text-sm">{swimmer.age}</p>
                </div>

                <ThreeDots
                  buttons={[
                    {
                      title: 'Upraviť osobu',
                      icon: 'pencil',
                      className: 'hover:bg-gray-100',
                      onPress: () => setAddEditSwimmerModal({ open: true, swimmer }),
                    },
                    {
                      title: 'Vymazať osobu',
                      icon: 'bin',
                      className: 'text-[#D00000]',
                      onPress: () => setSwimmerToDelete(swimmer),
                    },
                  ]}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default ProfilePageSwimmers