import React, { ReactNode, useCallback, useState } from "react";
import { useSwipeable } from "react-swipeable";

import "./MobileCarousel.css";

interface MobileCarouselProps {
  children: ReactNode[];
  className?: string;
}

const MobileCarousel = ({ children, className }: MobileCarouselProps) => {
  const [active, setActive] = useState<number>(0);
  const handlers = useSwipeable({
    onSwipedLeft: () => changeActive(1),
    onSwipedRight: () => changeActive(-1),
  });

  const changeActive = useCallback(
    (delta: -1 | 1) => {
      if (delta === -1 && active > 0) {
        setActive(active + delta);
      }
      if (delta === 1 && active < children.length - 1) {
        setActive(active + delta);
      }
    },
    [active, children]
  );

  return (
    <div
      {...handlers}
      className={`overflow-x-hidden w-full relative ${className}`}
    >
      <div className="flex flex-row flex-nowrap">
        {children.map((child, index) => {
          let positionClassName = "";
          if (index === active) {
            positionClassName = "active";
          } else if (index === active - 1) {
            positionClassName = "active-left absolute";
          } else if (index === active + 1) {
            positionClassName = "active-right absolute";
          } else if (index < active - 1) {
            positionClassName = "inactive-left absolute";
          } else if (index > active + 1) {
            positionClassName = "inactive-right absolute";
          }
          return (
            <div
              key={index}
              className={`flex flex-col transition-all mx-auto p-4 bg-white ${positionClassName}`}
              style={{
                width: "70vw",
              }}
            >
              {child}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MobileCarousel;
