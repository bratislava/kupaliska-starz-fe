import {
  AccordionItem,
  ContactForm,
  HeroBanner,
  SectionHeader,
  WhyCreateAccountSection,
} from 'components'
import useCityAccountAccessToken from 'hooks/useCityAccount'
import { useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { fetchGeneralSettings } from 'store/global/api'

import HomepageHowTo from '../../components/HomepageHowTo/HomepageHowTo'
import HomepageTickets from '../../components/HomepageTickets/HomepageTickets'

const LandingPage = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | undefined>()
  const { t } = useTranslation()
  const { status } = useCityAccountAccessToken()
  const isAuthenticated = status === 'authenticated'

  const { data: generalSettings } = useQuery({
    queryKey: ['generalSettings'],
    queryFn: fetchGeneralSettings,
  })

  const components = {
    p: <p />,
    div: <div />,
    // TODO fix this errors in other PR
    a: <a className="underline" />,
    mail: <a className="underline" href="mailto:kupaliska@bratislava.sk" />,
    li: <li />,
    ul: <ul className="list-disc" />,
    em: <em />,
    strong: <strong />,
  }

  // TODO all of this should live in admin-fe or in general strapi

  // using `Trans` for translation here is to:
  // 1. interpret components inside of translation to HTML elements
  // 2. not be purged by `i18next-cli extract`,
  //
  // Other solutions that was considered:
  // 1. if only translation key will only be present and than translated later by t() function,
  //  it will be purged because `i18next-cli` doesn't recognize it
  // 2. using `preservePatterns` in i18next config will results to something that needs to be actively maintained
  //  when renaming translation keys or deleting them
  const listTranslations = [
    {
      title: t('landing.faq-multiple.0.title'),
      content: <Trans i18nKey="landing.faq-multiple.0.content" components={components} />,
    },
    {
      title: t('landing.faq-multiple.1.title'),
      content: <Trans i18nKey="landing.faq-multiple.1.content" components={components} />,
    },
    {
      title: t('landing.faq-multiple.2.title'),
      content: <Trans i18nKey="landing.faq-multiple.2.content" components={components} />,
    },
    {
      title: t('landing.faq-multiple.3.title'),
      content: <Trans i18nKey="landing.faq-multiple.3.content" components={components} />,
    },
    {
      title: t('landing.faq-multiple.4.title'),
      content: <Trans i18nKey="landing.faq-multiple.4.content" components={components} />,
    },
    {
      title: t('landing.faq-multiple.5.title'),
      content: <Trans i18nKey="landing.faq-multiple.5.content" components={components} />,
    },
    {
      title: t('landing.faq-multiple.6.title'),
      content: <Trans i18nKey="landing.faq-multiple.6.content" components={components} />,
    },
    {
      title: t('landing.faq-multiple.7.title'),
      content: <Trans i18nKey="landing.faq-multiple.7.content" components={components} />,
    },
    {
      title: t('landing.faq-multiple.8.title'),
      content: <Trans i18nKey="landing.faq-multiple.8.content" components={components} />,
    },
    {
      title: t('landing.faq-multiple.9.title'),
      content: <Trans i18nKey="landing.faq-multiple.9.content" components={components} />,
    },
    {
      title: t('landing.faq-multiple.10.title'),
      content: <Trans i18nKey="landing.faq-multiple.10.content" components={components} />,
    },
    {
      title: t('landing.faq-multiple.11.title'),
      content: <Trans i18nKey="landing.faq-multiple.11.content" components={components} />,
    },
    {
      title: t('landing.faq-multiple.12.title'),
      content: <Trans i18nKey="landing.faq-multiple.12.content" components={components} />,
    },
    {
      title: t('landing.faq-multiple.13.title'),
      content: <Trans i18nKey="landing.faq-multiple.13.content" components={components} />,
    },
    {
      title: t('landing.faq-multiple.14.title'),
      content: <Trans i18nKey="landing.faq-multiple.14.content" components={components} />,
    },
    {
      title: t('landing.faq-multiple.15.title'),
      content: <Trans i18nKey="landing.faq-multiple.15.content" components={components} />,
    },
    {
      title: t('landing.faq-multiple.16.title'),
      content: <Trans i18nKey="landing.faq-multiple.16.content" components={components} />,
    },
    {
      title: t('landing.faq-multiple.17.title'),
      content: <Trans i18nKey="landing.faq-multiple.17.content" components={components} />,
    },
    {
      title: t('landing.faq-multiple.18.title'),
      content: <Trans i18nKey="landing.faq-multiple.18.content" components={components} />,
    },
    {
      title: t('landing.faq-multiple.19.title'),
      content: <Trans i18nKey="landing.faq-multiple.19.content" components={components} />,
    },
  ]

  return (
    <main className="bg-sunscreen">
      <HeroBanner />
      {/* https://github.com/bratislava/kupaliska-starz-fe/issues/138 */}
      {/* this will come back next year, therefore not erasing just commenting out */}
      {/* <SwimmingPoolsInfo /> */}
      <HomepageHowTo />

      {generalSettings?.data.isSeasonActive && (
        <div className="bg-white">
          {/* Prevent margin collapsing
           https://stackoverflow.com/a/33132624/2711737 */}
          <div className="h-[0.05px]" />
          <section id="nakup-listka" className="section flex flex-col items-center">
            <SectionHeader title={t('landing.available-ticket')} className="text-center" />
            <HomepageTickets />
          </section>
        </div>
      )}

      {!isAuthenticated && generalSettings?.data.isSeasonActive && (
        <WhyCreateAccountSection></WhyCreateAccountSection>
      )}

      <section id="divider" className="section">
        <img src="/swimmers.svg" className="mx-auto" alt="" />
      </section>

      {generalSettings?.data.isSeasonActive && (
        <section id="kupaliska" className="section flex flex-col items-center">
          <SectionHeader
            className="text-center"
            title={t('landing.swimming-pools-title')}
            subtitle={t('landing.swimming-pools-subtitle')}
          />
          <iframe
            src="https://static-pages.s3.bratislava.sk/sport-grounds-map/index.html?lang=sk"
            className="h-[80vh] max-h-[628px] min-h-[200px] w-full max-w-[1143px] rounded-2xl border-2 border-primary"
            title={t('landing.pools-map-title')}
            allow="geolocation; fullscreen"
          />
        </section>
      )}
      <section id="kontaktujte-nas" className="section">
        <SectionHeader title={t('landing.questions')} />
        <div className="grid grid-cols-4 gap-8">
          <div className="col-span-4 md:col-span-2">
            <ContactForm />
          </div>
          <div className="col-span-2 hidden md:block">
            <img
              src="/contact-form-image.svg"
              alt=""
              className="mx-auto w-full lg:w-8/10 xl:w-7/10"
            />
          </div>
        </div>
      </section>
      <section id="casto-kladene-otazky" className="section">
        <SectionHeader title={t('landing.faq')} className="text-center" />
        <ul className="mx-auto grid w-full grid-cols-1 gap-y-4 md:w-8/10 xl:w-6/10">
          {listTranslations.map((faq, index) => (
            <li className="col-span-1" key={faq.title}>
              <AccordionItem
                key={index}
                title={faq.title}
                paddingVariant="narrow"
                isOpen={index === openFaqIndex}
                onOpen={() => {
                  openFaqIndex === index ? setOpenFaqIndex(undefined) : setOpenFaqIndex(index)
                }}
              >
                <span className="flex flex-col gap-2">{faq.content}</span>
              </AccordionItem>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}

export default LandingPage
