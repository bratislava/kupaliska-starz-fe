import React, { useMemo, useState } from "react";
import { Button, Icon, Modal, ProfileNavBar } from "components";
import { useTranslation } from "react-i18next";
import MobileCarousel from "../../components/MobileCarousel/MobileCarousel";
import cx from "classnames";
import ProfileLine from "../../components/ProfileLine/ProfileLine";
import {
  fetchTicketsHistory,
  TicketFromHistory,
} from "../../store/tickets-history/api";
import { useQuery } from "react-query";
import { partition } from "lodash";

const formatDate = (timestamp: number) =>
  new Date(timestamp).toLocaleDateString("sk-SK");
const formatTime = (timestamp: number) =>
  new Date(timestamp).toLocaleTimeString("sk-SK", {
    hour: "2-digit",
    minute: "2-digit",
  });

const TicketsManagementModal = ({
  open = false,
  onClose,
  ticket,
}: {
  open: boolean;
  onClose: any;
  ticket: TicketFromHistory | null;
}) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      button={
        <Button onClick={onClose} className="px-10">
          Skryť detail
        </Button>
      }
      modalClassName="w-full md:w-max"
    >
      {ticket && (
        <>
          <div
            className="hidden md:block p-10 text-primary w-screen"
            style={{ maxWidth: "1000px" }}
          >
            <div className="flex mb-5">
              <div className="flex flex-col justify-between flex-1">
                <div className="font-bold mt-4">Prehľad návštev kúpalísk</div>
                <div className="flex justify-between">
                  <div className="mr-8">
                    Držiteľ/ka permanentky:{" "}
                    <span className="font-semibold">{ticket.ownerName}</span>
                  </div>
                  <div className="mr-8">
                    Cena:{" "}
                    <span className="font-semibold">{ticket.price} €</span>
                  </div>
                  {ticket.remainingEntries != null &&
                    ticket.remainingEntries !== 0 && (
                      <div className="mr-8">
                        Počet zostavajúcich vstupov:
                        <span className="font-semibold">
                          {ticket.remainingEntries}
                        </span>
                      </div>
                    )}
                </div>
              </div>
              <div>
                <img alt="" src={ticket.qrCode} width={120} height={120} />
              </div>
            </div>
            <div className="w-full h-0.5 bg-primary opacity-30 rounded"></div>
            <table className="table-auto w-full">
              <thead>
                <tr className="opacity-50 text-left">
                  <th className="font-medium py-10">Miesto</th>
                  <th className="font-medium py-10">Dátum</th>
                  <th className="font-medium py-10">Čas príchodu</th>
                  <th className="font-medium py-10">Čas odchodu</th>
                </tr>
              </thead>
              <tbody>
                {ticket.entries?.length > 0 ? (
                  ticket.entries.map((entry, index) => (
                    <tr key={index}>
                      <td className="pb-5">{entry.poolName}</td>
                      <td className="pb-5">
                        {entry.from && formatDate(entry.from)}
                      </td>
                      <td className="pb-5">
                        {entry.from && formatTime(entry.from)}
                      </td>
                      <td className="pb-5">
                        {entry.to && formatTime(entry.to)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4}>
                      Pre zobrazený lístok neexistujú žiadne návštevy.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="md:hidden text-primary h-full mb-5">
            <div className="pt-8 px-6 pb-5 bg-blueish rounded-t-lg">
              <div className="pb-4 font-bold text-xl">
                Prehľad návštev kúpalísk
              </div>
              <div className="pb-3">
                Držiteľ/ka permanentky:{" "}
                <span className="font-semibold">{ticket.ownerName}</span>
              </div>
              <div className="pb-3">
                Cena: <span className="font-semibold">{ticket.price} €</span>
              </div>
              {ticket.remainingEntries != null &&
                ticket.remainingEntries !== 0 && (
                  <div>
                    Počet zostavajúcich vstupov:
                    <span className="font-semibold">
                      {ticket.remainingEntries}
                    </span>
                  </div>
                )}
            </div>
            <div className="h-0.5 bg-primary opacity-30 rounded mx-6"></div>
            <div className="px-6 py-4">
              {ticket.entries.length === 0 &&
                "Pre zobrazený lístok neexistujú žiadne návštevy."}
              {ticket.entries.map((entry, index) => (
                <React.Fragment key={index}>
                  <div className="grid grid-cols-2 gap-y-3">
                    <div className="col-span-2">
                      <div className="mb-1">Miesto</div>
                      <div>{entry.poolName}</div>
                    </div>
                    <div className="col-span-2">
                      <div className="mb-1">Dátum</div>
                      <div> {entry.from && formatDate(entry.from)}</div>
                    </div>
                    <div>
                      <div className="mb-1">Čas príchodu</div>
                      <div>{entry.from && formatTime(entry.from)}</div>
                    </div>
                    <div>
                      <div className="mb-1">Čas odchodu</div>
                      <div>{entry.to && formatTime(entry.to)}</div>
                    </div>
                  </div>
                  <div className="h-0.5 bg-primary opacity-30 rounded my-4"></div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </>
      )}
    </Modal>
  );
};
interface TicketProps {
  type: "blue" | "blueish" | "white";
  ticket: TicketFromHistory;
  onDetailClick: () => void;
}

const Ticket = ({ type, ticket, onDetailClick }: TicketProps) => {
  const textClass = {
    blue: "text-white",
    blueish: "text-primary",
    white: "text-primary",
  }[type];
  const backgroundClass = {
    blue: "bg-primary",
    blueish: "bg-blueish",
    white: "bg-white",
  }[type];
  const buttonColor = (
    {
      blue: "white",
      blueish: "primary",
      white: "primary",
    } as const
  )[type];

  return (
    <div
      className={`flex p-6 mb-6 items-center flex-col rounded-lg shadow-xs overflow-auto ${textClass} ${backgroundClass}`}
    >
      <span className="font-bold text-2xl mb-1">STARZ</span>
      <img alt="" src={ticket.qrCode} className="mb-6" />
      <span className="font-semibold mb-3 text-xl text-center">
        {ticket.type}
      </span>
      <span className="text-center mb-6">{ticket.ownerName}</span>
      <div className="flex justify-center">
        <Button
          color={buttonColor}
          className="absolute shadow-xs"
          onClick={onDetailClick}
        >
          Detail lístku
          <Icon className="ml-4" name="arrow-left" />
        </Button>
      </div>
    </div>
  );
};

interface TableProps {
  headers: React.ReactNode[];
  rows: React.ReactNode[][];
  rowBackgroundClass: string;
}

const Table = ({ headers, rows, rowBackgroundClass }: TableProps) => {
  return (
    <table
      className="table-auto w-full hidden md:table"
      style={{ borderSpacing: "10px" }}
    >
      <thead>
        <tr>
          {headers.map((header, index) => {
            const first = index === 0;
            const last = index === headers.length - 1;
            return (
              <th
                key={index}
                className={cx("py-4", {
                  "text-left pl-10": first,
                  "pr-10": last,
                })}
              >
                {header}
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => (
          <React.Fragment key={rowIndex}>
            <tr
              className={`${rowBackgroundClass} px-10 py-5 shadow-xs rounded-lg`}
            >
              {row.map((column, columnIndex) => {
                const first = columnIndex === 0;
                const last = columnIndex === row.length - 1;

                return (
                  <td
                    key={columnIndex}
                    className={cx("py-5", {
                      "rounded-l-lg pl-10": first,
                      "text-center": !first,
                      "rounded-r-lg pr-10": last,
                    })}
                  >
                    {column}
                  </td>
                );
              })}
            </tr>
            {rowIndex !== rows.length - 1 && (
              <tr style={{ height: "40px" }}></tr>
            )}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
};

const UsedTicket = ({
  ticket,
  onDetailClick,
}: {
  ticket: TicketFromHistory;
  onDetailClick: () => void;
}) => {
  return (
    <div className="flex px-8 py-6 mb-6 flex-col rounded-lg shadow-xs bg-white">
      <div className="flex flex-col pb-6">
        <span>Typ lístka</span>
        <span className="font-semibold text-xl">{ticket.type}</span>
      </div>
      <div className="flex flex-col pb-6">
        <span>Využitý dňa</span>
        <span className="font-semibold text-xl">
          {ticket.entries[0] &&
            ticket.entries[0].from &&
            formatDate(ticket.entries[0].from)}
        </span>
      </div>
      <div className="flex flex-col pb-6">
        <span>Cena</span>
        <span className="font-semibold text-xl">{ticket.price} €</span>
      </div>
      <div className="flex justify-center">
        <Button
          color="blueish"
          className="absolute shadow-xs"
          onClick={onDetailClick}
        >
          Viac informacií
          <Icon className="ml-4" name="arrow-left" />
        </Button>
      </div>
    </div>
  );
};

const TicketsManagementPage = () => {
  const { t } = useTranslation();
  const ticketsQuery = useQuery("tickets", fetchTicketsHistory);
  const [openedTicketDetail, setOpenedTicketDetail] =
    useState<TicketFromHistory | null>(null);

  const dataMapped = useMemo(() => {
    if (!ticketsQuery.data) {
      return;
    }

    const [activeTickets, usedTickets] = partition(
      ticketsQuery.data.data,
      (ticket) => ticket.remainingEntries !== 0
    );

    const activeTicketsRows = activeTickets.map((ticket) => [
      ticket.type,
      ticket.remainingEntries,
      ticket.ownerName,
      // eslint-disable-next-line react/jsx-key,jsx-a11y/anchor-is-valid
      <a
        role="button"
        onClick={() => setOpenedTicketDetail(ticket)}
        className="underline text-primary font-semibold"
      >
        viac informácii
      </a>,
    ]);

    const usedTicketsRows = usedTickets.map((ticket) => {
      const lastEntry = ticket.entries[0];
      return [
        ticket.type,
        lastEntry?.from && formatDate(lastEntry.from),
        lastEntry?.poolName,
        // eslint-disable-next-line react/jsx-key,jsx-a11y/anchor-is-valid
        <a
          role="button"
          onClick={() => setOpenedTicketDetail(ticket)}
          className="underline text-primary font-semibold"
        >
          viac informácii
        </a>,
      ];
    });

    return { activeTickets, usedTickets, activeTicketsRows, usedTicketsRows };
  }, [ticketsQuery.data]);

  const handleModalClose = () => {
    setOpenedTicketDetail(null);
  };

  return (
    <>
      <TicketsManagementModal
        open={Boolean(openedTicketDetail)}
        ticket={openedTicketDetail}
        onClose={handleModalClose}
      ></TicketsManagementModal>
      {dataMapped && (
        <section className="w-full">
          <ProfileNavBar></ProfileNavBar>
          <div className="container mx-auto">
            <ProfileLine></ProfileLine>
            <div className="text-center pb-2 md:pb-6 md:mt-14 text-xl md:text-2xl font-semibold">
              Aktívne
            </div>
            <Table
              headers={[
                "Typ lístka",
                "Zostáva vstupov",
                "Držiteľ permanentky",
                "",
              ]}
              rows={dataMapped.activeTicketsRows}
              rowBackgroundClass="bg-blueish"
            ></Table>
          </div>
          {/* todo cannot be in container */}
          <MobileCarousel className="md:hidden mb-10">
            {dataMapped.activeTickets.map((ticket, index) => (
              <Ticket
                key={index}
                type={"blue"}
                ticket={ticket}
                onDetailClick={() => setOpenedTicketDetail(ticket)}
              ></Ticket>
            ))}
          </MobileCarousel>
          <div className="container mx-auto">
            <div className="text-center pb-2 md:pb-6 md:mt-24 text-xl md:text-2xl font-semibold">
              Využité
            </div>

            <Table
              headers={["Typ lístka", "Využitý dňa", "Miesto návštevy", ""]}
              rows={dataMapped.usedTicketsRows}
              rowBackgroundClass="bg-white"
            ></Table>
          </div>
          {/* todo cannot be in container */}
          <MobileCarousel className="md:hidden mb-10">
            {dataMapped.usedTickets.map((ticket, index) => (
              <UsedTicket
                key={index}
                ticket={ticket}
                onDetailClick={() => setOpenedTicketDetail(ticket)}
              ></UsedTicket>
            ))}
          </MobileCarousel>
        </section>
      )}
    </>
  );
};

export default TicketsManagementPage;
