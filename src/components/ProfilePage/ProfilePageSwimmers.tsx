import React, { useState } from 'react'
import { Button, Icon, Spinner } from '../index'
import { useQuery } from 'react-query'
import { AssociatedSwimmer, fetchAssociatedSwimmers } from '../../store/associatedSwimmers/api'
import ThreeDots from '../ThreeDots/ThreeDots'
import cx from 'classnames'
import Photo from '../Photo/Photo'
import AssociatedSwimmerEditAddModal from '../AssociatedSwimmerEditAddModal/AssociatedSwimmerEditAddModal'
import ProfilePageDeleteAssociatedSwimmerModal from './ProfilePageDeleteAssociatedSwimmerModal'
import { ErrorWithMessages, useErrorToast } from '../../hooks/useErrorToast'
import { AxiosError } from 'axios'
import { useTranslation } from 'react-i18next'

const ProfilePageSwimmers = () => {
  const { t } = useTranslation()

  const [addEditSwimmerModal, setAddEditSwimmerModal] = useState<{
    open: boolean
    swimmer?: AssociatedSwimmer
  }>({ open: false })

  const [swimmerToDelete, setSwimmerToDelete] = useState<AssociatedSwimmer | null>(null)

  const handleDeleteSwimmerModalClose = () => {
    setSwimmerToDelete(null)
  }

  const { dispatchErrorToastForHttpRequest } = useErrorToast()

  const { data, isLoading } = useQuery('associatedSwimmers', fetchAssociatedSwimmers, {
    onError: (err) => {
      dispatchErrorToastForHttpRequest(err as AxiosError<ErrorWithMessages>)
    },
  })

  return (
    <>
      {addEditSwimmerModal.open && (
        <AssociatedSwimmerEditAddModal
          swimmer={addEditSwimmerModal.swimmer}
          onClose={() => setAddEditSwimmerModal({ open: false })}
        />
      )}
      {swimmerToDelete && (
        <ProfilePageDeleteAssociatedSwimmerModal
          swimmer={swimmerToDelete}
          onClose={handleDeleteSwimmerModalClose}
        ></ProfilePageDeleteAssociatedSwimmerModal>
      )}

      <div className="inline-flex flex-col rounded-lg bg-sunscreen lg:col-span-5">
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
                  <p className="text-sm">
                    {' '}
                    {swimmer.age != null &&
                      t('common.age-interval', { postProcess: 'interval', count: swimmer.age })}
                  </p>
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
