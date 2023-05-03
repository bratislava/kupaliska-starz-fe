import React, { useState } from 'react'
import { Button, Icon, Spinner } from '../index'
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
import Dialog from '../Dialog/Dialog'
import cx from 'classnames'
import Photo from '../Photo/Photo'
import { useTranslation } from 'react-i18next'
import AssociatedSwimmerEditAddModal from '../AssociatedSwimmerEditAddModal/AssociatedSwimmerEditAddModal'

const DeleteAssociatedSwimmerModal = ({
  onClose,
  person,
}: {
  onClose: any
  person: AssociatedSwimmer
}) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const mutation = useMutation(() => deleteAssociatedSwimmer(person.id!), {
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
              (swimmerFromList) => swimmerFromList.id !== person.id,
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
          <Photo size="normal" photo={person.image} />
          <div className="mt-2">
            {person.firstname} {person.lastname}
          </div>
          <div>{t('person-component.age', { age: person.age })}</div>
        </div>
      </div>
    </Dialog>
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

  const { data, isLoading } = useQuery('associatedSwimmers', fetchAssociatedSwimmers)

  return (
    <>
      {addEditSwimmerModal.open && (
        <AssociatedSwimmerEditAddModal
          swimmer={addEditSwimmerModal.swimmer}
          onClose={() => setAddEditSwimmerModal({ open: false })}
        />
      )}
      {swimmerToDelete && (
        <DeleteAssociatedSwimmerModal
          onClose={handleDeleteSwimmerModalClose}
          person={swimmerToDelete}
        ></DeleteAssociatedSwimmerModal>
      )}

      <div className="inline-flex flex-col rounded-lg bg-white lg:col-span-5">
        <div className="px-6 py-4 gap-6 flex border-b-2 border-b-divider flex-col sm:flex-row">
          <div className="flex-1 gap-1 flex flex-col flex-grow">
            <p className="text-xl font-semibold">Priradené osoby</p>
            <p>Pridajte do profilu osoby a zakúpte pre ne lístky a permanentky.</p>
          </div>
          {data && data.data.associatedSwimmers.length > 0 && (
            <Button className="self-start" onClick={() => setAddEditSwimmerModal({ open: true })}>
              <Icon className="mr-2 no-fill" name="plus" color="white" /> Pridať
            </Button>
          )}
        </div>

        {isLoading && (
          <div className="flex justify-center p-6">
            <Spinner />
          </div>
        )}
        {data && (
          <div
            className={cx(
              'flex flex-col p-6',
              data.data.associatedSwimmers.length ? 'gap-3' : 'gap-6',
            )}
          >
            {data.data.associatedSwimmers.map((swimmer) => (
              <div
                className="px-4 py-3 gap-4 flex items-center rounded-lg bg-backgroundGray"
                key={swimmer.id}
              >
                <Photo size="small" photo={swimmer.image} />
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
            {data.data.associatedSwimmers.length === 0 && (
              <>
                <div className="flex flex-col gap-3 items-center">
                  <div
                    className="w-18 h-18 rounded-full bg-primary bg-opacity-[0.08] flex justify-center items-center text-primary"
                    aria-hidden
                  >
                    <Icon name="groups" className="no-fill" />
                  </div>
                  <span className="font-semibold text-md">Nemáte priradené žiadne osoby.</span>
                </div>
                <div className="flex justify-center">
                  <Button
                    className="self-start"
                    onClick={() => setAddEditSwimmerModal({ open: true })}
                  >
                    <Icon className="mr-2 no-fill" name="plus" color="white" /> Pridať
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </>
  )
}

export default ProfilePageSwimmers
