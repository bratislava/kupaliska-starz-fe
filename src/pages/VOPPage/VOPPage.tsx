import { SectionHeader, Typography } from 'components'

import './VOPPage.css'
import { Trans, useTranslation } from 'react-i18next'

const VOPPage = () => {
  const { t } = useTranslation()

  return (
    <main className="mx-auto mt-8 xl:mt-12 container">
      <SectionHeader title={t('vop.title')} />
      <Trans
        // TODO there is a better solution for this
        i18nKey={`vop.main-text`}
        components={{
          p: <p />,
          span: <span />,
          li: <li />,
          ol: <ol />,
          Typography: <Typography type="subtitle" />,
          section: <section />,
          div: <div />,
        }}
      />
    </main>
  )
}
export default VOPPage
