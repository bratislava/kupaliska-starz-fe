import './LandingPage.css'

import {
  AccordionItem,
  ContactForm,
  HeroBanner,
  SectionHeader,
  WhyCreateAccountSection,
} from 'components'
import useCityAccountAccessToken from 'hooks/useCityAccount'
import { range } from 'lodash'
import { useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { fetchGeneralSettings } from 'store/global/api'

import HomepageHowTo from '../../components/HomepageHowTo/HomepageHowTo'
import HomepageTickets from '../../components/HomepageTickets/HomepageTickets'

const faqsn = range(1, 21)

const LandingPage = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | undefined>()
  const { t } = useTranslation()
  const { status } = useCityAccountAccessToken()
  const isAuthenticated = status === 'authenticated'

  const { data: generalSettings } = useQuery({
    queryKey: ['generalSettings'],
    queryFn: fetchGeneralSettings,
  })

  return (
    <main className="bg-sunscreen">
      <HeroBanner />
      {/* https://github.com/bratislava/kupaliska-starz-fe/issues/138 */}
      {/* this will come back next year, therefore not erasing just commenting out */}
      {/* <SwimmingPoolsInfo /> */}
      <HomepageHowTo />

      {!generalSettings?.data.isOffSeason && (
        <div className="bg-white">
          {/* Prevent margin collapsing
           https://stackoverflow.com/a/33132624/2711737 */}
          <div className="h-[0.05px]" />
          <section id="nakup-listka" className="
            section flex flex-col items-center
          ">
            <SectionHeader title={t('landing.available-ticket')} className="
              text-center
            " />
            <HomepageTickets />
          </section>
        </div>
      )}

      {!isAuthenticated && !generalSettings?.data.isOffSeason && (
        <WhyCreateAccountSection></WhyCreateAccountSection>
      )}

      <section id="divider" className="section">
        <img src="/swimmers.svg" className="mx-auto" alt="" />
      </section>

      {!generalSettings?.data.isOffSeason && (
        <section id="kupaliska" className="section flex flex-col items-center">
          <SectionHeader
            className="text-center"
            title={t('landing.swimming-pools-title')}
            subtitle={t('landing.swimming-pools-subtitle')}
          />
          <iframe
            src="https://static-pages.s3.bratislava.sk/sport-grounds-map/index.html?lang=sk"
            className="
              h-[80vh] max-h-[628px] min-h-[200px] w-full max-w-[1143px]
              rounded-2xl border-2 border-primary
            "
            title="Mapa kúpalísk"
            allow="geolocation; fullscreen"
          />
        </section>
      )}
      <section id="kontaktujte-nas" className="section">
        <SectionHeader title={t('landing.questions')} />
        <div className="grid grid-cols-4 gap-8">
          <div className="
            col-span-4
            md:col-span-2
          ">
            <ContactForm />
          </div>
          <div className="
            col-span-2 hidden
            md:block
          ">
            <img
              src="/contact-form-image.svg"
              alt="decoration for contact form"
              className="
                mx-auto w-full
                lg:w-8/10
                xl:w-7/10
              "
            />
          </div>
        </div>
      </section>
      <section id="casto-kladene-otazky" className="section">
        <SectionHeader title={t('landing.faq')} className="text-center" />
        <div className="
          mx-auto grid w-full grid-cols-1 gap-y-4
          md:w-8/10
          xl:w-6/10
        ">
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
                        em: <em />,
                        strong: <strong />,
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
