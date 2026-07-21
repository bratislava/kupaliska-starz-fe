import ProfileLine from '../../components/ProfileLine/ProfileLine'
import ProfilePageSwimmers from '../../components/ProfilePage/ProfilePageSwimmers'
import ProfilePageUser from '../../components/ProfilePage/ProfilePageUser'

const ProfilePage = () => {
  return (
    <section className="w-full">
      <div className="container mx-auto">
        <div className="mt-4 flex flex-col gap-8 py-8">
          <div className="
            grid grid-cols-1 items-start gap-8
            lg:grid-cols-12
          ">
            <ProfilePageUser />
            <ProfilePageSwimmers />
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProfilePage
