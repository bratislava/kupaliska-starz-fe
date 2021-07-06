import React, { useEffect, useState } from "react";

import { Typography, Button, InputField } from "components";

import { Ticket } from "models";
import { getPrice } from "helpers/general";

interface TicketCardProps {
  ticket: Ticket;
  className?: string;
  initialAmount?: number;
  onInputValueChange?: (val: number) => void;
  displayOnly?: boolean;
  discount?: number;
}

const TicketCard = ({
  ticket,
  className = "",
  initialAmount,
  onInputValueChange,
  displayOnly = false,
  discount,
}: TicketCardProps) => {
  const [_amount, _setAmount] = useState<number | string>(
    initialAmount ? initialAmount : 1
  );

  const onInputChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const val = parseInt(event.target.value);
    if (isNaN(val)) {
      _setAmount("");
    } else {
      _setAmount(val <= 1 ? 1 : val >= 10 ? 10 : val);
    }
  };

  useEffect(() => {
    onInputValueChange &&
      typeof _amount === "number" &&
      onInputValueChange(_amount);
  }, [_amount]);

  const onInputButtonPress = (delta: 1 | -1) => {
    if (typeof _amount === "string" && delta === 1) {
      _setAmount(1);
    } else if (
      typeof _amount === "number" &&
      ((delta === 1 && _amount < 10) || (delta === -1 && _amount > 1))
    ) {
      _setAmount(_amount + delta);
    }
  };

  return (
    <div
      className={`${className} transition-all rounded-lg overflow-hidden bg-white flex flex-col justify-between`}
    >
      <div
        className={`flex flex-col pt-6 px-3 xs:px-6 pb-4 rounded-t-lg justify-between border-2-softGray border-b-0`}
      >
        <Typography type="subtitle" fontWeight="bold">
          {`${_amount}x ${ticket.name}`}
        </Typography>
        <p className="text-lg pt-4">{ticket.description}</p>
      </div>
      <div
        className={`flex flex-wrap px-3 xs:px-6 py-4 gap-1 items-center justify-between bg-secondary`}
      >
        {ticket.type !== "SEASONAL" && !displayOnly && (
          <div className="flex items-center" style={{ width: "45%" }}>
            <Button
              onClick={() => onInputButtonPress(-1)}
              className="w-9"
              thin
              rounded
              disabled={_amount <= 1}
            >
              -
            </Button>
            <div className="w-12 xs:w-4/10 mx-1">
              <InputField
                value={_amount}
                onChange={onInputChange}
                thin
                max={10}
                type="number"
                inputClassName={"text-2xl font-bold text-center"}
                error={typeof _amount !== "number" ? "" : undefined}
              />
            </div>
            <Button
              onClick={() => onInputButtonPress(1)}
              className="w-9"
              thin
              rounded
              disabled={_amount >= 10}
            >
              +
            </Button>
          </div>
        )}
        <div
          className={`flex text-primary items-center ${
            ticket.type === "SEASONAL" || displayOnly
              ? "justify-start"
              : "xs:justify-end mt-2 xs:mt-0"
          } text-xl  md:text-2xl font-bold ${
            discount ? "w-full xs:w-5/10" : "w-5/10"
          }`}
        >
          <span className={discount ? "strikediag text-white" : ""}>
            {typeof _amount === "number"
              ? getPrice(ticket.price * _amount)
              : getPrice(ticket.price)}
            €
          </span>
          {discount && (
            <span className="ml-2">
              {typeof _amount === "number"
                ? getPrice(
                    ticket.price * _amount * (100 - discount) * 0.01
                  )
                : getPrice(ticket.price * (100 - discount) * 0.01)}
              €
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketCard;
