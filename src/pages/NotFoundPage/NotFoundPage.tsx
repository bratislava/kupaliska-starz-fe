import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'

import { Button, MessageScreen } from 'components'
import { ROUTES } from 'helpers/constants'

const NotFoundPage = () => {
  const { t } = useTranslation()

  return (
    <MessageScreen title={t('errors.not-found-title')} description={t('errors.not-found-description')}>
      <Link to={ROUTES.HOME}>
        <Button className="w-full md:w-1/2 mx-auto lg:ml-0">{t('errors.back-home')}</Button>
      </Link>
    </MessageScreen>
  )
}

export default NotFoundPage
