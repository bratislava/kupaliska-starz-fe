import React, { useState } from 'react'

import {
  AccordionItem,
  ContactForm,
  HeroBanner,
  MobileCarousel,
  SectionHeader,
  TicketBuyDiagramCard,
  Typography,
  WhyCreateAccountSection,
} from 'components'

import './LandingPage.css'
import { Trans, useTranslation } from 'react-i18next'
import { environment } from '../../environment'
import HomepageTickets from '../../components/HomepageTickets/HomepageTickets'
import { range } from 'lodash'
import useCityAccountAccessToken from 'hooks/useCityAccount'

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

const faqsn = range(1, 16)
const preseason = environment.featureFlag.preseasonHomepage

const LandingPage = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | undefined>()
  const { t } = useTranslation()
  const { status } = useCityAccountAccessToken()
  const isAuthenticated = status === 'authenticated'

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
        <div className="bg-backgroundGray">
          {/* Prevent margin collapsing
           https://stackoverflow.com/a/33132624/2711737 */}
          <div className="h-[0.05px]" />
          <section id="ticket-buy" className="section flex flex-col items-center">
            <SectionHeader title={t('landing.available-ticket')} className="text-center" />
            <HomepageTickets />

            <div className="flex flex-col text-center my-8 text-sm leading-loose">
              <span>{t('common.additional-info-age')}</span>
              <span>{t('common.additional-info-student-senior')}</span>
              <span>{t('common.additional-info-toddlers')}</span>
            </div>
          </section>
        </div>
      )}

      {!isAuthenticated && !preseason && <WhyCreateAccountSection></WhyCreateAccountSection>}

      <section id="divider" className="section">
        <img src="/swimmers.svg" className="mx-auto" alt="" />
      </section>

      {!preseason && (
        <section id="swimming-pools" className="section flex flex-col items-center">
          <SectionHeader
            className="text-center"
            title={t('landing.swimming-pools-title')}
            subtitle={t('landing.swimming-pools-subtitle')}
          />
          <iframe
            src="https://cdn-api.bratislava.sk/static-pages/sport-grounds-map/index.html?lang=sk"
            className="w-full h-[80vh] min-h-[200px] max-h-[624px] max-w-[1110px]"
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
                title={t(`landing.faq-multiple.${faq}.title`)}
                paddingVariant="narrow"
                isOpen={index === openFaqIndex}
                onOpen={() => {
                  openFaqIndex === index ? setOpenFaqIndex(undefined) : setOpenFaqIndex(index)
                }}
              >
                {typeof t(`landing.faq-multiple.${faq}.content`) === 'string' ? (
                  <span className="flex flex-col gap-2">
                    <Trans
                      i18nKey={`landing.faq-multiple.${faq}.content`}
                      components={{
                        p: <p />,
                        div: <div />,
                        a: <a className="underline" />,
                        mail: <a className="underline" href="mailto:kupaliska@bratislava.sk" />,
                        li: <li />,
                        ul: <ul className="list-disc" />,
                      }}
                    />
                  </span>
                ) : (
                  t(`landing.faq-multiple.${faq}.content`)
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
