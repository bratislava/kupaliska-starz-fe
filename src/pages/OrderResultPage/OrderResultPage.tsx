import React, { useEffect, useState } from "react";

import { useLocation } from "react-router";
import qs from "qs";

import { Button, Icon, SectionHeader, Typography } from "components";
import { useAppDispatch, useWindowSize } from "hooks";
import { getFinalOrderDataActions } from "store/order";
import { HashLink } from "react-router-hash-link";
import { convertBase64ToBlob } from "helpers/general";

const OrderResultPage = () => {
  const dispatch = useAppDispatch();
  const { height } = useWindowSize();
  const location = useLocation();
  const [queryParams, setQueryParams] =
    useState<{
      success?: string;
      orderId?: string;
      orderAccessToken?: string;
    }>();
  const [ticketsPdf, setTicketsPdf] = useState<string | undefined>();
  // const [myTickets, setMyTickets] = useState<string[]>([]);
  // const [childrenTickets, setChildrenTickets] = useState<string[]>([]);

  useEffect(() => {
    setQueryParams(qs.parse(location.search.substring(1)));
  }, [location]);

  useEffect(() => {
    if (
      queryParams &&
      queryParams.success &&
      queryParams.orderId &&
      queryParams.orderAccessToken
    ) {
      dispatch(
        getFinalOrderDataActions({
          orderId: queryParams.orderId,
          accessToken: queryParams.orderAccessToken,
        })
      ).then((resp) => {
        if (resp.meta.requestStatus === "fulfilled") {
          setTicketsPdf(resp.payload.pdf);
          // setMyTickets(
          //   resp.payload.tickets.reduce(
          //     (
          //       arr: string[],
          //       ticket: { isChildren: boolean; qrCode: string }
          //     ) => (!ticket.isChildren ? [...arr, ticket.qrCode] : arr),
          //     []
          //   )
          // );
          // setChildrenTickets(
          //   resp.payload.tickets.reduce(
          //     (
          //       arr: string[],
          //       ticket: { isChildren: boolean; qrCode: string }
          //     ) => (ticket.isChildren ? [...arr, ticket.qrCode] : arr),
          //     []
          //   )
          // );
        }
      });
    }
  }, [queryParams]);

  const downloadTickets = async (ticketsPdfHref: string) => {
    const blob = convertBase64ToBlob(ticketsPdfHref, "application/pdf");

    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob);
      return;
    }

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Lístok na kúpaliská STaRZ";
    link.click();
  };

  // const noImageCondition = () => (childrenTickets.length > 4 || myTickets.length > 8);

  // const generateImageDisplayClasses = () => {
  //   if(childrenTickets.length > 4 || myTickets.length > 8) {
  //     return "hidden";
  //   } else {
  //     return "hidden lg:block"
  //   }
  // }

  // const getMyTicketsCols = () => {
  //   const minLength = Math.max(myTickets.length, 1)
  //   if(noImageCondition()) {
  //     return `lg:grid-cols-${Math.min(4, minLength)} xl:grid-cols-${Math.min(5, minLength)}`;
  //   } else {
  //     return `lg:grid-cols-${Math.min(3, minLength)} xl:grid-cols-${Math.min(4, minLength)}`;
  //   }
  // }

  // const getChildrenTicketsCols = () => {
  //   if(noImageCondition()) {
  //     return `lg:grid-cols-3 xl:grid-cols-5`;
  //   } else {
  //     return `lg:grid-cols-2`;
  //   }
  // }

  return (
    <main className="container mx-auto py-8 grid grid-cols-1 gap-4 lg:grid-cols-2 h-full">
      {queryParams?.success === "true" ? (
        <div
          className={`flex flex-col flex-1 justify-between md:justify-start`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1">
            <div>
              <SectionHeader title="Nákup úspešný" />
              <Typography type="subtitle" fontWeight="bold">
                Ďakujeme za váš nákup!
              </Typography>
              <p>Lístky nájdete vo svojej emailovej schránke.</p>
              <p className="text-sm">
                Prosím, preukážte sa zaslanými QR kódmi pri vstupe na kúpalisko.
              </p>
            </div>
            <div
              className={`hidden md:block lg:hidden col-span-1 bg-no-repeat bg-top bg-contain min-h-1/2vh`}
              style={{ backgroundImage: 'url("thankyou-image.png")' }}
            />
          </div>
          {/* <div className={`flex flex-col flex-1`}>
            <div className={`grid h-1/2 grid-cols-1 lg:grid-cols-3 ${noImageCondition() ? "xl:grid-cols-4" : ""}`}>
              <div className={`${childrenTickets.length > 0 ? "col-span-1" : "col-span-full"} grid ${getMyTicketsCols()} grid-cols-1 md:grid-cols-2`}>
                {myTickets.length > 0 &&
                  myTickets.map((ticket, index) => (
                    <div key={ticket} className="flex mt-4 flex-col w-full">
                      <div style={{ minHeight: "1.5rem" }}>
                        {index === 0
                          ? myTickets.length > 1
                            ? "Vaše lístky"
                            : "Váš lístok"
                          : ""}
                      </div>

                      <img
                        key={ticket}
                        src={ticket}
                        alt={`qr code of your childrens ticket ${index}`}
                      />
                    </div>
                  ))}
              </div>
              <div className={`col-span-1 lg:col-span-2 ${noImageCondition() ? "xl:col-span-3" : ""} grid grid-cols-1 md:grid-cols-3 ${getChildrenTicketsCols()}`}>
                {childrenTickets.length > 0 &&
                  childrenTickets.map((ticket, index) => (
                    <div key={ticket} className="flex mt-4 flex-col w-full">
                      <div style={{ minHeight: "1.5rem" }}>
                        {index === 0 ? "Lístky vašich detí:" : ""}
                      </div>

                      <img
                        key={ticket}
                        src={ticket}
                        alt={`qr code of your childrens ticket ${index}`}
                      />
                    </div>
                  ))}
              </div>
            </div>
          </div> */}
          {ticketsPdf && (
            <div>
              <Button
                onClick={() => downloadTickets(ticketsPdf)}
                className={`w-full mt-4 lg:mt-8 md:w-1/2 mx-auto lg:ml-0`}
              >
                Stiahnuť lístky <Icon className="ml-4" name="download" />
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col flex-1 justify-between md:justify-start">
          <div>
            <SectionHeader title="Nákup neúspešný" />
            <Typography type="subtitle" fontWeight="bold">
              Mrzí nás to ale niekde nastala chyba
            </Typography>
            <p>
              Prosím zopakujte nákup ešte raz alebo v prípade ďalších
              komplikácií nás kontaktujte na kupaliska@bratislava.sk.
            </p>
          </div>
          <div className="mt-4 md:mt-12">
            <HashLink to="/#contact-us">
              <Button
                className={`mb-4 w-full md:w-1/2 mx-auto lg:ml-0`}
                type="outlined"
              >
                Kontaktujte nás <Icon className="ml-4" name="mail" />
              </Button>
            </HashLink>
            <HashLink to="/#ticket-buy">
              <Button className={`w-full md:w-1/2 mx-auto lg:ml-0`}>
                Skúsiť znova <Icon className="ml-4" name="retry" />
              </Button>
            </HashLink>
          </div>
        </div>
      )}
      <div
        className={`hidden lg:block col-span-1 bg-no-repeat ${
          height && height > 1100 ? "bg-top" : "bg-center"
        } bg-contain`}
        style={{ backgroundImage: 'url("thankyou-image.png")' }}
      />
    </main>
  );
};

export default OrderResultPage;
