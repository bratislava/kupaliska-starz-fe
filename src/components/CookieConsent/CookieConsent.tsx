import React, { PropsWithChildren } from "react";
import Consent, { Cookies } from "react-cookie-consent";
import { useTranslation } from "react-i18next";
import { AccordionItem, Button, Modal } from "../index";
import KupaliskaSwitch from "../Switch/KupaliskaSwitch";
import cx from "classnames";

const COOKIE_NAME = "kupaliska-gdpr";

/**
 * Wraps `Button` component to work with props provided by `react-cookie-consent` library.
 */
const ButtonCookieConsent = ({
  children,
  id,
  onClick,
}: PropsWithChildren<{
  id: "rcc-confirm-button" | "rcc-decline-button";
  onClick: () => void;
}>) => {
  const color = (
    {
      "rcc-confirm-button": "primary",
      "rcc-decline-button": "blueish",
    } as const
  )[id];

  return (
    <Button color={color} onClick={onClick}>
      {children}
    </Button>
  );
};

// Inspired by https://github.com/bratislava/bratislava-monorepo/blob/master/apps/next/city-library/components/Molecules/CookieConsent.tsx
const CookieConsent = () => {
  const { t } = useTranslation();
  const [showModal, setShowModal] = React.useState(false);
  const [isConsentSubmitted, setConsent] = React.useState(false);
  const [securityCookies] = React.useState<boolean>(true);
  const [performanceCookies, setPerformanceCookies] =
    React.useState<boolean>(true);
  const [advertisingCookies, setAdvertisingCookies] =
    React.useState<boolean>(true);
  const [openPanel, setOpenPanel] = React.useState<number | undefined>();
  // TODO: Add Google Analytics?
  // ReactGA.initialize(process.env.GOOGLE_ANALYTICS_ID ?? '');
  const closeModal = () => {
    setShowModal(false);
  };

  const saveSettings = () => {
    Cookies.set(COOKIE_NAME, {
      security_cookies: securityCookies,
      performance_cookies: performanceCookies,
      advertising_and_targeting_cookies: advertisingCookies,
    });
    // TODO: Add Google Analytics?
    // ReactGA.set({
    //     security_cookies: securityCookies,
    //     performance_cookies: performanceCookies,
    //     advertising_and_targeting_cookies: advertisingCookies,
    // });
    setShowModal(false);
    setConsent(true);
  };
  const acceptAllCookies = () => {
    Cookies.set(COOKIE_NAME, {
      security_cookies: true,
      performance_cookies: true,
      advertising_and_targeting_cookies: true,
    });
    // TODO: Add Google Analytics?
    // ReactGA.set({
    //     security_cookies: true,
    //     performance_cookies: true,
    //     advertising_and_targeting_cookies: true,
    // });
    setShowModal(false);
    setConsent(true);
  };
  const declineCookies = () => {
    setPerformanceCookies(false);
    setAdvertisingCookies(false);
    Cookies.set(COOKIE_NAME, {
      security_cookies: true,
      performance_cookies: false,
      advertising_and_targeting_cookies: false,
    });
    // ReactGA.set({
    //     security_cookies: true,
    //     performance_cookies: false,
    //     advertising_and_targeting_cookies: false,
    // });
    setTimeout(() => {
      setShowModal(false);
      setConsent(true);
    }, 300);
  };
  return (
    <div>
      <Modal open={showModal} onClose={closeModal} closeButton={true}>
        <div
          className="p-10 modal-with-close-width-screen"
          style={{ maxWidth: "1100px" }}
        >
          <div className="text-xl font-semibold mb-10">
            {t("cookie-consent.modal-title")}
          </div>
          <div>
            <div
              className="h-full overflow-y-scroll"
              style={{ maxHeight: "400px" }}
            >
              <div>
                <div className="font-medium mb-4">
                  {t("cookie-consent.modal-content-title")}
                </div>
                {/* TODO: Remove dangerouslySetInnerHTML. */}
                <p
                  className="text-sm mb-8"
                  dangerouslySetInnerHTML={{
                    __html: t("cookie-consent.modal-content-body"),
                  }}
                />
              </div>
              {[
                {
                  checked: securityCookies,
                  disabled: true,
                  titleText: t("cookie-consent.security-essential-title"),
                  descriptionText: t(
                    "cookie-consent.security-essential-content"
                  ),
                },
                {
                  checked: performanceCookies,
                  disabled: false,
                  setFunction: setPerformanceCookies,
                  titleText: t("cookie-consent.performance-title"),
                  descriptionText: t("cookie-consent.performance-content"),
                },
                {
                  checked: advertisingCookies,
                  disabled: false,
                  setFunction: setAdvertisingCookies,
                  titleText: t("cookie-consent.advertising-targeting-title"),
                  descriptionText: t(
                    "cookie-consent.advertising-targeting-content"
                  ),
                },
              ].map(
                (
                  {
                    checked,
                    disabled,
                    setFunction,
                    titleText,
                    descriptionText,
                  },
                  index
                ) => (
                  <AccordionItem
                    key={index}
                    title={
                      <div className="flex justify-between flex-grow">
                        <span>{titleText}</span>
                        <KupaliskaSwitch
                          checked={checked}
                          disabled={disabled}
                          onChange={(value, e) => {
                            setFunction && setFunction(value);
                            // To not collapse/open the accordion.
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                        />
                      </div>
                    }
                    paddingVariant="narrow"
                    isOpen={openPanel === index}
                    onOpen={() => {
                      openPanel === index
                        ? setOpenPanel(undefined)
                        : setOpenPanel(index);
                    }}
                    className={cx({ "mt-4": index !== 0 })}
                  >
                    {descriptionText}
                  </AccordionItem>
                )
              )}
            </div>
            <div className="mt-5 flex gap-1 justify-between flex-col md:flex-row">
              <Button
                className="px-3 py-1 text-sm rounded-sm bg-gray-900 text-white"
                onClick={saveSettings}
                color="primary"
              >
                {t("cookie-consent.save-settings")}
              </Button>
              <div className="flex gap-1 flex-col md:flex-row">
                <Button
                  className="min-w-[140px] md:mr-1 py-1 text-sm rounded-sm bg-gray-900 text-white"
                  onClick={declineCookies}
                  color="blueish"
                >
                  {t("cookie-consent.reject-all")}
                </Button>
                <Button
                  className="min-w-[140px] py-1 text-sm rounded-sm bg-gray-900 text-white"
                  onClick={acceptAllCookies}
                  color="blueish"
                >
                  {t("cookie-consent.accept-all")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
      <Consent
        visible={
          showModal || isConsentSubmitted
            ? "hidden"
            : undefined /* default value */
        }
        onAccept={() => {
          acceptAllCookies();
        }}
        buttonText={t("cookie-consent.accept-all")}
        ariaAcceptLabel={t("cookie-consent.accept-aria-label")}
        enableDeclineButton
        declineButtonText={t("cookie-consent.reject-all")}
        ariaDeclineLabel={t("cookie-consent.reject-aria-label")}
        flipButtons
        buttonWrapperClasses="flex flex-wrap gap-x-6 gap-y-3"
        containerClasses="bg-white rounded-lg container mx-auto shadow-lg mb-4 md:mb-6 flex-col px-10 py-8 gap-y-8"
        contentStyle={{
          flex: undefined, // to override defaults
          margin: undefined, // to override defaults
        }}
        style={{
          transform: "translate(calc(50vw - 50%))", // centers the container
          background: undefined, // to override defaults
          color: undefined, // to override defaults
        }}
        expires={365} /* TODO: why? */
        ButtonComponent={ButtonCookieConsent}
        cookieName={COOKIE_NAME}
      >
        <div className="text-sm" tabIndex={1}>
          <div className="mb-4 text-xl font-semibold">
            {t("cookie-consent.title")}
          </div>
          {t("cookie-consent.body")}
          <a
            className="text-red-600 underline cursor-pointer"
            onClick={() => setShowModal(true)}
            tabIndex={2}
          >
            {t("cookie-consent.setting")}
          </a>
        </div>
      </Consent>
    </div>
  );
};

export default CookieConsent;
