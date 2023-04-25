import React, { useState } from 'react'

import { HashLink as Link } from 'react-router-hash-link'

import { Icon, Typography } from 'components'
import { useTranslation } from 'react-i18next'
import { environment } from '../../environment'

interface MenuItem {
  to: string
  key: string
}

const menuItems: MenuItem[] = [
  ...(environment.featureFlag.preseasonHomepage
    ? []
    : [
        {
          to: '/#ticket-buy',
          key: 'header.menu-items.0.text',
        },
        {
          to: '/#swimming-pools',
          key: 'header.menu-items.1.text',
        },
      ]),
  {
    to: '/#contact-us',
    key: 'header.menu-items.2.text',
  },
  {
    to: '/#faqs',
    key: 'header.menu-items.3.text',
  },
]

const Header = () => {
  const [open, setOpen] = useState<boolean>(false)
  const { t } = useTranslation()

  return (
    <>
      <div className="bg-white shadow-xs py-3 md:py-4 sticky top-0 z-50 w-full">
        <div className="container mx-auto text-fontBlack flex justify-between">
          <Link className="text-primary font-bold text-xl cursor-pointer" to="/">
            STARZ
          </Link>
          <nav className="hidden md:flex flex-1 items-center justify-end">
            {menuItems.map((menuItem) => (
              <Link key={menuItem.to} className="px-4" to={menuItem.to}>
                {t(menuItem.key)}
              </Link>
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
          } md:hidden overflow-hidden fixed top-0 right-0 bottom-0 flex-col flex flex-1 bg-white transition-all z-10`}
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
            </div>
            <div>
              <Typography type="title" fontWeight="bold">
                {t('header.watch-us')}
              </Typography>
              <div className="flex justify-between items-center text-primary py-4 pr-16">
                <a
                  target="_blank"
                  rel="noreferrer"
                  href="https://www.facebook.com/STaRZ-Spr%C3%A1va-telov%C3%BDchovn%C3%BDch-a-rekrea%C4%8Dn%C3%BDch-zariaden%C3%AD-hlavn%C3%A9ho-mesta-SR-513951915371509"
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
