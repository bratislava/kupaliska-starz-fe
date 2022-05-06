import React, { ReactNode } from "react";

import "./TicketBuyDiagramCard.css";

interface TicketBuyDiagramCardProps {
  imgSrc: string;
  text?: ReactNode | string;
  index: number;
}

const TicketBuyDiagramCard = ({
  imgSrc,
  text,
  index,
}: TicketBuyDiagramCardProps) => {
  return (
    <div className="relative rounded-lg border-secondary border-3 gap-8 shadow-lg bg-white grid grid-rows-12 flex-col flex-1 w-full mt-8 px-4 pt-16 pb-4 ticket-diagram-card">
      <div className="index-indicator absolute rounded-full text-primary flex items-center justify-center text-3xl xs:text-4xl 2xl:text-4xl font-bold bg-secondary left-0 right-0 mx-auto">
        {index}
      </div>
      <div
        className="row-span-6 card-img"
        style={{ backgroundImage: `url(${imgSrc})` }}
      />
      {text && (
        <div className="row-span-6 text-center">
          {typeof text === "string" ? <p>{text}</p> : text}
        </div>
      )}
    </div>
  );
};

export default TicketBuyDiagramCard;
