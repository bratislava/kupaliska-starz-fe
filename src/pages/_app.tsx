import '@/index.css'
import 'react-loading-skeleton/dist/skeleton.css'
// Pages Router allows global CSS imports only in `_app`
import '@/components/Button/Button.css'
import '@/components/CheckboxField/CheckboxField.css'
import '@/components/Header/Header.css'
import '@/components/HeroBanner/HeroBanner.css'
import '@/components/Icon/Icon.css'
import '@/components/InputField/InputField.css'
import '@/components/MobileCarousel/MobileCarousel.css'
import '@/components/Modal/Modal.css'
import '@/components/OrderSuccess/TicketsSwiper.css'
import '@/components/SwimmingPoolInfoCard/SwimmingPoolInfoCard.css'
import '@/components/Tooltip/Tooltip.css'
import '@/views/GDPRPage/GDPRPage.css'
import '@/views/OrderPage/OrderPage.css'
import '@/views/VOPPage/VOPPage.css'

import dynamic from 'next/dynamic'
import Head from 'next/head'

// For now the whole app runs client-only and react-router handles routing for every URL,
// so the Next page `Component` is intentionally not rendered.
// TODO render `Component` once pages are migrated from react-router to Next routing
const ClientApp = dynamic(() => import('@/ClientApp'), { ssr: false })

const MyApp = () => {
  return (
    <>
      <Head>
        <title>Letné kúpaliská STaRZ</title>
        <meta
          name="description"
          content="Nestrácajte čas čakaním v rade. Zakúpte si online lístok alebo permanentku rýchlo a pohodlne."
        />
      </Head>
      <div id="root">
        <ClientApp />
      </div>
    </>
  )
}

export default MyApp
