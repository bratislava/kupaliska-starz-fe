import React, { ComponentType } from 'react'

export interface Route {
  path: string
  exact: boolean
  name?: string
  component: ComponentType
  requireAuth?: boolean
}

const styleGuideRoute = () => {
  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    return {
      path: '/styleguide',
      exact: false,
      component: React.lazy(() => import('pages/StyleGuide/StyleGuide')),
    }
  }
}

const routes: Route[] = [
  {
    path: '/:lang?/order',
    exact: true,
    component: React.lazy(() => import('pages/OrderPage/OrderPageGuard')),
  },
  {
    path: '/:lang?/order-result',
    exact: true,
    component: React.lazy(() => import('pages/OrderResultPage/OrderResultPage')),
  },
  {
    path: '/:lang?/vop',
    exact: true,
    component: React.lazy(() => import('pages/VOPPage/VOPPage')),
  },
  {
    path: '/:lang?/gdpr',
    exact: true,
    component: React.lazy(() => import('pages/GDPRPage/GDPRPage')),
  },
  styleGuideRoute() || {} as Route,
  {
    path: '/:lang?/profile',
    exact: true,
    component: React.lazy(() => import('pages/ProfilePage/ProfilePage')),
    requireAuth: true,
  },
  {
    path: '/:lang?/tickets',
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
