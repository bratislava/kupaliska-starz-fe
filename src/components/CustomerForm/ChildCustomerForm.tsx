import React, { useEffect, useRef } from "react";

import { Button, Icon, InputField, Typography } from "components";
import { get } from "lodash";
import Resizer from "react-image-file-resizer";
import { useTranslation } from "react-i18next";

interface ChildCustomerFormProps {
  register: any;
  unregister: any;
  setValue?: any;
  fieldNamePrefix?: string;
  setError: any;
  clearErrors: any;
  errors?: any;
  className?: string;
  onPhotoSet?: (photo: string) => void;
  image?: string;
  childPhotoRequired?: boolean;
  onClear?: () => void;
}

const ChildCustomerForm = ({
  register,
  unregister,
  fieldNamePrefix,
  className = "",
  setValue,
  setError,
  clearErrors,
  errors,
  onPhotoSet,
  image,
  childPhotoRequired = true,
  onClear,
}: ChildCustomerFormProps) => {
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const _errors = fieldNamePrefix
    ? get(errors, `${fieldNamePrefix ? fieldNamePrefix : ""}`)
    : errors;
  const { t } = useTranslation();

  useEffect(() => {
    return () => {
      unregister &&
        unregister(`${fieldNamePrefix ? fieldNamePrefix + ".photo" : "photo"}`);
      unregister &&
        unregister(`${fieldNamePrefix ? fieldNamePrefix + ".name" : "name"}`);
      unregister &&
        unregister(`${fieldNamePrefix ? fieldNamePrefix + ".age" : "age"}`);
    };
  }, []);
  useEffect(() => {
    register &&
      register(`${fieldNamePrefix ? fieldNamePrefix + ".photo" : "photo"}`, {
        shouldUnregister: true,
      });
  }, [register, fieldNamePrefix]);

  const handleImageFile = (file: any) => {
    if (file !== undefined) {
      if (file.size > 5242880) {
        setError(fieldNamePrefix ? fieldNamePrefix + ".photo" : "photo", {
          message: "Veľkosť fotky musí byť menej ako 5MB",
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
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file =
      e.target.files && e.target.files.length ? e.target.files[0] : undefined;

    file && handleImageFile(file);
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
    <div className={`grid grid-cols-2 gap-4 lg:grid-cols-4 ${className}`}>
      <div className="col-span-2 flex">
        <InputField
          leftExtra={<Icon name="user" />}
          register={register}
          name={`${fieldNamePrefix ? fieldNamePrefix + ".name" : "name"}`}
          placeholder={t("buy-page.name")}
          error={get(_errors, "name.message")}
          shouldUnregister={true}
        />
        {onClear && (
          <div className="flex col-span-1 lg:hidden justify-end">
            <button
              type="button"
              className="flex justify-center focus:outline-none px-4"
              onClick={onClear}
            >
              <Icon className="pt-4" role="button" name="close" />
            </button>
          </div>
        )}
      </div>
      <InputField
        leftExtra={<Icon name="calendar" />}
        register={register}
        name={`${fieldNamePrefix ? fieldNamePrefix + ".age" : "age"}`}
        placeholder={t("buy-page.age")}
        className={`col-span-1`}
        error={get(_errors, "age.message")}
        shouldUnregister={true}
      />
      {onClear && (
        <div className="hidden col-span-1 lg:flex justify-end">
          <button
            type="button"
            className="flex justify-center focus:outline-none px-4"
            onClick={onClear}
          >
            <Icon className="pt-4" role="button" name="close" />
          </button>
        </div>
      )}
      {childPhotoRequired && (
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
                  onDragOver={onDragOver}
                  onDragEnter={onDragEnter}
                  onDrop={onDrop}
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
            <p className="leading-tight md:leading-normal">
              {t("buy-page.photo-description")}
            </p>
            <input
              ref={imageInputRef}
              type="file"
              hidden
              accept=".jpg,.png,.jpeg"
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
    </div>
  );
};

export default ChildCustomerForm;
