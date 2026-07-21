import './helpers/logger'
import { useEffect } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Navigate,
  Outlet,
  ScrollRestoration,
} from 'react-router'

import { Footer, Header, Toast, TopBanner } from 'components'
import { useAppDispatch, useAppSelector } from 'hooks'
import { initPageGlobalState, selectToast, setToast } from 'store/global'
import 'react-loading-skeleton/dist/skeleton.css'
import CookieConsent from './components/CookieConsent/CookieConsent'
import { AxiosError } from 'axios'
import { I18nProvider } from 'react-aria/I18nProvider'
import useCityAccountAccessToken, { CityAccountAccessTokenProvider } from 'hooks/useCityAccount'

import '@fontsource/inter'
import RegisterUserGuard from './hooks/RegisterUserGuard'
import CityAccountLoginRedirectionModal, {
  CityAccountLoginRedirectionModalContextProvider,
} from './components/CityAccountLoginInformationModal/CityAccountLoginRedirectionModal'
import { ROUTES } from 'helpers/constants'
import OrderPageGuard from 'pages/OrderPage/OrderPageGuard'
import OrderResultSuccessfulPage from 'pages/OrderResultPage/OrderResultSuccessfulPage'
import OrderResultUnsuccessfulPage from 'pages/OrderResultPage/OrderResultUnsuccessfulPage'
import VOPPage from 'pages/VOPPage/VOPPage'
import GDPRPage from 'pages/GDPRPage/GDPRPage'
import ProfilePage from 'pages/ProfilePage/ProfilePage'
import TicketsManagementPage from 'pages/TicketsManagementPage/TicketsManagementPage'
import { LandingPage } from 'pages'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        // Don't do unnecessary retries.
        if (
          (error as AxiosError)?.response?.status === 400 ||
          (error as AxiosError)?.response?.status === 403
        ) {
          return false
        }
        if (failureCount >= 3) {
          return false
        }
        return true
      },
    },
  },
})

const RequireAuthRoute = ({ children }: { children: JSX.Element }) => {
  const { status } = useCityAccountAccessToken()
  if (status === 'initializing') return null
  return status === 'authenticated' ? children : <Navigate to={'/'} />
}

const RootLayout = () => {
  const dispatch = useAppDispatch()
  const toast = useAppSelector(selectToast)

  useEffect(() => {
    dispatch(initPageGlobalState())
  }, [dispatch])

  return (
    <I18nProvider locale="sk-SK">
      <CityAccountAccessTokenProvider>
        <RegisterUserGuard>
          <CityAccountLoginRedirectionModalContextProvider>
            <ScrollRestoration />
            <CityAccountLoginRedirectionModal />
            <Toast
              open={toast !== undefined}
              type={toast?.type}
              text={toast?.message}
              onClose={() => {
                dispatch(setToast(undefined))
              }}
              timeToClose={toast?.type === 'success' ? 3000 : 5000}
              closeButton={toast?.type !== 'success'}
            />
            <TopBanner />
            <main className="relative flex flex-col" style={{ flex: 1 }}>
              <Header />
              <Outlet />
              <CookieConsent />
            </main>
            <Footer />
          </CityAccountLoginRedirectionModalContextProvider>
        </RegisterUserGuard>
      </CityAccountAccessTokenProvider>
    </I18nProvider>
  )
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<RootLayout />}>
      <Route path="/order" element={<Navigate replace to={ROUTES.ORDER} />} />
      <Route path="/order-result" element={<Navigate replace to={ROUTES.HOME} />} />
      <Route path="/profile" element={<Navigate replace to={ROUTES.PROFILE} />} />
      <Route path="/tickets" element={<Navigate replace to={ROUTES.TICKETS} />} />
      <Route path={ROUTES.ORDER} element={<OrderPageGuard />} />
      <Route path={ROUTES.ORDER_SUCCESSFUL} element={<OrderResultSuccessfulPage />} />
      <Route path={ROUTES.ORDER_UNSUCCESSFUL} element={<OrderResultUnsuccessfulPage />} />
      <Route path={ROUTES.VOP} element={<VOPPage />} />
      <Route path={ROUTES.GDPR} element={<GDPRPage />} />
      <Route
        path={ROUTES.PROFILE}
        element={
          <RequireAuthRoute>
            <ProfilePage />
          </RequireAuthRoute>
        }
      />
      <Route
        path={ROUTES.TICKETS}
        element={
          <RequireAuthRoute>
            <TicketsManagementPage />
          </RequireAuthRoute>
        }
      />
      <Route path={ROUTES.HOME} element={<LandingPage />} />
    </Route>,
  ),
)

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}

export default App
