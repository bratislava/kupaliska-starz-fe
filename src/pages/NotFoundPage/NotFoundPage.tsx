import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import ButtonComponentLibraryWrapper from '@/components/Button/ButtonComponentLibraryWrapper'
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
      {/* TODO don't nest button in link */}
      <Link to={ROUTES.HOME}>
        <ButtonComponentLibraryWrapper className="mx-auto flex w-full md:w-1/2" variant="solid">
          {t('errors.back-home')}
        </ButtonComponentLibraryWrapper>
      </Link>
    </MessageScreen>
  )
}

export default NotFoundPage
