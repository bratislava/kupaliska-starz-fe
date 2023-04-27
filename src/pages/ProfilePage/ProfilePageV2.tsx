import React from 'react'
import { ProfileNavBar } from '../../components'
import ProfilePageUser from '../../components/ProfilePage/ProfilePageUser'
import ProfilePageSwimmers from '../../components/ProfilePage/ProfilePageSwimmers'
import ProfileLine from '../../components/ProfileLine/ProfileLine'

const ProfilePageV2 = () => {
  return (
    <section className="w-full">
      <div className="container mx-auto">
        <ProfileNavBar></ProfileNavBar>
        <ProfileLine></ProfileLine>
        <div className="flex flex-col py-8 gap-8 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <ProfilePageUser />
            <ProfilePageSwimmers />
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProfilePageV2
