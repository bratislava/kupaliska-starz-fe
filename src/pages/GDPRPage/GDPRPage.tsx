import React from 'react'

import { SectionHeader, Typography } from 'components'

import './GDPRPage.css'
import { Trans, useTranslation } from 'react-i18next'

const GDPRPage = () => {
  const { t } = useTranslation()

  return (
    <main className="container mx-auto mt-8 xl:mt-12">
      <SectionHeader title={t('gdpr.title')} />
      <Trans
        i18nKey={`gdpr.main-text`}
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

export default GDPRPage
