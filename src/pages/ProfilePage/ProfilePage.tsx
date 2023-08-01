import React from 'react'
import ProfilePageUser from '../../components/ProfilePage/ProfilePageUser'
import ProfilePageSwimmers from '../../components/ProfilePage/ProfilePageSwimmers'
import ProfileLine from '../../components/ProfileLine/ProfileLine'

const ProfilePage = () => {
  return (
    <section className="w-full">
      <div className="container mx-auto">
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

export default ProfilePage
