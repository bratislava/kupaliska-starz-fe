import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import { get } from "lodash";
import Resizer from "react-image-file-resizer";

import { Typography } from "components";
import Button from "components/Button/Button";

interface SectionHeaderProps {
  setValue?: any;
  fieldNamePrefix?: string;
  setError: any;
  clearErrors: any;
  errors?: any;
  onPhotoSet?: (photo: string) => void;
  image?: string;
}

const PhotoField = ({
  fieldNamePrefix,
  setValue,
  setError,
  clearErrors,
  errors,
  onPhotoSet,
  image,
}: SectionHeaderProps) => {
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const { t } = useTranslation();

  const handleImageFile = (file: any) => {
    if (file !== undefined) {
      if (file.size > 5242880) {
        setError(fieldNamePrefix ? fieldNamePrefix + ".photo" : "photo", {
          message: t("common.photo-size"),
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

  const openImageInput = () => {
    if (imageInputRef && imageInputRef.current) {
      imageInputRef.current.click();
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file =
      e.target.files && e.target.files.length ? e.target.files[0] : undefined;

    file && handleImageFile(file);
  };

  return (
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
                get(errors, "photo.message")
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
            {get(errors, "photo.message") && (
              <div className="text-error">{get(errors, "photo.message")}</div>
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
  );
};

export default PhotoField;
