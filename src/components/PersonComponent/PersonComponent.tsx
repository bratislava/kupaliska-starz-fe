import React, { useRef } from "react";
import { useHover } from "usehooks-ts";
import cx from "classnames";
import { PeopleListMode } from "../PeopleList/PeopleList";

import "../PeopleList/PeopleList.css";
import { AssociatedSwimmer } from "../../store/associatedSwimmers/api";
import { useTranslation } from "react-i18next";

export enum PersonComponentMode {
  DisplayWithDescription = "DisplayWithDescription",
  DisplayOnlyPhoto = "DisplayOnlyPhoto",
}

interface PersonComponentProps {
  person: Partial<AssociatedSwimmer>;
  mode: PeopleListMode | PersonComponentMode;
  onPersonClick?: (person: Partial<AssociatedSwimmer>) => void;
  onRemoveClick?: (person: Partial<AssociatedSwimmer>) => void;
  isSelected?: boolean;
  errorBorder?: boolean;
  removeDisabled?: boolean;
}

/* TODO remove PeopleListMode.OrderPageDisplay */
const PersonComponent = ({
  person,
  mode,
  onPersonClick = () => {},
  onRemoveClick = () => {},
  isSelected,
  errorBorder = false,
  removeDisabled = false,
}: PersonComponentProps) => {
  const removeIconRef = useRef<HTMLImageElement>(null);
  const isRemoveIconHovered = useHover(removeIconRef);

  const { t } = useTranslation();

  const showRemoveIcon =
    (mode === PeopleListMode.Profile ||
      mode === PeopleListMode.OrderPageDisplay) &&
    !removeDisabled;
  const showCheckmarkIcon =
    mode === PeopleListMode.OrderPageSelection && isSelected;
  const showRightCorner = showRemoveIcon || showCheckmarkIcon;
  const hoverOverlay = mode === PeopleListMode.Profile && !isRemoveIconHovered;
  const showErrorBorder = errorBorder;
  const showPrimaryBorder =
    mode === PeopleListMode.OrderPageDisplay ||
    (mode === PeopleListMode.OrderPageSelection && !isSelected);
  const showGreenOverlay =
    mode === PeopleListMode.OrderPageSelection && isSelected;
  const showGreyBorder = [
    PeopleListMode.Profile,
    PersonComponentMode.DisplayOnlyPhoto,
    PersonComponentMode.DisplayWithDescription,
  ].includes(mode);
  const showDescription = [
    PeopleListMode.Profile,
    PeopleListMode.OrderPageSelection,
    PeopleListMode.OrderPageDisplay,
    PersonComponentMode.DisplayWithDescription,
  ].includes(mode);

  const handlePersonClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === removeIconRef.current) {
      return;
    }
    onPersonClick(person);
  };

  return (
    <div className="inline-flex flex-col items-center">
      <div
        className={cx(
          "person-box border-solid border-4 rounded-lg group relative bg-center bg-cover bg-no-repeat bg-white",
          { "cursor-pointer": hoverOverlay },
          { "border-primary": showPrimaryBorder && !showErrorBorder },
          { "border-primary": showGreenOverlay && !showErrorBorder },
          { "border-stone-300": showGreyBorder && !showErrorBorder },
          { "border-error": showErrorBorder }
        )}
        style={{
          backgroundImage: person.image ? `url(${person.image})` : undefined,
        }}
        onClick={handlePersonClick}
      >
        {/* As right corner icon also propagates hover to the parent, we need to hide the main hover effect programmatically */}
        {hoverOverlay && (
          <>
            <div className="absolute w-full h-full rounded-lg group-hover:bg-primary opacity-75 top-0 "></div>
            <div className="absolute w-full h-full rounded-lg top-0 hidden group-hover:grid place-content-center text-white">
              {t("person-component.edit-user")}
            </div>
          </>
        )}
        {showGreenOverlay && (
          <>
            <div className="absolute w-full h-full bg-primary opacity-80 top-0 "></div>
            <div className="absolute w-full h-full rounded-lg top-0 grid place-content-center text-white">
              {t("person-component.choosen")}
            </div>
          </>
        )}
        {showRightCorner && (
          <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2">
            {showRemoveIcon && (
              <img
                src="/red-cross-circle.svg"
                alt=""
                className="w-8 h-8 cursor-pointer"
                ref={removeIconRef}
                onClick={() => onRemoveClick(person)}
              />
            )}
            {showCheckmarkIcon && (
              <img src="/person-checkmark.svg" alt="" className="w-8 h-8" />
            )}
          </div>
        )}
      </div>
      {showDescription && (
        <>
          <div className="mt-2 text-center">
            {person.firstname} {person.lastname}
          </div>
          {/* TODO: sklonovanie */}
          <div className="mt-3 text-center">
            {t("person-component.age", { age: person.age })}
          </div>
        </>
      )}
    </div>
  );
};

export default PersonComponent;
