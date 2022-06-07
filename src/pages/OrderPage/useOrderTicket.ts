import { useMemo } from "react";
import { useAppSelector } from "../../hooks";
import { selectAvailableTickets } from "../../store/global";
import { useHistory } from "react-router-dom";
import { useAccount } from "@azure/msal-react";
import { Ticket } from "../../models";

/* Retrieves the ticket id from history state, gets the ticket, redirects if necessary and return the info needed. */
export const useOrderTicket = () => {
  const tickets = useAppSelector(selectAvailableTickets);
  const account = useAccount();
  const history = useHistory<{ ticketId?: string }>();
  const hasAccount = Boolean(account);

  return useMemo(() => {
    const ticketId = history.location.state?.ticketId;
    if (!ticketId) {
      history.push("/");
      return {};
    }

    const ticket = tickets.find((t: Ticket) => t.id === ticketId);
    if (!ticket) {
      history.push("/");
      return {};
    }

    const requiresLoginAndIsNotLoggedIn = ticket.nameRequired && !hasAccount;
    if (requiresLoginAndIsNotLoggedIn) {
      history.push("/");
      return {};
    }

    const requireEmail = !Boolean(account);
    const hasOptionalFields = !ticket.nameRequired && !account;
    const hasSwimmers = ticket.nameRequired;
    const hasTicketAmount = !ticket.nameRequired;
    return {
      ticket,
      requireEmail,
      hasOptionalFields,
      hasSwimmers,
      hasTicketAmount,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
