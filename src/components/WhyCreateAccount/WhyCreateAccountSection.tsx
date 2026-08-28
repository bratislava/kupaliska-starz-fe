import { SectionHeader } from 'components'
import { useTranslation } from 'react-i18next'

const WhyCreateAccountSection = () => {
  const { t } = useTranslation()

  const listTranslations = [
    {
      title: t('landing.why-create-account.0.title'),
      content: t('landing.why-create-account.0.content'),
    },
    {
      title: t('landing.why-create-account.1.title'),
      content: t('landing.why-create-account.1.content'),
    },
    {
      title: t('landing.why-create-account.2.title'),
      content: t('landing.why-create-account.2.content'),
    },
  ]

  return (
    <section id="why-create-account" className="section">
      <SectionHeader title={t('landing.why-create-account-title')} className="text-center" />
      <ul>
        {listTranslations.map((item, index) => (
          <li
            key={item.title}
            className={`mx-auto mb-10 flex flex-col-reverse md:mb-0 lg:w-8/10 ${
              index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
            }`}
          >
            <div className="mt-6 flex flex-1 items-center justify-center text-center md:mt-0">
              <div className="w-80">
                <div className="mb-6 text-2xl font-semibold">{item.title}</div>
                <p>{item.content}</p>
              </div>
            </div>
            <div className="flex flex-none justify-center">
              <img alt="" src={`phone-${index + 1}.png`} />
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default WhyCreateAccountSection
