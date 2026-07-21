import { AxiosError } from 'axios'
import cx from 'classnames'
import { ErrorWithMessages } from 'helpers/general'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'

import { useErrorToast } from '../../hooks/useErrorToast'
import { AssociatedSwimmer, fetchAssociatedSwimmers } from '../../store/associatedSwimmers/api'
import AssociatedSwimmerEditAddModal from '../AssociatedSwimmerEditAddModal/AssociatedSwimmerEditAddModal'
import { Button, Icon, Spinner } from '../index'
import Photo from '../Photo/Photo'
import ThreeDots from '../ThreeDots/ThreeDots'
import ProfilePageDeleteAssociatedSwimmerModal from './ProfilePageDeleteAssociatedSwimmerModal'

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

      <div className="
        inline-flex flex-col rounded-lg bg-sunscreen
        lg:col-span-5
      ">
        <div className="
          flex flex-col gap-6 border-b-2 border-b-divider px-6 py-4
          sm:flex-row
        ">
          <div className="flex flex-1 flex-grow flex-col gap-1">
            <p className="text-xl font-semibold">Priradené osoby</p>
            <p>Pridajte do profilu osoby a zakúpte pre ne lístky a permanentky.</p>
          </div>
          {data && data.data.associatedSwimmers.length > 0 && (
            <Button className="self-start" onClick={() => setAddEditSwimmerModal({ open: true })}>
              <Icon className="no-fill mr-2" name="plus" color="white" /> Pridať
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
                className="
                  flex items-center gap-4 rounded-lg bg-backgroundGray px-4 py-3
                "
                key={swimmer.id}
              >
                <Photo size="small" photo={swimmer.image} />
                <div className="flex flex-grow flex-col">
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
                <div className="flex flex-col items-center gap-3">
                  <div
                    className="
                      flex h-18 w-18 items-center justify-center rounded-full
                      bg-primary bg-opacity-[0.08] text-primary
                    "
                    aria-hidden
                  >
                    <Icon name="groups" className="no-fill" />
                  </div>
                  <span className="text-md font-semibold">Nemáte priradené žiadne osoby.</span>
                </div>
                <div className="flex justify-center">
                  <Button
                    className="self-start"
                    onClick={() => setAddEditSwimmerModal({ open: true })}
                  >
                    <Icon className="no-fill mr-2" name="plus" color="white" /> Pridať
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
