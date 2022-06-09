import React from "react";

import { Button, Icon, Typography } from "components";

import { Ticket } from "models";
import { useTranslation } from "react-i18next";
import { useIsAuthenticated } from "@azure/msal-react";
import { useHistory } from "react-router-dom";
import { useLogin } from "../../hooks/useLogin";

interface TicketCardProps {
  ticket: Ticket;
  className?: string;
  discount?: number;
}

const TicketCardHomePage = ({
  ticket,
  className = "",
  discount,
}: TicketCardProps) => {
  const { t } = useTranslation();
  const isAuthenticated = useIsAuthenticated();
  const history = useHistory();
  const login = useLogin();

  const needsLogin = ticket.nameRequired && !isAuthenticated;

  const handleClick = async () => {
    const orderLocation = {
      pathname: "/order",
      state: { ticketId: ticket.id },
    };

    if (needsLogin) {
      await login(orderLocation);
    } else {
      history.push(orderLocation);
    }
  };

  return (
    <div
      className={`${className} transition-all rounded-lg overflow-hidden bg-white flex flex-col justify-between border-2-softGray hover:border-primary hover:bg-blueish cursor-pointer`}
      onClick={handleClick}
    >
      <div
        className={`flex flex-col pt-6 px-3 xs:px-6 pb-4 rounded-t-lg justify-between`}
      >
        <Typography type="subtitle" fontWeight="bold">
          {ticket.name}
        </Typography>
        <p className="text-lg pt-4">{ticket.description}</p>
      </div>
      <div
        className={`flex flex-wrap px-3 xs:px-6 py-4 gap-1 items-center justify-between`}
      >
        <div
          className={`flex text-fontBlack
        items-center mt-2 xs:mt-0 text-xl  md:text-2xl font-bold w-5/10
          `}
        >
          <span className={discount ? "strikediag text-white" : ""}>
            {ticket.price.toFixed(2)}€
          </span>
          <div className="text-base font-normal ml-1">{t("landing.piece")}</div>
        </div>
        <Button className="xs:px-4 w-full mt-2 xs:mt-0 xs:w-auto">
          {needsLogin ? "Prihlásiť sa" : t("landing.basket")}
          <Icon name="shopping-cart" className="ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default TicketCardHomePage;
