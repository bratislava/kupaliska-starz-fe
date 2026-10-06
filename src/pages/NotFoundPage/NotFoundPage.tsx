import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import Button from '@/components/Button/Button'
import MessageScreen from '@/components/MessageScreen/MessageScreen'
import { ROUTES } from '@/helpers/constants'

const NotFoundPage = () => {
  const { t } = useTranslation()

  // TODO this is only simple placeholder for now, ask how it should look like
  return (
    <MessageScreen
      title={t('errors.not-found-title')}
      description={t('errors.not-found-description')}
    >
      <Link to={ROUTES.HOME}>
        <Button className="mx-auto w-full md:w-1/2">{t('errors.back-home')}</Button>
      </Link>
    </MessageScreen>
  )
}

export default NotFoundPage
