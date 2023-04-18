import React from 'react'
import { useTranslation } from 'react-i18next'
import { fetchAssociatedSwimmers } from '../../store/associatedSwimmers/api'
import { useQuery } from 'react-query'
import ProfileBack from '../../components/ProfileBack/ProfileBack'
import ProfileLine from '../../components/ProfileLine/ProfileLine'
import { useParams } from 'react-router'
import { useHistory } from 'react-router-dom'
import { AssociatedSwimmerEditAddForm } from '../../components'

const AssociatedSwimmerEditAddPage = () => {
  const { t } = useTranslation()
  const history = useHistory()
  const { id } = useParams<{ id?: string }>()
  const editingOld = Boolean(id)

  const associatedSwimmersQuery = useQuery('associatedSwimmers', fetchAssociatedSwimmers, {
    select: (data) => {
      if (!editingOld) {
        return
      }

      const index = data.data.associatedSwimmers.findIndex((swimmer) => swimmer.id === id)

      if (index === -1) {
        history.push('/profile')
        return
      }

      return { index, data: data.data.associatedSwimmers[index] }
    },
    enabled: editingOld,
  })

  const handleSaveSuccess = () => {
    history.push('/profile')
  }

  return (
    <section className="w-full">
      <div className="container mx-auto">
        <ProfileBack></ProfileBack>
        <ProfileLine></ProfileLine>
        {(associatedSwimmersQuery.isSuccess || !editingOld) && (
          <>
            <div className="mt-14">
              <div className="font-medium text-2xl mb-4 md:mb-8">
                {editingOld
                  ? t('person-add.next-person', {
                      order: (associatedSwimmersQuery.data?.index as number) + 1,
                    })
                  : t('profile.add-others')}
              </div>
            </div>

            <AssociatedSwimmerEditAddForm
              swimmer={editingOld ? associatedSwimmersQuery.data?.data : undefined}
              onSaveSuccess={handleSaveSuccess}
            ></AssociatedSwimmerEditAddForm>
          </>
        )}
      </div>
    </section>
  )
}

export default AssociatedSwimmerEditAddPage
