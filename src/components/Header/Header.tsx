import React, { useState } from 'react'
import './Header.css'

import { HashLink as Link } from 'react-router-hash-link'
import { NavLink } from 'react-router-dom'

import cx from 'classnames'

import { Icon, Typography } from 'components'
import { useTranslation } from 'react-i18next'
import { IconName } from 'components/Icon/Icon'
import useCityAccountAccessToken from 'hooks/useCityAccount'
import { usePreseason } from 'hooks/usePreseason'
import { ANCHORS, ROUTES } from 'helpers/constants'

interface MenuItem {
  to: string
  key: string
  icon?: IconName
  iconActive?: IconName
}

const Divider = () => {
  return <div className="border-b-solid border-b-2 my-4" />
}

const Header = () => {
  const { status } = useCityAccountAccessToken()
  const preseason = usePreseason()

  const hasAccount = status === 'authenticated'
  const [open, setOpen] = useState<boolean>(false)
  const { t } = useTranslation()

  const menuItems: MenuItem[] = [
    ...(preseason
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
    <>
      <div className="bg-sunscreen shadow-xs py-3 md:py-4 sticky top-0 z-40 w-full header">
        <div className="container mx-auto text-fontBlack flex justify-between">
          <Link className="text-primary font-bold text-xl cursor-pointer" to="/">
            <Icon name="starz-logo" className="hidden xs:block no-fill pr-5" />
          </Link>
          <nav className="hidden md:flex flex-1 items-center justify-end">
            {menuItems.map((menuItem, index) => (
              <div key={menuItem.to} className={cx('flex', { relative: menuItem.icon })}>
                {menuItem.icon && <Icon name={menuItem.icon} className={'ml-2 no-fill'} />}
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
                  {menuItem.icon && <Icon name={menuItem.icon} className={'ml-2 no-fill'} />}
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
            className="bg-transparent focus:outline-none md:hidden"
          >
            <Icon name="menu" color="primary" />
          </button>
        </div>
        <div
          onClick={() => setOpen(!open)}
          className={`fixed inset-0 ${
            open ? 'block' : 'hidden'
          } md:hidden bg-fontBlack bg-opacity-30 z-10`}
        ></div>

        <nav
          className={`${
            open ? 'w-3/4' : 'w-0'
          } md:hidden overflow-hidden fixed top-0 right-0 bottom-0 flex-col flex flex-1 bg-sunscreen transition-all z-10`}
        >
          <div className="py-12 px-4 flex flex-col flex-1 justify-between">
            <div className="flex flex-col">
              <div className="flex justify-between items-center">
                <span className="text-primary font-bold text-xl">STARZ</span>
                <button
                  onClick={() => setOpen(!open)}
                  className="bg-transparent focus:outline-none md:hidden text-primary"
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
              <div className="flex justify-between items-center text-primary py-4 pr-16">
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
    </>
  )
}

export default Header
