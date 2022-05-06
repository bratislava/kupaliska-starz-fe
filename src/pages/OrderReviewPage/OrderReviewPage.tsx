import React, { useEffect } from "react";

import { push } from "connected-react-router";

import {
  Button,
  ChildCustomerInfoReviewPanel,
  CustomerInfoReviewPanel,
  Icon,
  SectionHeader,
  Spinner,
  TicketCard,
} from "components";
import { useAppDispatch, useAppSelector } from "hooks";
import {
  orderActions,
  selectCart,
  selectCustomerInfoFormValues,
  selectCustomerInfoPhotos,
  selectOrderDiscountCode,
  selectOrderPrice,
  selectOrderStateStatus,
} from "store/order";

import "./OrderReviewPage.css";
import { CustomerInfoFormValues } from "models";
import { orderFormValuesToOrderRequest } from "helpers/adapters";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { Trans, useTranslation } from "react-i18next";

// const paymentMethods = [
//   {
//     image: "google-pay.png",
//     alt: "google pay",
//   },
//   {
//     image: "apple-pay.png",
//     alt: "apple-pay",
//   },
//   {
//     image: "viamo.png",
//     alt: "viamo",
//   },
//   {
//     image: "bank.png",
//     alt: "banka",
//   },
// ];

const OrderReviewPage = () => {
  const dispatch = useAppDispatch();
  const cartItem = useAppSelector(selectCart);
  const formValues = useAppSelector(selectCustomerInfoFormValues);
  const customerPhotos = useAppSelector(selectCustomerInfoPhotos);
  const orderStateStatus = useAppSelector(selectOrderStateStatus);
  const discountCode = useAppSelector(selectOrderDiscountCode);
  const totalPrice = useAppSelector(selectOrderPrice);
  const { executeRecaptcha } = useGoogleReCaptcha();
  const { t } = useTranslation();

  useEffect(() => {
    (!formValues || !cartItem) && dispatch(push("/"));
  }, [formValues]);

  const onPay = async () => {
    if (cartItem && formValues && executeRecaptcha) {
      const token = await executeRecaptcha("order");
      console.log(token);
      dispatch(
        orderActions(
          orderFormValuesToOrderRequest({
            customer: formValues,
            cartItem,
            photos: customerPhotos,
            recaptchaToken: token,
            discountCodeState: discountCode,
          })
        )
      );
    }
  };

  return (
    <main className="container grid-ordering mx-auto grid gap-8 py-8 grid-cols-1 md:grid-cols-2">
      {orderStateStatus === "loading" && (
        <div className="bg-fontBlack bg-opacity-50 fixed inset-0 flex items-center justify-center">
          <Spinner />
        </div>
      )}

      <section className="col-span-1">
        <SectionHeader title="Kontrola údajov" />
        {formValues && (
          <CustomerInfoReviewPanel
            formValues={formValues}
            img={customerPhotos.photo}
          />
        )}
        <div
          className="divider"
          style={
            !(
              formValues &&
              formValues.children &&
              formValues.children.length > 0
            )
              ? { marginBottom: 0 }
              : {}
          }
        />
        {formValues &&
          formValues.children &&
          formValues.children.map((child, index) => (
            <React.Fragment key={child.name}>
              <ChildCustomerInfoReviewPanel
                index={index}
                key={child.name}
                formValues={child as CustomerInfoFormValues}
                img={
                  customerPhotos.childrenPhotos
                    ? customerPhotos.childrenPhotos[index]
                    : undefined
                }
              />
              <div className="divider" style={{ marginBottom: 0 }} />
            </React.Fragment>
          ))}
        <div className="text-sm text-gray-400 col-span-full mb-8 mt-1">
          <Trans i18nKey="landing.recaptcha" components={{ a: <a /> }} />
        </div>
        <div className="flex flex-col w-full lg:w-1/2">
          <Button
            onClick={() => dispatch(push("/order"))}
            className="w-full mb-4"
            color="outlined"
          >
            {t("order-review.edit-data")}
            <Icon className="ml-4" name="pencil" />
          </Button>
          <Button className="w-full mb-4" onClick={onPay}>
            {t("order-review.pay")}
            {totalPrice}
            € <Icon className="ml-4" name="credit-card" />
          </Button>
          {/* <div className="text-sm font-semibold text-center mb-4 text-opacity-80">
            Alebo si zvoľte iný spôsob platby
          </div>
          <div className={`grid gap-x-4 grid-cols-${paymentMethods.length}`}>
            {paymentMethods.map((method) => (
              <button
                key={method.alt}
                className="bg-white shadow rounded-lg p-2"
              >
                <img
                  className="w-6/10 mx-auto"
                  src={method.image}
                  alt={method.alt}
                />
              </button>
            ))}
          </div> */}
        </div>
      </section>
      <section className="col-span-1">
        <SectionHeader title="Rekapitulácia nákupu" />
        <div className="w-full lg:w-3/4">
          {cartItem && (
            <div key={cartItem.ticket.id} className="w-full flex flex-col">
              <TicketCard
                ticket={cartItem.ticket}
                initialAmount={cartItem.amount}
                displayOnly
                discount={discountCode?.amount}
              />
              {cartItem.childrenNumber > 0 && (
                <div className="w-full flex justify-between p-4 shadow-xs rounded-lg border-2-softGray mt-2">
                  <span className="text-xl font-bold">
                    + {cartItem.childrenNumber}x dieťa
                  </span>
                  <div>
                    <span
                      className={`text-xl font-bold ${
                        discountCode && discountCode.status === "OK"
                          ? "strikediag"
                          : ""
                      }`}
                    >
                      {Math.floor(
                        cartItem.childrenNumber *
                          (cartItem.ticket.childrenPrice
                            ? cartItem.ticket.childrenPrice
                            : 0) *
                          100
                      ) / 100}
                      €
                    </span>
                    {discountCode && discountCode.status === "OK" && (
                      <span className="text-xl font-bold ml-2 text-primary">
                        {Math.floor(
                          cartItem.childrenNumber *
                            (cartItem.ticket.childrenPrice
                              ? cartItem.ticket.childrenPrice
                              : 0) *
                            (discountCode.amount
                              ? (100 - discountCode.amount) / 100
                              : 1) *
                            100
                        ) / 100}
                        €
                      </span>
                    )}
                  </div>
                </div>
              )}
              <div className="text-fontBlack hidden md:block text-opacity-50 font-medium my-4 mx-3 xs:mx-6">
                <Trans
                  i18nKey={"order-review.review-muted"}
                  components={{ p: <p /> }}
                />
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default OrderReviewPage;
