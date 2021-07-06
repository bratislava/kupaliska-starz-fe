import React, { useEffect, useState } from "react";

import { SwimmingPool } from "models";

import { Button, Icon, Typography, Spinner } from "components";

import "./SwimmingPoolInfoCard.css";
import { useWindowSize } from "hooks";

interface SwimmingPoolInfoCardProps {
  swimmingPool: SwimmingPool;
  onActionButtonClick?: (swimmingPool: SwimmingPool) => boolean;
  modal?: boolean;
  className?: string;
}

const SwimmingPoolInfoCard = ({
  swimmingPool,
  onActionButtonClick = (pool: SwimmingPool) => {
    return true;
  },
  modal = false,
  className = "",
}: SwimmingPoolInfoCardProps) => {
  const [_expanded, setExpanded] = useState<boolean>(modal);
  const { width } = useWindowSize();
  const _onActionButtonClick = () => {
    const shouldExpand =
      onActionButtonClick && onActionButtonClick(swimmingPool);
    if (shouldExpand) {
      setExpanded(!_expanded);
    }
  };

  useEffect(() => {
    if (width && width >= 768) {
      setExpanded(false);
    }
  }, [width]);
  return (
    <div
      className={`${className} grid bg-white swimming-pool-card__container ${
        modal ? "rounded-lg shadow-lg" : ""
      } bg-transparent`}
    >
      <div className={`sm:rounded-none row-span-1 rounded-t-lg relative`}>
        <img
          className={`swimming-pool-card__image rounded-t-lg md:rounded-lg ${
            !modal ? "md:shadow-lg" : ""
          } relative`}
          src={
            swimmingPool.image
              ? swimmingPool.image.originalFile
              : "/kupalisko-delfin.png"
          }
          alt={
            swimmingPool.image
              ? swimmingPool.image.altText
              : "Nahradny obrazok kupaliska"
          }
        />
        <div
          className={`${
            !modal ? "md:hidden" : ""
          } wave-overlay absolute inset-0`}
        />
      </div>
      <div
        className={`${
          modal ? "text-center px-12 2xl:px-16" : "pb-4 px-4"
        } row-span-11 pt-4 flex-col flex`}
      >
        <Typography type="subtitle" fontWeight="bold" color="primary">
          {swimmingPool.name}
        </Typography>
        {!(_expanded || modal) ||
        (swimmingPool.expandedDescription && swimmingPool.waterTemp) ? (
          <div className="flex-1">
            <p className="my-4 whitespace-pre-wrap">
              {_expanded || modal
                ? swimmingPool.expandedDescription
                : swimmingPool.description}
            </p>
            {(_expanded || modal) && (
              <div className={`flex-col flex ${modal ? "items-center" : ""}`}>
                <>
                  <div
                    className={`flex flex-col md:w-7/10 ${
                      modal ? "items-center" : ""
                    }`}
                  >
                    {swimmingPool.openingHours &&
                      swimmingPool.openingHours.map((line, index) => (
                        <div
                          key={line.intervalString}
                          className={`flex w-9/10 text-primary mt-4`}
                        >
                          <div className="flex flex-col justify-center text-left font-bold">
                            {line.intervalString}
                          </div>
                          <div className="flex flex-1 ml-4">
                            <div className="flex flex-col text-left">
                              {line.dayStrings.map((dayStr) => (
                                <span
                                  key={dayStr.day}
                                  className={`text-left text-${dayStr.color}`}
                                >
                                  {dayStr.day}
                                </span>
                              ))}
                            </div>
                            <div className="flex flex-col flex-1 items-end">
                              <div className="flex flex-col">
                                {line.dayStrings.map((dayStr, index) => (
                                  <span
                                    className={`text-center text-${dayStr.color}`}
                                    key={`${dayStr.time}-${index}`}
                                  >
                                    {dayStr.time}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                  <div
                    className={`flex flex-wrap justify-center ${
                      modal ? "md:justify-center" : "md:justify-start"
                    } items-center my-4`}
                  >
                    {swimmingPool.facilities &&
                      swimmingPool.facilities.map((facility) => (
                        <div
                          key={facility}
                          className="my-1 mr-1 rounded p-2 border-2-softGray"
                        >
                          <Icon name={facility} color="secondary" />
                        </div>
                      ))}
                  </div>
                  <div
                    className={`flex justify-center ${
                      modal ? "md:justify-center" : "md:justify-start"
                    } items-center mb-4 text-secondary`}
                  >
                    <Icon
                      className="text-2xl mr-2"
                      name="waves"
                      color="secondary"
                    />
                    <span className="text-primary text-lg">
                      {swimmingPool.waterTemp}°
                    </span>
                  </div>
                </>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center text-xl">
            <div className="w-1/10 py-4">
              <Spinner />
            </div>
          </div>
        )}

        <div
          className={`${
            modal ? "w-7/10 xl:9/10 2xl:w-8/10" : ""
          } flex flex-col w-full xl:px-4 xs:flex-row  relative self-center justify-between`}
        >
          <Button
            thin
            onClick={_onActionButtonClick}
            className={`${
              modal ? "relative -bottom-4" : ""
            } flex-1 mb-4 xs:mb-0 xs:mr-2`}
          >
            {_expanded || modal ? "Menej info" : "Viac info"}
            <Icon name="info" className="xs:block ml-2" />
          </Button>
          <Button
            type="outlined"
            disabled={!swimmingPool.locationUrl}
            thin
            className={`${
              modal ? "relative -bottom-4" : ""
            } flex-1 bg-white xs:ml-2`}
          >
            <a
              href={swimmingPool.locationUrl}
              target="_blank"
              rel="noreferrer nopener"
              className="flex items-center"
            >
              Navigovať
              <div className="ml-2">
                <Icon name="navigate" color="primary" className="xs:block" />
              </div>
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SwimmingPoolInfoCard;
