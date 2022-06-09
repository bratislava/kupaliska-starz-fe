import React, { useEffect, useState } from "react";
import PhotoField from "../PhotoField/PhotoField";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Icon, InputField } from "../index";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { fetchUser, updateUser, User } from "../../store/user/api";
import { useHistory } from "react-router-dom";
import ProfileLine from "../ProfileLine/ProfileLine";
import ProfileBack from "../ProfileBack/ProfileBack";
import { pick } from "lodash";

const validationSchema = yup.object({
  image: yup.string().required("Toto pole je povinné."),
  age: yup
    .number()
    .typeError("Toto pole je povinné.")
    .required("Toto pole je povinné.")
    .min(0, "Zadaný vek musí byť väčší ako 0.")
    .max(150, "Zadaný vek musí byť menší ako 151."),
  zip: yup.string().nullable(),
});

const ProfileEditForm = ({ user }: { user: User }) => {
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
    // TODO comment image
    defaultValues: {
      ...pick(user, ["age", "zip"]),
      image: user.image ? "set" : undefined,
    },
  });
  const { t } = useTranslation();

  const [photo, setPhoto] = useState<string | null>();
  const [photoChanged, setPhotoChanged] = useState(false);

  const queryClient = useQueryClient();
  const history = useHistory();

  useEffect(() => {
    if (user?.image) {
      setPhoto(user?.image);
    }
  }, [user]);

  const mutation = useMutation(
    (formData) => {
      return updateUser(formData as any);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("user");
        history.push("/profile");
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
      className="grid grid-cols-1 gap-4 lg:grid-cols-2"
      onSubmit={handleSubmit(onSubmit, (err) => {
        console.log(err);
      })}
    >
      <div>
        <InputField
          className="col-span-2 lg:col-span-1 max-w-formMax"
          name="age"
          register={register}
          label="Vek"
          error={errors.age?.message}
          type="number"
          valueAsNumber={true}
        />
        <InputField
          className="col-span-2 lg:col-span-1 mt-6 max-w-formMax"
          name="zip"
          register={register}
          label="PSČ"
          error={errors.zip?.message}
        />
        <Button className="my-8" htmlType="submit">
          {t("profile.save")}
          <Icon className="ml-4" name="arrow-left" />
        </Button>
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
    </form>
  );
};

const ProfileEditPage = () => {
  const userQuery = useQuery("user", fetchUser);
  const { t } = useTranslation();

  return (
    <section className="w-full">
      <div className="container mx-auto">
        <ProfileBack></ProfileBack>
        <ProfileLine></ProfileLine>

        {userQuery.isSuccess &&
          (userQuery.data.data.age == null ||
            userQuery.data.data.image == null) && (
            <div className="bg-warningSoft py-5 px-6 mt-14 shadow-lg flex items-center flex-col md:flex-row">
              <img
                src="/warning.svg"
                alt=""
                className="mr-0 md:mr-4 mb-5 md:mb-0"
              />
              <div className="text-center">
                Pre nákup permanentky je potrebné vyplniť vek a fotografiu.
              </div>
            </div>
          )}
        <div className="mt-14">
          <div className="font-medium text-2xl mb-4 md:mb-8">
            {t("profile.user")}
          </div>
        </div>
        {userQuery.isSuccess && (
          <ProfileEditForm user={userQuery.data.data}></ProfileEditForm>
        )}
      </div>
    </section>
  );
};

export default ProfileEditPage;
