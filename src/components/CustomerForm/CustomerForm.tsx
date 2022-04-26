import React, { useEffect, useRef } from "react";

import { get } from "lodash";
import Resizer from "react-image-file-resizer";

import { Button, Icon, InputField, Tooltip, Typography } from "components";
import { useTranslation } from "react-i18next";

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
  const imageInputRef = useRef<HTMLInputElement | null>(null);
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

  const handleImageFile = (file: any) => {
    if (file.size > 5242880) {
      setError(fieldNamePrefix ? fieldNamePrefix + ".photo" : "photo", {
        message: t("buy-page.max-size-error"),
      });
      return;
    }
    clearErrors(fieldNamePrefix ? fieldNamePrefix + ".photo" : "photo");
    Resizer.imageFileResizer(
      file,
      400,
      400,
      "JPEG",
      50,
      0,
      (uri) => {
        // because performance issues when base64 img is in form
        onPhotoSet && onPhotoSet(uri ? (uri as string) : "");
        setValue &&
          uri &&
          setValue(
            fieldNamePrefix ? fieldNamePrefix + ".photo" : "photo",
            "set"
          );
      },
      "base64"
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file =
      e.target.files && e.target.files.length ? e.target.files[0] : undefined;

    if (file) {
      handleImageFile(file);
    }
  };

  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const onDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const file =
      event.dataTransfer.files && event.dataTransfer.files.length
        ? event.dataTransfer.files[0]
        : undefined;
    if (file) {
      handleImageFile(file);
    }
  };

  const openImageInput = () => {
    if (imageInputRef && imageInputRef.current) {
      imageInputRef.current.click();
    }
  };
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
        {photoRequired && (
          <div className="col-span-full grid gap-x-4 grid-cols-3">
            <div className="col-span-1">
              {image ? (
                <div
                  className="square overflow-hidden bg-center bg-cover bg-no-repeat"
                  style={{ backgroundImage: `url(${image})` }}
                />
              ) : (
                <>
                  <div
                    onClick={openImageInput}
                    className={`${
                      get(_errors, "photo.message")
                        ? "border-error border-2 border-solid"
                        : "border-2-softGray"
                    } w-full rounded-lg`}
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    onDragEnd={onDragEnter}
                  >
                    <div className="w-5/10 mx-auto">
                      <img
                        className="p-4 w-full"
                        src="/download-file.svg"
                        alt="User face placeholder"
                      />
                    </div>
                    <div className="p-4 text-sm text-fontBlack text-opacity-50 text-center">
                      {t("buy-page.photo-click")}
                    </div>
                  </div>
                  {get(_errors, "photo.message") && (
                    <div className="text-error">
                      {get(_errors, "photo.message")}
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="col-span-2">
              <Typography type="subtitle" fontWeight="medium">
                {t("buy-page.photo-title")}
              </Typography>
              <p className="leading-tight text-sm md:leading-normal md:text-base">
                {t("buy-page.photo-description")}
              </p>
              <input
                ref={imageInputRef}
                type="file"
                accept=".jpg,.jpeg,.png"
                hidden
                onChange={handleImageChange}
              />
              <div className="text-sm my-2">{t("buy-page.max-size")}</div>
              <Button
                thin
                rounded
                className="w-full lg:w-1/2 mb-4"
                onClick={openImageInput}
              >
                {t("buy-page.photo-upload")}
              </Button>
            </div>
          </div>
        )}
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
