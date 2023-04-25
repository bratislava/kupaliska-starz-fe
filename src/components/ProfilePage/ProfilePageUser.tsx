import React from 'react'
import { Button, Icon, Spinner } from '../index'
import { useQuery } from 'react-query'
import { fetchUser } from '../../store/user/api'
import { useAccount } from '@azure/msal-react'

const ProfilePageUser = () => {
  const { data, isLoading, isFetched } = useQuery('user', fetchUser)
  const account = useAccount()

  return (
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
          <Icon className="mr-2" name="castle" color="white" /> Spravovať v konte
        </Button>
      </div>
      <div className="gap-6 flex flex-col p-6">
        <div className="gap-6 flex flex-col sm:flex-row">
          <div className="gap-2.5 flex justify-center items-center rounded-lg p-2.5 w-[132px] h-[156px] bg-backgroundGray [box-shadow:0px_0px_0px_2px_rgba(214,_214,_214,_1)_inset] [box-shadow-width:2px]">
            {/*<UIProfil className="w-12 h-12" />*/}
          </div>
          <div className="flex flex-col gap-4">
            <div className="gap-1 flex flex-col">
              <p className="font-semibold">Fotografia</p>
              <p className="text-sm">
                Pre kúpu permanentky je potrebné zadať aj fotografiu.
                <br />
                Tá slúži na priradenie permanentky k jej majiteľovi.
              </p>
            </div>
            <Button className="self-start" color="outlined">
              <Icon className="mr-2" name="upload" /> Nahrať fotku
            </Button>
          </div>
        </div>
        <div className="h-0.5 bg-divider" />
        <div className="gap-4 flex flex-col">
          <div className="gap-2 sm:gap-6 flex flex-col sm:flex-row">
            <div className="gap-2 flex items-center font-semibold sm:w-[200px]">
              <p>Meno a priezvisko</p>
              {/*<UIPomoc className="w-6 " />*/}
            </div>
            <p>
              {account?.idTokenClaims?.given_name} {account?.idTokenClaims?.family_name}
            </p>
          </div>
          <div className="gap-2 sm:gap-6 flex flex-col sm:flex-row">
            <div className="gap-2 flex items-center font-semibold sm:w-[200px]">
              <p>E-mail</p>
              {/*<UIPomoc className="w-6 " />*/}
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
                <p>Meno a priezvisko</p>
                {/*<UIPomoc className="w-6 " />*/}
              </div>
              <p>{data.data.age}</p>
            </div>
            <div className="gap-2 sm:gap-6 flex flex-col sm:flex-row">
              <div className="gap-2 flex items-center font-semibold sm:w-[200px]">
                <p>Meno a priezvisko</p>
                {/*<UIPomoc className="w-6 " />*/}
              </div>
              <p>{data.data.zip}</p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default ProfilePageUser
