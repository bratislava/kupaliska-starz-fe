import React, { ComponentType } from 'react'
import { ROUTES } from './constants'

export interface Route {
  path: string
  exact: boolean
  name?: string
  component: ComponentType
  requireAuth?: boolean
}

const routes: Route[] = [
  {
    path: `/:lang?${ROUTES.ORDER}`,
    exact: true,
    component: React.lazy(() => import('pages/OrderPage/OrderPageGuard')),
  },
  {
    path: `/:lang?${ROUTES.ORDER_SUCCESSFUL}`,
    exact: true,
    component: React.lazy(() => import('pages/OrderResultPage/OrderResultSuccessfulPage')),
  },
  {
    path: `/:lang?${ROUTES.ORDER_UNSUCCESSFUL}`,
    exact: true,
    component: React.lazy(() => import('pages/OrderResultPage/OrderResultUnsuccessfulPage')),
  },
  {
    path: `/:lang?${ROUTES.VOP}`,
    exact: true,
    component: React.lazy(() => import('pages/VOPPage/VOPPage')),
  },
  {
    path: `/:lang?${ROUTES.GDPR}`,
    exact: true,
    component: React.lazy(() => import('pages/GDPRPage/GDPRPage')),
  },
  {
    path: `/:lang?${ROUTES.PROFILE}`,
    exact: true,
    component: React.lazy(() => import('pages/ProfilePage/ProfilePage')),
    requireAuth: true,
  },
  {
    path: `/:lang?${ROUTES.TICKETS}`,
    exact: true,
    component: React.lazy(() => import('pages/TicketsManagementPage/TicketsManagementPage')),
    requireAuth: true,
  },
  {
    path: '/:lang?',
    exact: true,
    component: React.lazy(() => import('pages/LandingPage/LandingPage')),
  },
]

const headerlessRoutes: Route[] = []

export { routes, headerlessRoutes }
