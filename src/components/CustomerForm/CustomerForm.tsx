import React, { useEffect } from "react";

import { get } from "lodash";

import { Icon, InputField, Tooltip } from "components";
import { useTranslation } from "react-i18next";
import PhotoField from "components/PhotoField/PhotoField";

interface CustomerFormProps {
  register: any;
  setValue?: any;
  photoRequired?: boolean;
  nameRequired?: boolean;
  fieldNamePrefix?: string;
  setError: any;
  clearErrors: any;
  errors?: any;
  className?: string;
  onPhotoSet?: (photo: string) => void;
  image?: string;
}

const CustomerForm = ({
  register,
  fieldNamePrefix,
  className = "",
  setValue,
  nameRequired = false,
  photoRequired = false,
  setError,
  clearErrors,
  errors,
  onPhotoSet,
  image,
}: CustomerFormProps) => {
  const _errors = fieldNamePrefix
    ? get(errors, `${fieldNamePrefix ? fieldNamePrefix : ""}`)
    : errors;
  const { t } = useTranslation();

  useEffect(() => {
    register &&
      register(`${fieldNamePrefix ? fieldNamePrefix + ".photo" : "photo"}`, {
        shouldUnregister: false,
      });
  }, [register, fieldNamePrefix]);

  return (
    <>
      <Tooltip multiline={true} id="tooltip-customer-form" />
      <div className={`grid grid-cols-1 gap-4 lg:grid-cols-2 ${className}`}>
        {nameRequired && (
          <InputField
            leftExtra={<Icon name="user" />}
            register={register}
            name={`${fieldNamePrefix ? fieldNamePrefix + ".name" : "name"}`}
            placeholder={t("buy-page.name")}
            className={`col-span-1`}
            error={get(_errors, "name.message")}
          />
        )}

        <InputField
          leftExtra={<Icon name="mail" />}
          register={register}
          name={`${fieldNamePrefix ? fieldNamePrefix + ".email" : "email"}`}
          placeholder={t("buy-page.email")}
          className={`col-span-1`}
          error={get(_errors, "email.message")}
        />
        {!nameRequired && <div className="col-span-1" />}
        {/*{photoRequired && (*/}
        {/*  <PhotoField*/}
        {/*    fieldNamePrefix={fieldNamePrefix}*/}
        {/*    setValue={setValue}*/}
        {/*    setError={setError}*/}
        {/*    clearErrors={clearErrors}*/}
        {/*    errors={_errors}*/}
        {/*    // onPhotoSet={onPhotoSet}*/}
        {/*    image={image}*/}
        {/*  />*/}
        {/*)}*/}
        <div className="col-span-1">
          <label className="font-medium text-fontBlack text-opacity-50 flex items-center my-2">
            {t("buy-page.optional")}
            <div
              data-for="tooltip-customer-form"
              data-tip={t("buy-page.help-us")}
            >
              <Icon className="ml-4" name="question-mark" color="primary" />
            </div>
          </label>
          <div className="grid gap-x-2 grid-cols-2">
            <InputField
              leftExtra={<Icon name="hashtag" />}
              register={register}
              name={`${fieldNamePrefix ? fieldNamePrefix + ".zip" : "zip"}`}
              placeholder={t("buy-page.zip")}
              className={`col-span-1`}
              error={get(_errors, "zip.message")}
            />

            <InputField
              leftExtra={<Icon name="calendar" />}
              register={register}
              type="number"
              name={`${fieldNamePrefix ? fieldNamePrefix + ".age" : "age"}`}
              placeholder={t("buy-page.age")}
              className={`col-span-1`}
              error={get(_errors, "age.message")}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomerForm;
