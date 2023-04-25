import React, { useState } from 'react'
import { AssociatedSwimmerEditAddForm, Button, Icon, Modal, Typography } from '../../components'
import { AssociatedSwimmer } from '../../store/associatedSwimmers/api'
import ProfilePageUser from '../../components/ProfilePage/ProfilePageUser'
import ProfilePageSwimmers from '../../components/ProfilePage/ProfilePageSwimmers'

const OrderPageCreateSwimmerModal = ({
  open = false,
  onClose,
  onAdd,
}: {
  open: boolean
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
        ></AssociatedSwimmerEditAddForm>
      </div>
    </Modal>
  )
}

const ProfilePageV2 = () => {
  return (
    <>
      <main>
        <div className="mx-auto container flex flex-col py-8 gap-8">
          <Typography type="title">Môj profil</Typography>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <ProfilePageUser />
            <ProfilePageSwimmers />
          </div>
        </div>
      </main>
    </>
  )
}

export default ProfilePageV2
