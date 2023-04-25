import React, { useState } from 'react'
import { Button, Icon, Spinner } from '../index'
import { useQuery } from 'react-query'
import { fetchAssociatedSwimmers } from '../../store/associatedSwimmers/api'

type ProfilePageSwimmersProps = {}

const ProfilePageSwimmers = ({}: ProfilePageSwimmersProps) => {
  const [addSwimmerModalOpen, setAddSwimmerModalOpen] = useState(false)
  const { data, isLoading, isError, isFetched } = useQuery(
    'associatedSwimmers',
    fetchAssociatedSwimmers,
  )

  return (
    <>
      {/*<OrderPageCreateSwimmerModal*/}
      {/*  open={addSwimmerModalOpen}*/}
      {/*  onClose={() => setAddSwimmerModalOpen(false)}*/}
      {/*  onAdd={() => {}}*/}
      {/*/>*/}
      <div className="inline-flex flex-col rounded-lg bg-white lg:col-span-5">
        <div className="px-6 py-4 gap-6 flex border-b-2 border-b-divider">
          <div className="flex-1 gap-1 flex flex-col flex-grow">
            <p className="text-xl font-semibold">Priradené osoby</p>
            <p>Pridajte do profilu osoby a zakúpte pre ne lístky a permanentky.</p>
          </div>
          <Button
            className="self-start"
            disabled={!isFetched}
            onClick={() => setAddSwimmerModalOpen(true)}
          >
            <Icon className="mr-2" name="plus" color="white" /> Pridať
          </Button>
        </div>

        {isLoading && (
          <div className="flex justify-center p-6">
            <Spinner />
          </div>
        )}
        {data && (
          <div className="gap-3 flex flex-col p-6">
            {data.data.associatedSwimmers.map((swimmer) => (
              <div
                className="px-4 py-3 gap-4 flex items-center h-20 rounded-lg bg-backgroundGray"
                key={swimmer.id}
              >
                <div
                  className="h-14 w-12 bg-cover bg-center rounded-lg bg-backgroundGray"
                  style={{
                    backgroundImage: swimmer.image ? `url(${swimmer.image})` : undefined,
                  }}
                ></div>
                {/*<Image className="h-14 w-[48.8447265625px]" />*/}
                <div className="flex flex-col flex-grow">
                  <p className="font-semibold">
                    {swimmer.firstname} {swimmer.lastname}
                  </p>
                  <p className="text-sm">{swimmer.age}</p>
                </div>
                <Icon name="three-dots" />
                {/*<UITri_bodky_hor className="w-6 " />*/}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default ProfilePageSwimmers
