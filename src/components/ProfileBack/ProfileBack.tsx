import { ROUTES } from 'helpers/constants'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Icon } from '../index'

const ProfileBack = () => {
  const { t } = useTranslation()

  return (
    <div className="py-7">
      <Link to={ROUTES.PROFILE} className="flex items-center py-0.5">
        <Icon className="mr-4" name="arrow-right" />
        {t('common.back')}
      </Link>
    </div>
  )
}

export default ProfileBack
