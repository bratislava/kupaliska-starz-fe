import React from 'react'
import './PeopleList.css'
import { PersonComponent } from '../'
import { AssociatedSwimmer } from '../../store/associatedSwimmers/api'
import { useTranslation } from 'react-i18next'

/**
 * Profile
 *  - Hover text: Upraviť údaje
 *  - Right remove corner icon
 *  - Add person text: "Pridať ďaľšiu osobu"
 *  - Grey border
 *
 *  OrderPageDisplay
 *   - No hover
 *   - Right remove corner icon
 *   - Add person text: "Pridať ďaľšiu osobu"
 *   - Blue border
 *
 *    OrderPageSelection
 *   - No hover
 *   - Right checkmark corner icon when selected
 *   - Add person text: "Pridať osobu do proflu"
 *   - Grey border, green if selected
 */
export enum PeopleListMode {
  Profile = 'Profile',
  OrderPageDisplay = 'OrderPageDisplay',
  OrderPageSelection = 'OrderPageSelection',
}

interface PeopleListProps {
  people: Partial<AssociatedSwimmer>[]
  selectedPeopleIds?: (null | string)[]
  mode: PeopleListMode
  onPersonClick?: (person: Partial<AssociatedSwimmer>) => void
  onRemoveClick?: (person: Partial<AssociatedSwimmer>) => void
  onAddClick?: () => void
  removeDisabled?: boolean
}

/* TODO remove PeopleListMode.OrderPageDisplay */
const PeopleList = ({
  people,
  mode,
  onPersonClick = () => {},
  onRemoveClick = () => {},
  onAddClick = () => {},
  selectedPeopleIds,
  removeDisabled = false,
}: PeopleListProps) => {
  const { t } = useTranslation()

  return (
    <div className="flex overflow-x-auto pt-4">
      <div className="flex gap-x-8">
        {(people || ([] as AssociatedSwimmer[])).map((person, index) => (
          <PersonComponent
            key={index}
            person={person}
            mode={mode}
            onPersonClick={onPersonClick}
            onRemoveClick={onRemoveClick}
            isSelected={
              mode === PeopleListMode.OrderPageSelection && person.id !== undefined
                ? selectedPeopleIds?.includes(person.id)
                : false
            }
            removeDisabled={removeDisabled}
          ></PersonComponent>
        ))}
        <div
          className="person-box border-solid border-blueish border-4 rounded-lg bg-white flex py-4 px-6 flex-col justify-between items-center cursor-pointer"
          onClick={() => onAddClick()}
        >
          <img className="w-12 h-12" src="/person-add.svg" alt="" />
          <span className="text-center mt-2">
            {(mode === PeopleListMode.Profile || mode === PeopleListMode.OrderPageDisplay) &&
              t('profile.add-other-adult-kid')}
            {mode === PeopleListMode.OrderPageSelection && t('profile.add-others-to-profile')}
          </span>
        </div>
      </div>
    </div>
  )
}

export default PeopleList
