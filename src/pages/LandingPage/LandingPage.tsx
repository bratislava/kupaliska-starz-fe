import React, { useEffect, useState } from "react";

import { push } from "connected-react-router";

import {
  HeroBanner,
  MobileCarousel,
  TicketBuyDiagramCard,
  Typography,
  TicketCard,
  SwimmingPoolInfoCard,
  Button,
  Icon,
  Modal,
  SectionHeader,
  ContactForm,
  AccordionPanel,
  TicketCardDisplayOnly,
} from "components";
import { useAppDispatch, useAppSelector, useWindowSize } from "hooks";
import {
  fetchPoolActions,
  selectAvailableTickets,
  selectPools,
  selectSelectedPool,
  setSelectedPoolId,
} from "store/global";
import { setCart } from "store/order";
import { Ticket, SwimmingPool } from "models";

import "./LandingPage.css";
import { assignItemsToColumns } from "helpers/general";
import { Trans, useTranslation } from "react-i18next";

const items = [
  {
    imgSrc: "/ticket-buy-diagram-1.png",
  },
  {
    imgSrc: "/ticket-buy-diagram-2.png",
  },
  {
    imgSrc: "/ticket-buy-diagram-3.png",
  },
  {
    imgSrc: "/ticket-buy-diagram-4.png",
  },
];

const faqsn = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

const LandingPage = () => {
  const [allSwimmingPools, setAllSwimmingPools] = useState<boolean>(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | undefined>();
  const { width } = useWindowSize();
  const dispatch = useAppDispatch();
  const tickets = useAppSelector(selectAvailableTickets);
  const swimmingPools = useAppSelector(selectPools);
  const selectedSwimmingPool = useAppSelector(selectSelectedPool);
  const { t } = useTranslation();

  const onTicketBuy = (ticket: Ticket, amount: number) => {
    dispatch(
      setCart({
        ticket,
        amount,
        childrenNumber: 0,
      })
    );
    dispatch(push("/order"));
  };

  useEffect(() => {
    if (width && width <= 768 && selectedSwimmingPool) {
      dispatch(setSelectedPoolId(undefined));
    }
  }, [width]);

  const moreDetailOnSwimmingPoolHandler = (swimmingPool: SwimmingPool) => {
    dispatch(fetchPoolActions(swimmingPool.id));
    if (width && width >= 768) {
      dispatch(setSelectedPoolId(swimmingPool.id));
      return false;
    } else {
      return true;
    }
  };

  const getNumberOfSwimmingPoolCols = () => {
    if (width) {
      if (width >= 1024) {
        return 3;
      }
      if (width >= 768) {
        return 2;
      }
    }

    return 1;
  };

  return (
    <main>
      <Modal
        open={!!selectedSwimmingPool}
        onClose={() => dispatch(setSelectedPoolId(undefined))}
      >
        <div className="bg-transparent  landing-page__swimming-pool-modal rounded-lg flex">
          {selectedSwimmingPool && (
            <SwimmingPoolInfoCard
              className="flex-1 flex-col"
              onActionButtonClick={() => {
                dispatch(setSelectedPoolId(undefined));
                return false;
              }}
              swimmingPool={selectedSwimmingPool}
              modal
            />
          )}
        </div>
      </Modal>
      <HeroBanner />
      <section id="ticket-buy-diagram" className="my-4 lg:my-16">
        <Typography type="title" fontWeight="bold" className="text-center mb-8">
          {t("landing.how-does-it-work")}
        </Typography>
        <MobileCarousel className="md:hidden">
          {items.map((item, index) => (
            <TicketBuyDiagramCard
              imgSrc={item.imgSrc}
              key={item.imgSrc}
              text={t(`landing.steps.${index}`)}
              index={index + 1}
            />
          ))}
        </MobileCarousel>
        <div className="hidden md:block w-full wave-background">
          <div className="container mx-auto grid grid-cols-2 gap-y-16 gap-x-8 lg:gap-x-12 xl:gap-x-16 lg:grid-cols-12 bg-transparent py-16">
            {items.map((item, index) => (
              <div key={item.imgSrc} className={`col-span-1 lg:col-span-3`}>
                <div className="w-8/10 lg:w-full mx-auto">
                  <TicketBuyDiagramCard
                    imgSrc={item.imgSrc}
                    text={
                      <Trans
                        i18nKey={`landing.steps.${index}`}
                        components={{ p: <p />, strong: <strong /> }}
                      />
                    }
                    index={index + 1}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="ticket-buy" className="section">
        <SectionHeader title="Dostupné lístky" className="text-center" />
        <div className="lg:w-8/10 grid grid-cols-8 gap-4 lg:gap-x-24 lg:gap-y-12 mx-auto">
          {tickets.map((ticket) => (
            <TicketCardDisplayOnly
              className="col-span-8 md:col-span-4"
              key={ticket.id}
              ticket={ticket}
              onBuyClick={onTicketBuy}
            />
          ))}
        </div>
        <div className="flex flex-col text-center my-8 text-sm leading-loose">
          <span>{t("landing.additional-info-0")}</span>
          <span>{t("landing.additional-info-1")}</span>
          <span>{t("landing.additional-info-2")}</span>
        </div>
      </section>

      <section id="swimming-pools" className="section">
        <SectionHeader
          className="text-center"
          title={t("landing.swimming-pools-title")}
          subtitle={t("landing.swimming-pools-subtitle")}
        />
        <div className="md:grid md:gap-x-16 md:grid-cols-2 lg:gap-x-32 lg:grid-cols-3 auto-rows-fr">
          {(allSwimmingPools
            ? assignItemsToColumns(getNumberOfSwimmingPoolCols(), swimmingPools)
            : assignItemsToColumns(
                getNumberOfSwimmingPoolCols(),
                swimmingPools.slice(0, width && width >= 1024 ? 3 : 2)
              )
          ).map((swimmingPoolsCol, index) => (
            <div key={`col-${index}`} className="flex flex-col">
              {swimmingPoolsCol.map((swimmingPool) => (
                <SwimmingPoolInfoCard
                  key={swimmingPool.id}
                  swimmingPool={swimmingPool}
                  className={`lg:col-span-1 my-4`}
                  onActionButtonClick={moreDetailOnSwimmingPoolHandler}
                />
              ))}
            </div>
          ))}
        </div>
        <Button
          onClick={() => setAllSwimmingPools(!allSwimmingPools)}
          className="w-full md:w-1/2 lg:w-1/4 mx-auto"
        >
          {allSwimmingPools
            ? t("landing.show-more-swimming-pools")
            : t("landing.show-less-swimming-pools")}
          <Icon
            className="ml-4"
            name={`${allSwimmingPools ? "arrow-up" : "arrow-down"}`}
          />
        </Button>
      </section>
      <section id="contact-us" className="section">
        <SectionHeader title={t("landing.questions")} />
        <div className="grid gap-8 grid-cols-4">
          <div className="col-span-4 md:col-span-2">
            <ContactForm />
          </div>
          <div className="hidden col-span-2 md:block">
            <img
              src="contact-form-image.png"
              alt="decoration for contact form"
              className="w-full lg:w-8/10 xl:w-7/10 mx-auto"
            />
          </div>
        </div>
      </section>
      <section id="faqs" className="section">
        <SectionHeader title={t("landing.faq")} className="text-center" />
        <div className="grid grid-cols-1 gap-y-4 w-full md:w-8/10 xl:w-6/10 mx-auto">
          {Object.keys(faqsn).map((faq, index) => (
            <div className="col-span-1" key={index}>
              <AccordionPanel
                className="text-fontBlack text-opacity-50"
                key={index}
                title={t(`landing.faq-mutiple.${faq}.title`)}
                open={index === openFaqIndex}
                onOpen={() => {
                  openFaqIndex === index
                    ? setOpenFaqIndex(undefined)
                    : setOpenFaqIndex(index);
                }}
              >
                {typeof t(`landing.faq-mutiple.${faq}.content`) === "string" ? (
                  <p>
                    <Trans
                      i18nKey={`landing.faq-mutiple.${faq}.content`}
                      components={{
                        section: <section />,
                        div: <div />,
                        a: <a />,
                        strong: <strong />,
                        li: <li />,
                        ol: <ol style={{ listStyleType: "disc" }} />,
                        h4: <h4 />,
                      }}
                    />
                  </p>
                ) : (
                  t(`landing.faq-mutiple.${faq}.content`)
                )}
              </AccordionPanel>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default LandingPage;
