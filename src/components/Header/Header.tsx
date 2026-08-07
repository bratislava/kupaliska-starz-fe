import './Header.css'

import cx from 'classnames'
import { Icon, Typography } from 'components'
import { IconName } from 'components/Icon/Icon'
import { ANCHORS, ROUTES } from 'helpers/constants'
import useCityAccountAccessToken from 'hooks/useCityAccount'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { Link, NavLink } from 'react-router'
import { fetchGeneralSettings } from 'store/global/api'

interface MenuItem {
  to: string
  key: string
  icon?: IconName
  iconActive?: IconName
}

const Divider = () => {
  return <div className="border-b-solid my-4 border-b-2" />
}

const Header = () => {
  const { status } = useCityAccountAccessToken()
  const { data: generalSettings } = useQuery({
    queryKey: ['generalSettings'],
    queryFn: fetchGeneralSettings,
  })

  const hasAccount = status === 'authenticated'
  const [open, setOpen] = useState<boolean>(false)
  const { t } = useTranslation()

  const menuItems: MenuItem[] = [
    ...(generalSettings?.data.isOffSeason
      ? []
      : [
          {
            to: ANCHORS.TICKET_BUY,
            key: 'header.menu-items.0.text',
          },
          {
            to: ANCHORS.SWIMMING_POOLS,
            key: 'header.menu-items.1.text',
          },
        ]),
    {
      to: ANCHORS.CONTACT_US,
      key: 'header.menu-items.2.text',
    },
    {
      to: ANCHORS.FAQS,
      key: 'header.menu-items.3.text',
    },
  ]

  const menuItemsAuthenticated: MenuItem[] = [
    {
      to: ROUTES.TICKETS,
      icon: 'tickets-black',
      key: 'header.menu-items.4.text',
    },
    {
      to: ROUTES.PROFILE,
      icon: 'profile',
      key: 'header.menu-items.5.text',
    },
  ]

  return (
    <div className="header bg-sunscreen sticky top-0 z-40 w-full py-3 shadow-xs md:py-4">
      <div className="text-fontBlack container mx-auto flex justify-between">
        <Link className="text-primary cursor-pointer text-xl font-bold" to="/">
          <Icon name="starz-logo" className="no-fill xs:block hidden pr-5" height={51} />
        </Link>
        <nav className="hidden flex-1 items-center justify-end md:flex">
          {menuItems.map((menuItem, index) => (
            <div key={menuItem.to} className={cx('flex', { relative: menuItem.icon })}>
              {menuItem.icon && <Icon name={menuItem.icon} className={`no-fill ml-2`} />}
              <Link
                className={cx('px-4', {
                  'border-r': hasAccount && index === 3,
                  'after:absolute': menuItem.icon,
                  'after:inset-0': menuItem.icon,
                })}
                to={menuItem.to}
              >
                {t(menuItem.key)}
              </Link>
            </div>
          ))}
          {hasAccount && <Divider />}
          {hasAccount &&
            menuItemsAuthenticated.map((menuItem, index) => (
              <div key={menuItem.to} className={cx('flex', { relative: menuItem.icon })}>
                {menuItem.icon && <Icon name={menuItem.icon} className={`no-fill ml-2`} />}
                <NavLink
                  className={cx('px-4', {
                    'border-r': hasAccount && index === 3,
                    'after:absolute': menuItem.icon,
                    'after:inset-0': menuItem.icon,
                  })}
                  to={menuItem.to}
                >
                  {t(menuItem.key)}
                </NavLink>
              </div>
            ))}
        </nav>
        <button
          onClick={() => setOpen(!open)}
          className="bg-transparent focus:outline-hidden md:hidden"
        >
          <Icon name="menu" color="primary" />
        </button>
      </div>
      <div
        onClick={() => setOpen(!open)}
        className={`fixed inset-0 ${open ? 'block' : 'hidden'} bg-fontBlack/30 z-10 md:hidden`}
      ></div>

      <nav
        className={`${
          open ? 'w-3/4' : 'w-0'
        } bg-sunscreen fixed inset-y-0 right-0 z-10 flex flex-1 flex-col overflow-hidden transition-all md:hidden`}
      >
        <div className="flex flex-1 flex-col justify-between px-4 py-12">
          <div className="flex flex-col">
            <div className="flex items-center justify-between">
              <span className="text-primary text-xl font-bold">STARZ</span>
              <button
                onClick={() => setOpen(!open)}
                className="text-primary bg-transparent focus:outline-hidden md:hidden"
              >
                <Icon name="close" color="primary" />
              </button>
            </div>
            {menuItems.map((menuItem) => (
              <Link
                onClick={() => setOpen(false)}
                key={menuItem.to}
                className="py-4 font-bold"
                to={menuItem.to}
              >
                {t(menuItem.key)}
              </Link>
            ))}
            {hasAccount && <Divider />}
            {hasAccount &&
              menuItemsAuthenticated.map((menuItem, index) => (
                <NavLink
                  onClick={() => setOpen(false)}
                  key={menuItem.to}
                  className="py-4 font-bold"
                  to={menuItem.to}
                >
                  {t(menuItem.key)}
                </NavLink>
              ))}
          </div>
          <div>
            <Typography type="title" fontWeight="bold">
              {t('header.watch-us')}
            </Typography>
            <div className="text-primary flex items-center justify-between py-4 pr-16">
              <a
                target="_blank"
                rel="noreferrer"
                href="https://www.facebook.com/STaRZ.Bratislava.official"
              >
                <Icon name="facebook-logo" />
              </a>
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default Header
