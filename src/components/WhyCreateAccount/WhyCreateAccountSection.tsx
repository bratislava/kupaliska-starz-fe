import { SectionHeader } from 'components'
import { useTranslation } from 'react-i18next'

const WhyCreateAccountSection = () => {
  const { t } = useTranslation()

  return (
    <section id="why-create-account" className="section">
      <SectionHeader title="Prečo si založiť účet?" className="text-center" />
      {[0, 1, 2].map((index) => (
        <div
          className={`mx-auto mb-10 flex flex-col-reverse md:mb-0 lg:w-8/10 ${
            index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
          } `}
          key={index}
        >
          <div className="mt-6 flex flex-1 items-center justify-center text-center md:mt-0">
            <div className="w-80">
              <div className="mb-6 text-2xl font-semibold">
                {t(`landing.why-create-account.${index}.title`)}
              </div>
              <p>{t(`landing.why-create-account.${index}.content`)}</p>
            </div>
          </div>
          <div className="flex flex-none justify-center">
            <img alt="" src={`phone-${index + 1}.png`} />
          </div>
        </div>
      ))}
    </section>
  )
}

export default WhyCreateAccountSection
