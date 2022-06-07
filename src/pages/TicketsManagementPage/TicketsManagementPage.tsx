import React from "react";
import { Button, Modal, ProfileNavBar } from "components";
import { useTranslation } from "react-i18next";
import MobileCarousel from "../../components/MobileCarousel/MobileCarousel";
import cx from "classnames";
import ProfileLine from "../../components/ProfileLine/ProfileLine";

const TicketsManagementModal = ({
  open = false,
  onClose,
}: {
  open: boolean;
  onClose: any;
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
                <span className="font-semibold">Danko Hraško</span>
              </div>
              <div className="mr-8">
                Cena: <span className="font-semibold">34€</span>
              </div>
              <div className="mr-8">
                Počet zostavajúcich vstupov:{" "}
                <span className="font-semibold">4</span>
              </div>
            </div>
          </div>
          <div>
            <img alt="" src="/mock-qrcode.png" width={120} height={120} />
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
            <tr>
              <td className="pb-5">Tehelné Pole</td>
              <td className="pb-5">22. 8. 2022</td>
              <td className="pb-5">10:28</td>
              <td className="pb-5">15:02</td>
            </tr>
            <tr>
              <td className="pb-5">Tehelné Pole</td>
              <td className="pb-5">22. 8. 2022</td>
              <td className="pb-5">10:28</td>
              <td className="pb-5">15:02</td>
            </tr>
            <tr>
              <td className="pb-5">Tehelné Pole</td>
              <td className="pb-5">22. 8. 2022</td>
              <td className="pb-5">10:28</td>
              <td className="pb-5">15:02</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="md:hidden text-primary h-full mb-5">
        <div className="pt-8 px-6 pb-5 bg-blueish rounded-t-lg">
          <div className="pb-4 font-bold text-xl">Prehľad návštev kúpalísk</div>
          <div className="pb-3">
            Držiteľ/ka permanentky:{" "}
            <span className="font-semibold">Danko Hraško</span>
          </div>
          <div className="pb-3">
            Cena: <span className="font-semibold">34€</span>
          </div>
          <div className="">
            Počet zostavajúcich vstupov:{" "}
            <span className="font-semibold">4</span>
          </div>
        </div>
        <div className="h-0.5 bg-primary opacity-30 rounded mx-6"></div>
        <div className="px-6 py-4">
          {[1, 2, 3, 4, 5, 6].map(() => (
            <>
              {" "}
              <div className="grid grid-cols-2 gap-y-3">
                <div className="col-span-2">
                  <div className="mb-1">Miesto</div>
                  <div>Tehelné Pole</div>
                </div>
                <div className="col-span-2">
                  <div className="mb-1">Dátum</div>
                  <div>22. 8. 2022</div>
                </div>
                <div>
                  <div className="mb-1">Čas príchodu</div>
                  <div>12:00</div>
                </div>
                <div>
                  <div className="mb-1">Čas odchodu</div>
                  <div>12:00</div>
                </div>
              </div>
              <div className="h-0.5 bg-primary opacity-30 rounded my-4"></div>
            </>
          ))}
        </div>
      </div>
    </Modal>
  );
};
interface TicketProps {
  type: "blue" | "blueish" | "white";
}

const Ticket = ({ type }: TicketProps) => {
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

  return (
    <div
      className={`flex p-6 flex items-center flex-col rounded-lg shadow-xs ${textClass} ${backgroundClass}`}
    >
      <span className="font-bold text-2xl mb-1">STARZ</span>
      <img alt="" src="/mock-qrcode.png" className="mb-6" />
      <span className="font-semibold mb-3 text-xl text-center">
        Sezónna permanentka
      </span>
      <span className="text-center">Janko Hraško</span>
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
            <tr className={`${rowBackgroundClass} px-10 py-5 shadow-xs`}>
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

const UsedTicket = () => {
  return (
    <div className="flex px-8 py-6 mb-6 flex-col rounded-lg shadow-xs">
      <div className="flex flex-col pb-6">
        <span>Typ lístka</span>
        <span className="font-semibold text-xl">Permanentka</span>
      </div>
      <div className="flex flex-col pb-6">
        <span>Typ lístka</span>
        <span className="font-semibold text-xl">Permanentka</span>
      </div>
      <div className="flex flex-col pb-6">
        <span>Typ lístka</span>
        <span className="font-semibold text-xl">Permanentka</span>
      </div>
      <div className="flex flex-col pb-6">
        <span>Typ lístka</span>
        <span className="font-semibold text-xl">Permanentka</span>
      </div>
      <div className="flex justify-center">
        <Button color="blueish" className="absolute shadow-xs">
          Zobraziť detail
        </Button>
      </div>
    </div>
  );
};

const TicketsManagementPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <TicketsManagementModal
        open={false}
        onClose={() => {}}
      ></TicketsManagementModal>
      <section className="w-full">
        <ProfileNavBar></ProfileNavBar>
        <div className="container mx-auto">
          {" "}
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
            rows={[
              ["Sezónna permanentka", "8", "Janko Hráško", "viac informácii"],
              ["Sezónna permanentka", "8", "Janko Hráško", "viac informácii"],
              ["Sezónna permanentka", "8", "Janko Hráško", "viac informácii"],
            ]}
            rowBackgroundClass="bg-blueish"
          ></Table>
        </div>
        {/* todo cannot be in container */}
        <MobileCarousel className="md:hidden mb-10">
          <Ticket type={"blue"}></Ticket>
          <Ticket type={"blueish"}></Ticket>
          <Ticket type={"white"}></Ticket>
        </MobileCarousel>
        <div className="container mx-auto">
          <div className="text-center pb-2 md:pb-6 md:mt-24 text-xl md:text-2xl font-semibold">
            Využité
          </div>

          <Table
            headers={["Typ lístka", "Využitý dňa", "Cena", ""]}
            rows={[
              ["Sezónna permanentka", "8", "Janko Hráško", "viac informácii"],
              ["Sezónna permanentka", "8", "Janko Hráško", "viac informácii"],
              ["Sezónna permanentka", "8", "Janko Hráško", "viac informácii"],
            ]}
            rowBackgroundClass="bg-white"
          ></Table>
        </div>
        {/* todo cannot be in container */}
        <MobileCarousel className="md:hidden mb-10">
          <UsedTicket></UsedTicket>
          <UsedTicket></UsedTicket>
        </MobileCarousel>
      </section>
    </>
  );
};

export default TicketsManagementPage;
