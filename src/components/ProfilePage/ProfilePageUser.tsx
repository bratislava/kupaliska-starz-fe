import React, { useState } from 'react'
import { Button, Icon, Spinner } from '../index'
import { useQuery } from 'react-query'
import { fetchUser } from '../../store/user/api'
import { useAccount } from '../../hooks/useAccount'
import ProfilePageAgeZipModal from './ProfilePageAgeZipModal'
import { Button as AriaButton } from 'react-aria-components'
import ProfilePagePhotoModal from './ProfilePagePhotoModal'
import Photo from '../Photo/Photo'
import { environment } from '../../environment'

const ProfilePageUser = () => {
  const { data, isLoading, isError } = useQuery('user', fetchUser)
  const account = useAccount()
  const [isAgeModalOpen, setIsAgeModalOpen] = useState(false)
  const [isZipModalOpen, setIsZipModalOpen] = useState(false)
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false)

  return (
    <>
      {data && (
        <>
          {isAgeModalOpen && (
            <ProfilePageAgeZipModal
              type="age"
              user={data.data}
              onClose={() => setIsAgeModalOpen(false)}
            />
          )}
          {isZipModalOpen && (
            <ProfilePageAgeZipModal
              type="zip"
              user={data.data}
              onClose={() => setIsZipModalOpen(false)}
            />
          )}
          {isPhotoModalOpen && (
            <ProfilePagePhotoModal user={data.data} onClose={() => setIsPhotoModalOpen(false)} />
          )}
        </>
      )}
      <div className="bg-white rounded-lg lg:col-span-7">
        <div className="px-6 py-4 gap-6 flex items-start sm:items-center border-b-2 border-b-divider flex-col sm:flex-row">
          <div className="flex flex-1 flex-col gap-1">
            <p className="font-semibold text-xl">Osobné údaje</p>
            <p>
              Osobné údaje ako e-mail a vaše meno s priezviskom môžete spravovať v Bratislavskom
              konte.
            </p>
          </div>
          <a href={`${environment.cityAccountFrontendUrl}/moj-profil`}>
            <Button>
              <Icon className="mr-2 no-fill" name="castle" /> Spravovať v konte
            </Button>
          </a>
        </div>
        <div className="gap-6 flex flex-col p-6">
          <div className="gap-6 flex flex-col sm:flex-row">
            <Photo photo={data?.data.image} size="normal" />
            <div className="flex flex-col gap-4">
              <div className="gap-1 flex flex-col">
                <p className="font-semibold">Fotografia</p>
                <p className="text-sm">
                  Pre kúpu permanentky je potrebné zadať aj fotografiu.
                  <br />
                  Tá slúži na priradenie permanentky k jej majiteľovi.
                </p>
              </div>
              <Button
                className="self-start"
                color="outlined"
                disabled={isLoading || isError}
                onClick={() => setIsPhotoModalOpen(true)}
              >
                <Icon className="mr-2 no-fill" name="upload" /> Nahrať fotku
              </Button>
            </div>
          </div>
          <div className="h-0.5 bg-divider" />
          <div className="gap-4 flex flex-col">
            <div className="gap-2 sm:gap-6 flex flex-col sm:flex-row">
              <div className="gap-2 flex items-center font-semibold sm:w-[200px]">
                <p>Meno a priezvisko</p>
              </div>
              <p>
                {account.data?.given_name} {account.data?.family_name}
              </p>
            </div>
            <div className="gap-2 sm:gap-6 flex flex-col sm:flex-row">
              <div className="gap-2 flex items-center font-semibold sm:w-[200px]">
                <p>E-mail</p>
              </div>
              <p>{account.data?.email}</p>
            </div>
          </div>
          <div className="h-0.5 bg-divider" />
          {isLoading && (
            <div className="flex justify-center p-6">
              <Spinner />
            </div>
          )}
          {data && (
            <>
              <div className="gap-2 sm:gap-6 flex flex-col sm:flex-row">
                <div className="gap-2 flex items-center font-semibold sm:w-[200px]">
                  <p>Vek</p>
                </div>
                <div className="flex grow">
                  <p className="grow">{data.data.age}</p>
                  <AriaButton onPress={() => setIsAgeModalOpen(true)} aria-label="Upraviť vek">
                    <Icon name="pencil" className="no-fill" />
                  </AriaButton>
                </div>
              </div>
              <div className="gap-2 sm:gap-6 flex flex-col sm:flex-row">
                <div className="gap-2 flex items-center font-semibold sm:w-[200px]">
                  <p>PSČ</p>
                </div>
                <div className="flex grow">
                  <p className="grow">{data.data.zip}</p>
                  <AriaButton onPress={() => setIsZipModalOpen(true)} aria-label="Upraviť PSČ">
                    <Icon name="pencil" className="no-fill" />
                  </AriaButton>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default ProfilePageUser
