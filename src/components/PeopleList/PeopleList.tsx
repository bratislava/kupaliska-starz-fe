import React from "react";
import "./PeopleList.css";
import { PersonComponent } from "../";
import { AssociatedSwimmer } from "../../store/associatedSwimmers/api";

/**
 * Profile
 *  - Hover text: Upraviť údaje
 *  - Right remove corner icon
 *  - Add person text: "Pridať ďaľšiu osobu"
 *  - Grey border
 *
 *  BuyPageDisplay
 *   - No hover
 *   - Right remove corner icon
 *   - Add person text: "Pridať ďaľšiu osobu"
 *   - Blue border
 *
 *    BuyPageSelection
 *   - No hover
 *   - Right checkmark corner icon when selected
 *   - Add person text: "Pridať osobu do proflu"
 *   - Grey border, green if selected
 */
export enum PeopleListMode {
  Profile = "Profile",
  BuyPageDisplay = "BuyPageDisplay",
  BuyPageSelection = "BuyPageSelection",
}

interface PeopleListProps {
  people: Partial<AssociatedSwimmer>[];
  selectedPeopleIds?: (null | string)[];
  mode: PeopleListMode;
  onPersonClick?: (person: Partial<AssociatedSwimmer>) => void;
  onRemoveClick?: (person: Partial<AssociatedSwimmer>) => void;
  onAddClick?: () => void;
}

const PeopleList = ({
  people,
  mode,
  onPersonClick = () => {},
  onRemoveClick = () => {},
  onAddClick = () => {},
  selectedPeopleIds,
}: PeopleListProps) => {
  return (
    <div className="flex overflow-x-auto pt-4">
      <div className="flex gap-x-8">
        {(people || [] as AssociatedSwimmer[]).map((person, index) => (
          <PersonComponent
            key={index}
            person={person}
            mode={mode}
            onPersonClick={onPersonClick}
            onRemoveClick={onRemoveClick}
            isSelected={
              mode === PeopleListMode.BuyPageSelection &&
              person.id !== undefined ?
              selectedPeopleIds?.includes(person.id) : false
            }
          ></PersonComponent>
        ))}
        <div
          className="person-box border-solid border-blueish border-3 rounded-lg bg-white flex py-8 px-6 flex-col justify-between items-center cursor-pointer"
          onClick={() => onAddClick()}
        >
          <img className="w-12 h-12" src="/person-add.svg" alt="" />
          <span className="text-center">
            {(mode === PeopleListMode.Profile ||
              mode === PeopleListMode.BuyPageDisplay) &&
              "Pridať ďalšiu osobu"}
            {mode === PeopleListMode.BuyPageSelection &&
              "Pridať osobu do profilu"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PeopleList;
