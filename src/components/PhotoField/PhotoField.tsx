import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import { get } from "lodash";
import Resizer from "react-image-file-resizer";

import { PersonComponent, Typography } from "components";
import Button from "components/Button/Button";
import { PersonComponentMode } from "../PersonComponent/PersonComponent";

interface PhotoFieldProps {
  setValue?: any;
  setError: any;
  clearErrors: any;
  errors?: any;
  onPhotoSet?: (photo: string | null) => void;
  image?: string | null;
}

const PhotoField = ({
  setValue,
  setError,
  clearErrors,
  errors,
  onPhotoSet,
  image,
}: PhotoFieldProps) => {
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const { t } = useTranslation();

  const handleImageFile = (file: any) => {
    if (file !== undefined) {
      if (file.size > 5242880) {
        setError("image", {
          message: t("common.photo-size"),
        });
        if (onPhotoSet) {
          onPhotoSet(null);
        }
        return;
      }
      clearErrors("image");
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
              "image",
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file =
      e.target.files && e.target.files.length ? e.target.files[0] : undefined;

    file && handleImageFile(file);
  };

  return (
    <div>
      <Typography type="subtitle" fontWeight="medium" className="mb-3">
        {t("buy-page.photo-title")}
      </Typography>
      <div className="flex gap-x-8">
        <div className="">
          <PersonComponent
            person={{ photo: image }}
            mode={PersonComponentMode.DisplayOnlyPhoto}
            onPersonClick={openImageInput}
            errorBorder={Boolean(get(errors, "image.message"))}
          ></PersonComponent>
          {get(errors, "image.message") && (
              <div className="text-error">{get(errors, "image.message")}</div>
          )}
        </div>
        <div className="">
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
            color="outlined"
            rounded
            className="w-full lg:w-1/2 mb-4"
            onClick={openImageInput}
          >
            {t("buy-page.photo-upload")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PhotoField;
