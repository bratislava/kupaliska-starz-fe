import React from 'react'
import { Button, Icon, Typography } from '../../components'

const ProfilePageV2 = () => {
  return (
    <main>
      <div className="mx-auto container flex flex-col py-8 gap-8">
        <Typography type="title">Môj profil</Typography>
        <div className="grid grid-cols-1 lg:grid-cols-[696px_487px] gap-[33px]">
          <div className="bg-white rounded-lg">
            <div className="px-6 py-4 gap-6 flex items-start sm:items-center border-b-2 border-b-divider flex-col sm:flex-row">
              <div className="flex flex-1 flex-col gap-1">
                <p className="font-semibold text-xl">Osobné údaje</p>
                <p>
                  Osobné údaje ako e-mail a vaše meno s priezviskom môžete spravovať v Bratislavskom
                  konte.
                </p>
              </div>
              <Button>Spravovať v konte</Button>
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
                    Nahrať fotku
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
                  <p>Janko Hraško</p>
                </div>
                <div className="gap-2 sm:gap-6 flex flex-col sm:flex-row">
                  <div className="gap-2 flex items-center font-semibold sm:w-[200px]">
                    <p>Meno a priezvisko</p>
                    {/*<UIPomoc className="w-6 " />*/}
                  </div>
                  <p>Janko Hraško</p>
                </div>
              </div>
              <div className="h-0.5 bg-divider" />
              <div className="gap-2 sm:gap-6 flex flex-col sm:flex-row">
                <div className="gap-2 flex items-center font-semibold sm:w-[200px]">
                  <p>Meno a priezvisko</p>
                  {/*<UIPomoc className="w-6 " />*/}
                </div>
                <p>Janko Hraško</p>
              </div>
              <div className="gap-2 sm:gap-6 flex flex-col sm:flex-row">
                <div className="gap-2 flex items-center font-semibold sm:w-[200px]">
                  <p>Meno a priezvisko</p>
                  {/*<UIPomoc className="w-6 " />*/}
                </div>
                <p>Janko Hraško</p>
              </div>
            </div>
          </div>
          <div className="inline-flex flex-col rounded-lg bg-white">
            <div className="px-6 py-4 gap-6 flex border-b-2 border-b-divider">
              <div className="flex-1 gap-1 flex flex-col flex-grow">
                <p className="text-xl font-semibold">Priradené osoby</p>
                <p>Pridajte do profilu osoby a zakúpte pre ne lístky a permanentky.</p>
              </div>
              <Button className="self-start">
                <Icon className="mr-2" name="plus" color="white" /> Pridať
              </Button>
            </div>
            <div className="gap-3 flex flex-col p-6">
              <div className="px-4 py-3 gap-4 flex items-center h-20 rounded-lg bg-backgroundGray">
                {/*<Image className="h-14 w-[48.8447265625px]" />*/}
                <div className="flex flex-col flex-grow">
                  <p className="font-semibold">Jano Hraško</p>
                  <p className="text-sm">33 rokov</p>
                </div>
                {/*<UITri_bodky_hor className="w-6 " />*/}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default ProfilePageV2
