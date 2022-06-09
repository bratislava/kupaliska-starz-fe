import {
  AssociatedSwimmer,
  createAssociatedSwimmer,
  editAssociatedSwimmer,
} from "../../store/associatedSwimmers/api";
import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQueryClient } from "react-query";
import { Button, Icon, InputField } from "../index";
import PhotoField from "../PhotoField/PhotoField";
import * as yup from "yup";
import { pick } from "lodash";

const validationSchema = yup.object({
  firstname: yup.string().required("Toto pole je povinné."),
  lastname: yup.string().required("Toto pole je povinné."),
  image: yup.string().required("Toto pole je povinné."),
  age: yup
    .number()
    .typeError("Toto pole je povinné.")
    .required("Toto pole je povinné.")
    .min(3, "Dieťa do 3 rokov má vstup na kúpalisko zdarma.")
    .max(150, "Zadaný vek musí byť menší ako 151."),
  zip: yup.string().nullable(),
});
export const AssociatedSwimmerEditAddForm = ({
  swimmer,
  onSaveSuccess = () => {},
}: {
  swimmer?: AssociatedSwimmer;
  onSaveSuccess?: () => void;
}) => {
  const { t } = useTranslation();
  const [photo, setPhoto] = useState<string | null>();
  const [photoChanged, setPhotoChanged] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(validationSchema),
    defaultValues: swimmer
      ? pick(swimmer, ["zip", "age", "image", "firstname", "lastname"])
      : undefined,
  });

  useEffect(() => {
    if (swimmer?.image) {
      setPhoto(swimmer?.image);
    }
  }, [swimmer]);

  const queryClient = useQueryClient();
  const mutation = useMutation(
    (formData) => {
      return swimmer
        ? editAssociatedSwimmer(swimmer.id as string, formData as any)
        : createAssociatedSwimmer(formData as any);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("associatedSwimmers");
        onSaveSuccess();
      },
    }
  );

  const onSubmit = (form: any) => {
    // TODO comment
    mutation.mutate({ ...form, image: photoChanged ? photo : undefined });
  };

  const handlePhotoChange = (photo: string | null) => {
    setPhoto(photo);
    setPhotoChanged(true);
  };

  return (
    <form
      className="grid grid-cols-1 lg:grid-cols-2"
      onSubmit={handleSubmit(onSubmit, (err) => {
        console.log(err);
      })}
    >
      <div>
        <InputField
          className="col-span-2 lg:col-span-1 max-w-formMax"
          name="firstname"
          register={register}
          label={"Meno"}
          error={errors.firstname?.message}
        />
        <InputField
          className="col-span-2 lg:col-span-1 mt-6 max-w-formMax"
          name="lastname"
          register={register}
          label={"Priezvisko"}
          error={errors.lastname?.message}
        />
        <InputField
          className="col-span-2 lg:col-span-1 mt-6 max-w-formMax"
          name="age"
          register={register}
          label={"Vek"}
          error={errors.age?.message}
          type="number"
          valueAsNumber={true}
        />
        <InputField
          className="col-span-2 lg:col-span-1 mt-6 max-w-formMax"
          name="zip"
          register={register}
          label={"PSČ"}
          error={errors.zip?.message}
        />
      </div>
      <div className="flex">
        <PhotoField
          setValue={setValue}
          setError={setError}
          clearErrors={clearErrors}
          errors={errors}
          onPhotoSet={handlePhotoChange}
          image={photo}
        ></PhotoField>
      </div>
      <div>
        <Button className="my-8" htmlType="submit">
          {t("profile.save")}
          <Icon className="ml-4" name="arrow-left" />
        </Button>
      </div>
    </form>
  );
};

export default AssociatedSwimmerEditAddForm;
