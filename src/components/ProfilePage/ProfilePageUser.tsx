import React, { useState } from 'react'
import { Icon, Spinner, Button } from '../index'
import { useQuery } from 'react-query'
import { fetchUser } from '../../store/user/api'
import { useAccount } from '@azure/msal-react'
import ProfilePageAgeZipModal from './ProfilePageAgeZipModal'
import { Button as AriaButton } from 'react-aria-components'
import ProfilePagePhotoModal from './ProfilePagePhotoModal'

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
          <ProfilePageAgeZipModal
            type="age"
            user={data.data}
            open={isAgeModalOpen}
            onClose={() => setIsAgeModalOpen(false)}
          />
          <ProfilePageAgeZipModal
            type="zip"
            user={data.data}
            open={isZipModalOpen}
            onClose={() => setIsZipModalOpen(false)}
          />
          <ProfilePagePhotoModal
            user={data.data}
            open={isPhotoModalOpen}
            onClose={() => setIsPhotoModalOpen(false)}
          />
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
          <Button>
            <Icon className="mr-2 no-fill" name="castle" /> Spravovať v konte
          </Button>
        </div>
        <div className="gap-6 flex flex-col p-6">
          <div className="gap-6 flex flex-col sm:flex-row">
            <div
              className="gap-2.5 flex justify-center items-center rounded-lg p-2.5 w-[132px] h-[156px] bg-backgroundGray [box-shadow:0px_0px_0px_2px_rgba(214,_214,_214,_1)_inset] [box-shadow-width:2px]"
              style={{
                backgroundImage: data?.data.image ? `url(${data?.data.image})` : undefined,
              }}
            ></div>
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
                {account?.idTokenClaims?.given_name} {account?.idTokenClaims?.family_name}
              </p>
            </div>
            <div className="gap-2 sm:gap-6 flex flex-col sm:flex-row">
              <div className="gap-2 flex items-center font-semibold sm:w-[200px]">
                <p>E-mail</p>
              </div>
              <p>{account?.username}</p>
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
