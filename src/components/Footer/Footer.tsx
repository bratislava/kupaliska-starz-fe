import cx from 'classnames'
import { ROUTES } from 'helpers/constants'
import { Trans, useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router'

const Footer = () => {
  const { t } = useTranslation()
  const location = useLocation()
  const currentYear = new Date().getFullYear()

  // Don't show top margin on home page as it handles its own positioning and has a different background (white).
  // TODO: Find better solution.
  const showTopMargin =
    location.pathname !== ROUTES.HOME &&
    location.pathname !== ROUTES.ORDER_SUCCESSFUL &&
    location.pathname !== ROUTES.ORDER_UNSUCCESSFUL

  return (
    <div className={cx('w-full bg-blueish', { 'mt-4 md:mt-24': showTopMargin })}>
      <div className="container mx-auto flex grid w-full grid-cols-1 items-center justify-between py-4 lg:grid-cols-3">
        <div className="order-1 my-2 flex flex-col text-primary lg:order-1 lg:my-0">
          <span className="font-semibold">{t('common.contact')}</span>
          <span>{t('footer.org-name')}</span>
          <span></span>
          <span>{t('footer.address')}</span>
          <span>{t('footer.ico')}</span>
          <span>{t('footer.dic')}</span>
        </div>
        <div className="order-3 col-span-1 flex items-center justify-center text-primary lg:order-2">
          <Trans
            i18nKey="footer.creators"
            components={{
              InnovationLink: (
                // text is inside translation son this errors is irrelevant
                // eslint-disable-next-line jsx-a11y/control-has-associated-label, jsx-a11y/anchor-has-content
                <a
                  href="https://inovacie.bratislava.sk"
                  rel="noopener noreferrer"
                  target="_blank"
                  className="mx-1 link"
                />
              ),
            }}
            values={{ year: currentYear }}
          />
        </div>
        <div className="order-2 my-2 flex flex-col text-primary lg:order-3 lg:my-0 lg:items-end">
          <span className="font-semibold">{t('common.important-info')}</span>
          <Link className="link" to={ROUTES.VOP}>
            {t('common.vop')}
          </Link>
          <Link className="link" to={ROUTES.GDPR}>
            {t('common.privacy-conditions')}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Footer
