import React, { useState } from 'react'

import {
  AccordionItem,
  ContactForm,
  HeroBanner,
  MobileCarousel,
  SectionHeader,
  TicketBuyDiagramCard,
  TicketCardHomePage,
  Typography,
  WhyCreateAccountSection,
} from 'components'
import { useAppSelector } from 'hooks'
import { selectAvailableTickets } from 'store/global'

import './LandingPage.css'
import { Trans, useTranslation } from 'react-i18next'
import { useIsAuthenticated } from '@azure/msal-react'
import { environment } from '../../environment'

const items = [
  {
    imgSrc: '/ticket-buy-diagram-1.png',
  },
  {
    imgSrc: '/ticket-buy-diagram-2.png',
  },
  {
    imgSrc: '/ticket-buy-diagram-3.png',
  },
  {
    imgSrc: '/ticket-buy-diagram-4.png',
  },
]

const faqsn = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]
const preseason = environment.featureFlag.preseasonHomepage

const LandingPage = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | undefined>()
  const tickets = useAppSelector(selectAvailableTickets)
  const { t } = useTranslation()
  const isAuthenticated = useIsAuthenticated()

  return (
    <main className="bg-white">
      <HeroBanner />
      <section id="ticket-buy-diagram" className="my-4 lg:my-16">
        <Typography type="title" fontWeight="bold" className="text-center mb-8">
          {t('landing.how-does-it-work')}
        </Typography>
        <MobileCarousel className="md:hidden">
          {items.map((item, index) => (
            <TicketBuyDiagramCard
              imgSrc={item.imgSrc}
              key={item.imgSrc}
              text={
                <Trans
                  i18nKey={`landing.steps.${index}`}
                  components={{ p: <p />, strong: <strong /> }}
                />
              }
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

      {!preseason && (
        <section id="ticket-buy" className="section">
          <SectionHeader title={t('landing.available-ticket')} className="text-center" />
          <div className="lg:w-8/10 grid grid-cols-8 gap-4 lg:gap-x-24 lg:gap-y-12 mx-auto">
            {tickets.map((ticket) => (
              <TicketCardHomePage
                className="col-span-8 md:col-span-4"
                key={ticket.id}
                ticket={ticket}
              />
            ))}
          </div>
          <div className="flex flex-col text-center my-8 text-sm leading-loose">
            <span>{t('common.additional-info-age')}</span>
            <span>{t('common.additional-info-student-senior')}</span>
            <span>{t('common.additional-info-toddlers')}</span>
          </div>
        </section>
      )}

      {!isAuthenticated && !preseason && <WhyCreateAccountSection></WhyCreateAccountSection>}

      <section id="divider" className="section">
        <img src="/swimmers.svg" className="mx-auto" alt="" />
      </section>

      {!preseason && (
        <section id="swimming-pools" className="section">
          <SectionHeader
            className="text-center"
            title={t('landing.swimming-pools-title')}
            subtitle={t('landing.swimming-pools-subtitle')}
          />
          <iframe
            src="https://cdn-api.bratislava.sk/static-pages/sport-grounds-map/index.html?lang=sk"
            className="w-full h-[80vh] min-h-[200px] max-h-[800px]"
            title="Mapa kúpalísk"
          />
        </section>
      )}
      <section id="contact-us" className="section">
        <SectionHeader title={t('landing.questions')} />
        <div className="grid gap-8 grid-cols-4">
          <div className="col-span-4 md:col-span-2">
            <ContactForm />
          </div>
          <div className="hidden col-span-2 md:block">
            <img
              src="/contact-form-image.png"
              alt="decoration for contact form"
              className="w-full lg:w-8/10 xl:w-7/10 mx-auto"
            />
          </div>
        </div>
      </section>
      <section id="faqs" className="section">
        <SectionHeader title={t('landing.faq')} className="text-center" />
        <div className="grid grid-cols-1 gap-y-4 w-full md:w-8/10 xl:w-6/10 mx-auto">
          {Object.keys(faqsn).map((faq, index) => (
            <div className="col-span-1" key={index}>
              <AccordionItem
                key={index}
                title={t(`landing.faq-mutiple.${faq}.title`)}
                paddingVariant="narrow"
                isOpen={index === openFaqIndex}
                onOpen={() => {
                  openFaqIndex === index ? setOpenFaqIndex(undefined) : setOpenFaqIndex(index)
                }}
              >
                {typeof t(`landing.faq-mutiple.${faq}.content`) === 'string' ? (
                  <span>
                    <Trans
                      i18nKey={`landing.faq-mutiple.${faq}.content`}
                      components={{
                        section: <section />,
                        div: <div />,
                        a: <a />,
                        strong: <strong />,
                        li: <li />,
                        ol: <ol />,
                        h4: <h4 />,
                      }}
                    />
                  </span>
                ) : (
                  t(`landing.faq-mutiple.${faq}.content`)
                )}
              </AccordionItem>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}

export default LandingPage
