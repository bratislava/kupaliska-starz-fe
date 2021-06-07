import React, { useState } from "react";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link } from "react-router-dom";

import { Icon, InputField, Button } from "components";
import { useAppDispatch } from "hooks";
import { sendContactFormActions } from "store/global";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

const formRules = yup.object().shape({
  email: yup
    .string()
    .email("Prosím zadajte platný email")
    .required("Toto pole je povinné"),
  name: yup.string().required("Toto pole je povinné"),
  message: yup.string().required("Toto pole je povinné"),
});

export interface ContactFormValues {
  name: string;
  email: string;
  message: string;
}

const ContactForm = () => {
  const dispatch = useAppDispatch();
  const [sending, setSending] = useState<boolean>(false);
  const { executeRecaptcha } = useGoogleReCaptcha();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormValues>({
    mode: "onChange",
    resolver: yupResolver(formRules),
  });

  const onSubmit = (values: ContactFormValues) => {
    setSending(true);
    executeRecaptcha &&
      executeRecaptcha("contact_form")
        .then(
          (token) => {
            dispatch(
              sendContactFormActions({
                formData: values,
                recaptchaToken: token,
              })
            ).then((resp) => {
              if (resp.meta.requestStatus === "fulfilled") {
                reset();
              }
              setSending(false);
            });
          },
          () => setSending(false)
        )
        .catch(() => setSending(false));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 grid-cols-2">
      <InputField
        className="col-span-2 lg:col-span-1"
        name="name"
        register={register}
        leftExtra={<Icon name="user" />}
        placeholder="Meno"
        error={errors.name?.message}
      />
      <InputField
        className="col-span-2 lg:col-span-1"
        name="email"
        register={register}
        leftExtra={<Icon name="mail" />}
        placeholder="Email"
        error={errors.email?.message}
      />
      <InputField
        className="col-span-2"
        name="message"
        register={register}
        placeholder="Správa"
        error={errors.message?.message}
        element="textarea"
      />
      <span className="text-sm text-gray-400 col-span-full">
        Táto stránka je chránená reCAPTCHA a platia pravidlá{" "}
        <a
          className="link text-primary"
          target="_blank"
          rel="noreferrer"
          href="https://policies.google.com/privacy"
        >
          ochrany súkromia
        </a>{" "}
        a{" "}
        <a
          className="link text-primary"
          target="_blank"
          rel="noreferrer"
          href="https://policies.google.com/terms"
        >
          použitia služby
        </a>{" "}
        od Google.
      </span>
      <span className="col-span-full font-medium">
        Bližšie informácie o spracúvaní osobných údajov najdete{" "}
        <Link to="/gdpr" className="link text-primary">
          tu
        </Link>
        .
      </span>
      <Button
        disabled={sending}
        className="col-span-full lg:col-span-1"
        htmlType="submit"
      >
        Odoslať správu <Icon className="ml-4" name="paper-plane" />
      </Button>
    </form>
  );
};

export default ContactForm;
