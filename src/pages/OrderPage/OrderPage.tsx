import React, {
  ChangeEvent,
  PropsWithChildren,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  AssociatedSwimmerEditAddForm,
  Button,
  CheckboxField,
  Icon,
  InputField,
  Modal,
  Tooltip,
} from "../../components";
import { useWindowSize } from "../../hooks";
import cx from "classnames";
import PeopleList, {
  PeopleListMode,
} from "../../components/PeopleList/PeopleList";
import {
  AssociatedSwimmer,
  fetchAssociatedSwimmers,
} from "../../store/associatedSwimmers/api";
import { QueryObserverResult, useQuery, useQueryClient } from "react-query";
import { useErrorToast } from "../../hooks/useErrorToast";
import { useOrderTicket } from "./useOrderTicket";
import { useTranslation } from "react-i18next";
import { useAccount } from "@azure/msal-react";
import { CheckPriceResponse, Ticket } from "../../models";
import {
  checkDiscountCode,
  DiscountCodeResponse,
  getPrice,
} from "../../store/order/api";
import to from "await-to-js";
import { AxiosError, AxiosResponse } from "axios";
import {
  FieldErrors,
  useForm,
  UseFormGetValues,
  UseFormWatch,
  useWatch,
  UseFormSetValue,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { NumberSchema, StringSchema } from "yup";
import { useIsMounted } from "usehooks-ts";
import { fetchUser } from "../../store/user/api";
import { AccountInfo } from "@azure/msal-browser";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "./OrderPage.css";
import { Link, useHistory } from "react-router-dom";
import { useOrder } from "./useOrder";
import { orderFormToRequests } from "./formDataToRequests";
import { UseFormRegister } from "react-hook-form/dist/types/form";
import { environment } from "../../environment";

const OrderPageCreateSwimmerModal = ({
  open = false,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  return (
    <Modal open={open} onClose={onClose} closeButton={true}>
      <div
        className="block bg-white rounded-lg p-10 text-primary shadow-lg modal-with-close-width-screen"
        style={{ maxWidth: "730px" }}
      >
        <AssociatedSwimmerEditAddForm
          onSaveSuccess={onClose}
        ></AssociatedSwimmerEditAddForm>
      </div>
    </Modal>
  );
};

const OrderPageAddSwimmerModal = ({
  data,
  open = false,
  onClose,
  onConfirm = () => {},
  selectedSwimmersIds,
}: {
  data: Partial<AssociatedSwimmer>[];
  open: boolean;
  onClose: () => void;
  onConfirm?: (data: (string | null)[]) => void;
  selectedSwimmersIds: (string | null)[];
}) => {
  const [addSwimmerModalOpen, setAddSwimmerModalOpen] = useState(false);
  const [selectedSwimmersIdsEditing, setSelectedSwimmersIdsEditing] =
    useState(selectedSwimmersIds);

  useEffect(() => {
    setSelectedSwimmersIdsEditing(selectedSwimmersIds);
  }, [selectedSwimmersIds]);

  const handlePersonClick = (clickedPerson: Partial<AssociatedSwimmer>) => {
    if (clickedPerson.id === undefined) {
      return;
    }
    if (selectedSwimmersIdsEditing.includes(clickedPerson.id)) {
      setSelectedSwimmersIdsEditing(
        selectedSwimmersIdsEditing.filter((p) => p !== clickedPerson.id)
      );
    } else {
      setSelectedSwimmersIdsEditing([
        ...selectedSwimmersIdsEditing,
        clickedPerson.id,
      ]);
    }
  };

  const handleConfirm = () => {
    onConfirm(selectedSwimmersIdsEditing);
  };

  const handleAddSwimmerClick = () => {
    setAddSwimmerModalOpen(true);
  };

  const handleAddSwimmerClose = () => {
    setAddSwimmerModalOpen(false);
  };

  return (
    <>
      <OrderPageCreateSwimmerModal
        open={addSwimmerModalOpen}
        onClose={handleAddSwimmerClose}
      ></OrderPageCreateSwimmerModal>
      <Modal
        open={open && !addSwimmerModalOpen}
        onClose={onClose}
        button={
          <Button
            onClick={handleConfirm}
            disabled={selectedSwimmersIdsEditing.length < 1}
          >
            Potvrdiť výber
          </Button>
        }
        closeButton={true}
      >
        <div
          className="block bg-white rounded-lg p-10 text-primary shadow-lg modal-with-close-width-screen"
          style={{ maxWidth: "730px" }}
        >
          <div className="pb-6 text-center font-bold">
            Momentálne máte v profile pridané tieto osoby:
          </div>
          <NumberedLayoutLine></NumberedLayoutLine>
          <PeopleList
            people={data}
            onAddClick={handleAddSwimmerClick}
            onPersonClick={handlePersonClick}
            mode={PeopleListMode.OrderPageSelection}
            selectedPeopleIds={selectedSwimmersIdsEditing}
          ></PeopleList>
        </div>
      </Modal>
    </>
  );
};

const NumberedLayoutIndexCounter = ({ index }: { index: number }) => {
  return (
    <div className="bg-blueish rounded-full text-primary font-semibold text-4xl w-12 flex-shrink-0 h-12 grid place-content-center">
      {index}
    </div>
  );
};

const NumberedLayoutLine = ({ className }: { className?: string }) => (
  <div
    className={cx(
      "border border-fontBlack border-3 opacity-10 flex-grow h-0 w-full",
      className
    )}
  ></div>
);

/* Creates this effect https://imgur.com/TLn9kOW */
const NumberedLayout = ({
  children,
  index,
  first = false,
}: PropsWithChildren<{ index: number; first?: boolean }>) => {
  const { width } = useWindowSize();
  const absoluteDiv = useRef<any>();
  const [showIndexOutside, setShowIndexOutside] = useState<boolean>(true);
  useEffect(() => {
    const left = absoluteDiv.current.getBoundingClientRect().left;
    setShowIndexOutside(left >= 20);
  }, [width]);

  return (
    <>
      {!first && showIndexOutside && (
        <NumberedLayoutLine className={"mb-5"}></NumberedLayoutLine>
      )}
      <div className="relative">
        <div
          style={{ left: "-88px" }}
          ref={absoluteDiv}
          className={cx("absolute", { invisible: !showIndexOutside })}
        >
          <NumberedLayoutIndexCounter
            index={index}
          ></NumberedLayoutIndexCounter>
        </div>

        <div className={cx("flex items-center", { hidden: showIndexOutside })}>
          <div>
            <NumberedLayoutIndexCounter
              index={index}
            ></NumberedLayoutIndexCounter>
          </div>
          <NumberedLayoutLine className="ml-4"></NumberedLayoutLine>
        </div>
        <div className="p-3">{children}</div>
      </div>
    </>
  );
};

const OrderPageEmail = ({
  requireEmail,
  register,
  errors,
}: {
  requireEmail: boolean;
  register: UseFormRegister<OrderFormData>;
  errors: FieldErrors<OrderFormData>;
}) => {
  const { t } = useTranslation();
  const account = useAccount();

  return requireEmail ? (
    <InputField
      className="mt-6 max-w-formMax"
      name="email"
      register={register}
      label="Email"
      error={errors.email?.message}
    />
  ) : (
    <span>Lístky zašleme na {account?.username}.</span>
  );
};

const OrderPageOptionalFields = ({
  register,
  errors,
}: {
  register: UseFormRegister<OrderFormData>;
  errors: FieldErrors<OrderFormData>;
}) => {
  const { t } = useTranslation();

  return (
    <>
      <Tooltip multiline={true} id="tooltip-customer-form" />
      <label className="font-medium text-fontBlack font-medium text-xl flex items-center mt-6">
        {t("buy-page.optional")}
        <div data-for="tooltip-customer-form" data-tip={t("buy-page.help-us")}>
          <Icon className="ml-4" name="question-mark" color="blueish" />
        </div>
      </label>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <InputField
          className="col-span-2 lg:col-span-1 mt-6 max-w-formMax"
          name="age"
          register={register}
          placeholder="Vek"
          error={errors.age?.message}
          type="number"
          valueAsNumber={true}
        />
        <InputField
          className="col-span-2 lg:col-span-1 mt-6 max-w-formMax"
          name="zip"
          register={register}
          placeholder="PSČ"
          error={errors.zip?.message}
        />
      </div>
    </>
  );
};

const OrderPagePeopleList = ({
  errors,
  watch,
  setValue,
}: {
  errors: FieldErrors<OrderFormData>;
  watch: UseFormWatch<OrderFormData>;
  setValue: UseFormSetValue<OrderFormData>;
}) => {
  const [showAddPersonModal, setShowAddPersonModal] = useState(false);
  const selectedSwimmerIds = watch("selectedSwimmerIds") as (string | null)[];

  const associatedSwimmersQuery = useQuery(
    "associatedSwimmers",
    fetchAssociatedSwimmers
  );
  const userQuery = useQuery("user", fetchUser);
  const account = useAccount();
  const dispatchErrorToast = useErrorToast();

  /* Merges the list of associated swimmers with the logged in user. */
  const mergedSwimmers = useMemo(() => {
    return (
      associatedSwimmersQuery.data &&
      userQuery.data && [
        {
          id: null,
          age: userQuery.data.data.age,
          zip: userQuery.data.data.zip,
          photo: userQuery.data.data.image,
          firstname: (account as AccountInfo).name,
        },
        ...associatedSwimmersQuery.data.data.associatedSwimmers,
      ]
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [associatedSwimmersQuery.data, userQuery.data]);

  const error = associatedSwimmersQuery.error || userQuery.error;

  useEffect(() => {
    if (error) {
      dispatchErrorToast();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  const selectedSwimmers = useMemo(() => {
    if (!mergedSwimmers) {
      return;
    }
    return mergedSwimmers.filter((s) => selectedSwimmerIds.includes(s.id));
  }, [mergedSwimmers, selectedSwimmerIds]);

  const handleOnAddClick = () => {
    setShowAddPersonModal(true);
  };

  const handleModalClose = () => {
    setShowAddPersonModal(false);
  };

  const handleConfirm = (value: (string | null)[]) => {
    setValue("selectedSwimmerIds", value);
    setShowAddPersonModal(false);
  };

  const handleRemove = (swimmer: Partial<AssociatedSwimmer>) => {
    const value = selectedSwimmerIds.filter((s) => s !== swimmer.id);
    setValue("selectedSwimmerIds", value);
  };

  return (
    <>
      {mergedSwimmers && (
        <OrderPageAddSwimmerModal
          data={mergedSwimmers}
          open={showAddPersonModal}
          onClose={handleModalClose}
          selectedSwimmersIds={selectedSwimmerIds}
          onConfirm={handleConfirm}
        ></OrderPageAddSwimmerModal>
      )}

      {selectedSwimmers && (
        <PeopleList
          people={selectedSwimmers}
          onAddClick={handleOnAddClick}
          onRemoveClick={handleRemove}
          mode={PeopleListMode.OrderPageDisplay}
          removeDisabled={selectedSwimmers.length <= 1}
        ></PeopleList>
      )}

      <div className="text-error px-2 text-sm">
        {errors.selectedSwimmerIds?.map((field) => field.message).join("/n")}
      </div>
    </>
  );
};

const OrderPageDiscountCode = ({
  ticket,
  setValue,
  getValues,
}: {
  ticket: Ticket;
  setValue: UseFormSetValue<OrderFormData>;
  getValues: UseFormGetValues<OrderFormData>;
}) => {
  const [useDiscountCode, setUseDiscountCode] = useState(false);

  const handleUseDiscountCodeChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const { checked } = event.target;
    setUseDiscountCode(checked);
    if (!checked && getValues("discountCode") != null) {
      setValue("discountCode", null);
    }
  };

  return (
    <>
      <CheckboxField
        valueOfInput={useDiscountCode}
        onChange={handleUseDiscountCodeChange}
        label={<>Uplatniť zľavový kód</>}
      />
      {useDiscountCode && (
        <OrderPageDiscountCodeInput
          ticket={ticket}
          setValue={setValue}
        ></OrderPageDiscountCodeInput>
      )}
    </>
  );
};

enum OrderPageDiscountCodeInputStatus {
  None,
  Success,
  Error,
}

const OrderPageDiscountCodeInput = ({
  ticket,
  setValue,
}: {
  ticket: Ticket;
  setValue: UseFormSetValue<OrderFormData>;
}) => {
  const dispatchErrorToast = useErrorToast();
  const isMounted = useIsMounted();

  const [discountCode, setDiscountCode] = useState("");
  const [status, setStatus] = useState(OrderPageDiscountCodeInputStatus.None);

  const handleApply = async () => {
    setValue("discountCode", null);
    setStatus(OrderPageDiscountCodeInputStatus.None);

    const [error, response] = await to<
      AxiosResponse<DiscountCodeResponse>,
      AxiosError
    >(checkDiscountCode(ticket.id, discountCode));
    if (!isMounted()) {
      return;
    }
    if (response) {
      setValue("discountCode", response.data.discountCode);
      setStatus(OrderPageDiscountCodeInputStatus.Success);
      return;
    }
    const errorStatus = error?.response?.status;
    if (errorStatus === 404 || errorStatus === 400) {
      setStatus(OrderPageDiscountCodeInputStatus.Error);
    } else {
      dispatchErrorToast();
    }
  };

  return (
    <>
      <InputField
        value={discountCode}
        onChange={(event) => setDiscountCode(event.target.value)}
        error={
          status === OrderPageDiscountCodeInputStatus.Error
            ? "Neplatný zľavový kód."
            : undefined
        }
        label="Vložte zľavový kód"
        rightExtra={
          status === OrderPageDiscountCodeInputStatus.Success ? (
            <Icon name="checkmark" className="text-success" />
          ) : null
        }
      />
      <Button color="outlined" onClick={handleApply}>
        Uplatniť
      </Button>
    </>
  );
};

const validationSchema = yup.object({
  email: yup
    .string()
    .when("$requireEmail", (requireEmail: boolean, schema: StringSchema) => {
      if (requireEmail) {
        return schema
          .email("Zadajte platný email.")
          .required("Zadajte platný email.");
      }
      return schema;
    }),
  ticketAmount: yup
    .number()
    .when(
      "$hasTicketAmount",
      (hasTicketAmount: boolean, schema: NumberSchema) => {
        if (hasTicketAmount) {
          return schema
            .min(1)
            .max(environment.maxTicketPurchaseLimit)
            .required();
        }
        return schema;
      }
    ),
  /* TODO: improve */
  discountCode: yup.object().nullable(true),
  /* TODO: improve */
  selectedSwimmerIds: yup.array(),
  // .when("$hasSwimmers", (hasSwimmers: boolean, schema: ArraySchema<any>) => {
  //   if (hasSwimmers) {
  //     return schema.min(1, "adasd");
  //     // .of(yup.mixed().oneOf([yup.string(), null]));
  //   }
  //   return schema;
  // }),
  agreement: yup
    .boolean()
    .isTrue("Potvrďte prosím prečítanie všeobecných obchodných podmienok."),
  age: yup
    .number()
    .when(
      "$hasOptionalFields",
      (hasOptionalFields: boolean, schema: NumberSchema) => {
        if (hasOptionalFields) {
          return schema
            .optional()
            .nullable(true)
            .min(0, "Zadaný vek musí byť vyšší ako 0.")
            .max(150, "Zadaný vek musí byť nižší ako 151.")
            .transform((val) => (isNaN(val) ? null : val));
        }
        return schema;
      }
    ),
  zip: yup
    .string()
    .when(
      "$hasOptionalFields",
      (hasOptionalFields: boolean, schema: StringSchema) => {
        if (hasOptionalFields) {
          return schema.optional().nullable(true);
        }
        return schema;
      }
    ),
});

const OrderPageSummary = ({
  ticket,
  hasTicketAmount,
  setValue,
  watch,
  priceQuery,
}: {
  ticket: Ticket;
  hasTicketAmount: boolean;
  setValue: UseFormSetValue<OrderFormData>;
  watch: UseFormWatch<OrderFormData>;
  priceQuery: QueryObserverResult<
    AxiosResponse<CheckPriceResponse, any>,
    unknown
  >;
}) => {
  const watchTicketAmount = watch("ticketAmount");

  const handleMinusClick = () => {
    if (watchTicketAmount! > 1) {
      setValue("ticketAmount", watchTicketAmount! - 1);
    }
  };
  const handlePlusClick = () => {
    if (watchTicketAmount! < environment.maxTicketPurchaseLimit) {
      setValue("ticketAmount", watchTicketAmount! + 1);
    }
  };

  return (
    <div className="mt-8 mb-12 rounded-lg bg-white shadow-lg max-w-lg mb-6 md:mb-12">
      <div className="p-8">
        <div className="font-semibold text-2xl">
          {hasTicketAmount && `${watchTicketAmount}x `}
          {ticket.name}
        </div>
        {ticket.childrenAllowed && (
          <p className="mt-2 font-bold">
            {priceQuery.isFetching ? (
              <div style={{ maxWidth: "200px" }}>
                <Skeleton />
              </div>
            ) : (
              priceQuery.isSuccess && (
                <OrderPageAdultChildrenCount
                  pricing={priceQuery.data?.data.data.pricing}
                  watch={watch}
                ></OrderPageAdultChildrenCount>
              )
            )}
          </p>
        )}
        <p className="mt-4">{ticket.description}</p>
        <br />
        {ticket.childrenAllowed && (
          <p className="font-semibold">
            {/* TODO pluralizacia */}
            Možnosť pridať {ticket.childrenMaxNumber} detí za zvýhodnenú cenu{" "}
            {ticket.childrenPrice} €.
          </p>
        )}
      </div>
      <div className="flex bg-blueish px-8 py-4 rounded-b-lg items-center">
        {hasTicketAmount && (
          <div className="border-primary border-solid rounded-lg border-2 px-6 py-3 mr-8 text-primary flex-shrink-0">
            <button
              className="mr-6 leading-5	text-3xl align-top"
              onClick={handleMinusClick}
              type="button"
            >
              -
            </button>
            <span className="font-bold">{watchTicketAmount}</span>
            <button
              className="ml-6 leading-5 text-3xl align-top"
              onClick={handlePlusClick}
              type="button"
            >
              +
            </button>
          </div>
        )}
        <span className="text-xl text-primary font-bold">
          <SkeletonTheme
            baseColor="#a8dbf2"
            highlightColor="#58bbe6"
            duration={1}
            width={40}
            height={28}
          >
            {priceQuery.isFetching ? (
              <Skeleton />
            ) : (
              priceQuery.isSuccess && (
                <OrderPagePrice
                  pricing={priceQuery.data?.data.data.pricing}
                ></OrderPagePrice>
              )
            )}
          </SkeletonTheme>
        </span>
      </div>
    </div>
  );
};

const OrderPageAdultChildrenCount = ({
  pricing,
  watch,
}: {
  pricing: CheckPriceResponse["data"]["pricing"];
  watch: UseFormWatch<OrderFormData>;
}) => {
  const watchSelectedSwimmerIds = watch("selectedSwimmerIds") as (
    | string
    | null
  )[];

  const adultCount = watchSelectedSwimmerIds.length - pricing.numberOfChildren;
  const childrenCount = pricing.numberOfChildren;

  const adult = adultCount > 0 ? `${adultCount}x dospelá osoba` : null;
  const children = childrenCount > 0 ? `${childrenCount}x dieťa` : null;

  return <>({[adult, children].filter(Boolean).join(" + ")})</>;
};

const OrderPagePrice = ({
  pricing,
}: {
  pricing: CheckPriceResponse["data"]["pricing"];
}) => {
  const fullPrice =
    pricing.discount > 0 ? (
      <div className="inline-block strikethrough-diagonal mr-2">
        {pricing.orderPrice + pricing.discount} €
      </div>
    ) : null;
  const orderPrice = <div className="inline-block">{pricing.orderPrice} €</div>;
  return (
    <>
      {fullPrice}
      {orderPrice}
    </>
  );
};

const OrderPage = () => {
  const {
    ticket,
    requireEmail,
    hasOptionalFields,
    hasSwimmers,
    hasTicketAmount,
  } = useOrderTicket();
  const order = useOrder();
  const dispatchErrorToast = useErrorToast();

  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    control,
    formState: { errors },
  } = useForm<OrderFormData>({
    mode: "onChange",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      ...(hasSwimmers ? { selectedSwimmerIds: [null] } : {}),
      ...(hasTicketAmount ? { ticketAmount: 1 } : {}),
    },
    context: {
      requireEmail,
      hasOptionalFields,
      hasSwimmers,
      hasTicketAmount,
    },
  });

  const userQuery = useQuery("user", fetchUser);
  const history = useHistory();

  useEffect(() => {
    if (!userQuery.data) {
      return;
    }

    if (
      userQuery.data &&
      hasSwimmers &&
      (userQuery.data.data.age == null || userQuery.data.data.image == null)
    ) {
      // If the ticket requires swimmers ("requireName") and the user has no age or image profile he/she has to fill it
      // in, so he/she is redirected.
      history.push("/profile/edit");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userQuery.data]);

  // Must be any, otherwise type checking fails.
  //
  // Failed to compile.
  //
  // fork-ts-checker-webpack-plugin error in undefined(undefined,undefined):
  // Maximum call stack size exceeded  TSINTERNAL
  const watchPriceChange = useWatch<any>({
    // Those properties are those who trigger possible change of the price.
    name: [
      "ticketAmount",
      "discountCode",
      "selectedSwimmerIds",
      "ticketAmount",
    ],
    control,
  });

  const getRequestsFromFormData = () =>
    orderFormToRequests(getValues(), ticket!, {
      requireEmail: requireEmail!,
      hasOptionalFields: hasOptionalFields!,
      hasSwimmers: hasSwimmers!,
      hasTicketAmount: hasTicketAmount!,
    });

  const priceQuery = useQuery("orderPrice", ({ signal }) => {
    const { getPriceRequest } = getRequestsFromFormData();

    return getPrice(getPriceRequest, signal);
  });

  useEffect(() => {
    if (priceQuery.isError) {
      dispatchErrorToast();
    }
  }, [priceQuery.isError])

  const queryClient = useQueryClient();

  useEffect(() => {
    // If the price should change, cancel current queries and fetch a new price.
    queryClient.cancelQueries("orderPrice");
    queryClient.refetchQueries("orderPrice");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchPriceChange]);

  const onSubmit = async () => {
    const { orderRequest } = getRequestsFromFormData();

    await order(orderRequest);
  };

  const buyButton = (
    <Button
      className="mb-4"
      htmlType="submit"
      disabled={priceQuery.isFetching || priceQuery.isError}
    >
      {priceQuery.isSuccess && !priceQuery.isFetching
        ? `Zaplatiť ${priceQuery.data.data.data.pricing.orderPrice} €`
        : "Zaplatiť"}
      <Icon className="ml-4" name="credit-card" />
    </Button>
  );

  return ticket ? (
    <>
      <form
        className="container mx-auto py-8 grid grid-cols-1 md:grid-cols-2 md:gap-x-8"
        onSubmit={handleSubmit(onSubmit, (err) => {
          console.log(err);
        })}
      >
        <div>
          <div className="text-2xl md:text-3xl font-semibold mb-4">
            Osobné údaje
          </div>

          <NumberedLayout index={1} first={true}>
            <div className="font-semibold mb-7">Kupujúci/a</div>

            <OrderPageEmail
              requireEmail={requireEmail!}
              register={register}
              errors={errors}
            ></OrderPageEmail>
            {hasOptionalFields && (
              <OrderPageOptionalFields
                register={register}
                errors={errors}
              ></OrderPageOptionalFields>
            )}
            {hasSwimmers && (
              <OrderPagePeopleList
                watch={watch}
                setValue={setValue}
                errors={errors}
              ></OrderPagePeopleList>
            )}
          </NumberedLayout>

          <NumberedLayout index={2} first={false}>
            <OrderPageDiscountCode
              ticket={ticket}
              setValue={setValue}
              getValues={getValues}
            ></OrderPageDiscountCode>
          </NumberedLayout>

          <NumberedLayout index={3} first={false}>
            <CheckboxField
              register={register}
              name="agreement"
              error={errors.agreement?.message}
              label={
                <>
                  {t("buy-page.vop")}
                  <Link to="/vop" target="_blank" className="link text-primary">
                    {t("buy-page.vop-link")}
                  </Link>
                  .
                </>
              }
            />
          </NumberedLayout>
          <div className="hidden md:block">{buyButton}</div>
        </div>
        <div>
          <span className="text-2xl md:text-3xl font-semibold mb-4">
            Rekapitulácia nákupu
          </span>
          <OrderPageSummary
            ticket={ticket}
            hasTicketAmount={hasTicketAmount!}
            setValue={setValue}
            watch={watch}
            priceQuery={priceQuery}
          ></OrderPageSummary>
          <div className="text-gray color-fontBlack">
            {!ticket.childrenAllowed && (
              <p className="mb-2">
                Cena je jednotná pre všetky vekové skupiny.
              </p>
            )}
            <p className="mb-2">
              Študentské a seniorské zľavy je možné uplatniť iba pri osobnom
              nákupe priamo na kúpalisku.
            </p>
            <p>Dieťa do 3 rokov má vstup na kúpalisko zdarma.</p>
          </div>
        </div>
        <div className="block md:hidden">{buyButton}</div>
      </form>
    </>
  ) : (
    <></>
  );
};

export interface OrderFormData {
  email?: string;
  ticketAmount?: number;
  discountCode?: DiscountCodeResponse["discountCode"] | null;
  selectedSwimmerIds?: (string | null)[];
  agreement?: boolean;
  age?: number;
  zip?: string;
}

export default OrderPage;
