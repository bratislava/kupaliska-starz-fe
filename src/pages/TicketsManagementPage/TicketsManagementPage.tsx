import React from "react";
import { Button, ProfileNavBar } from "components";
import { useTranslation } from "react-i18next";
import MobileCarousel from "../../components/MobileCarousel/MobileCarousel";
import cx from "classnames";

interface TicketProps {
    type: "blue" | "blueish" | "white";
}

const Ticket = ({ type }: TicketProps) => {
    const textClass = { blue: "text-white", blueish: "text-primary", white: "text-primary" }[type];
    const backgroundClass = { blue: "bg-primary", blueish: "bg-blueish", white: "bg-white" }[type];

    return (
        <div className={`flex p-6 flex items-center flex-col rounded-lg shadow-xs ${textClass} ${backgroundClass}`}>
            <span className="font-bold text-2xl mb-1">STARZ</span>
            <img alt="" src="/mock-qrcode.png" className="mb-6" />
            <span className="font-semibold mb-3 text-xl text-center">Sezónna permanentka</span>
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
        <div className="container mx-auto">
            {/* TODO: use border-spacing in Tailwind 3.1 */}
            <table className="table-auto w-full hidden md:table" style={{ borderSpacing: "10px" }}>
                <thead>
                <tr>
                    {headers.map((header, index) => {
                        const first = index === 0;
                        const last = index === headers.length - 1;
                        return (
                            <th key={index} className={cx("py-4", { "text-left pl-10": first, "pr-10": last })}>
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
                        {rowIndex !== rows.length - 1 && <tr style={{ height: "40px" }}></tr>}
                    </React.Fragment>
                ))}
                </tbody>
            </table>
        </div>
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
        <section className="w-full">
            <ProfileNavBar
                links={[
                    { url: "tickets-management", text: "Lístky a permanentky" },
                    { url: "person-management", text: "Osobné údaje" },
                ]}
            ></ProfileNavBar>
            <div className="text-center pb-2 md:pb-6 md:mt-14 text-xl md:text-2xl font-semibold">Aktívne</div>
            <Table
                headers={["Typ lístka", "Zostáva vstupov", "Držiteľ permanentky", ""]}
                rows={[
                    ["Sezónna permanentka", "8", "Janko Hráško", "viac informácii"],
                    ["Sezónna permanentka", "8", "Janko Hráško", "viac informácii"],
                    ["Sezónna permanentka", "8", "Janko Hráško", "viac informácii"],
                ]}
                rowBackgroundClass="bg-blueish"
            ></Table>

            <MobileCarousel className="md:hidden mb-10">
                <Ticket type={"blue"}></Ticket>
                <Ticket type={"blueish"}></Ticket>
                <Ticket type={"white"}></Ticket>
            </MobileCarousel>

            <div className="text-center pb-2 md:pb-6 md:mt-24 text-xl md:text-2xl font-semibold">Využité</div>

            <Table
                headers={["Typ lístka", "Využitý dňa", "Cena", ""]}
                rows={[
                    ["Sezónna permanentka", "8", "Janko Hráško", "viac informácii"],
                    ["Sezónna permanentka", "8", "Janko Hráško", "viac informácii"],
                    ["Sezónna permanentka", "8", "Janko Hráško", "viac informácii"],
                ]}
                rowBackgroundClass="bg-white"
            ></Table>

            <MobileCarousel className="md:hidden mb-10">
                <UsedTicket></UsedTicket>
                <UsedTicket></UsedTicket>
            </MobileCarousel>
        </section>
    );
};

export default TicketsManagementPage;
