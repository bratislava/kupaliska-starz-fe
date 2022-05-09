import React from "react";

import { Icon, Tooltip } from "components";

import "./PersonManagement.css";
import { useTranslation } from "react-i18next";

const users = [{ name: "Janka Hrašková", age: 30 }];
const profile = {
  name: "Janko Hraško",
  age: 30,
  zip: 82103,
  email: "janko.hrasko@bratislava.sk",
};

const PersonManagement = () => {
  const { t } = useTranslation();

  return (
    <div
      className="
        container
        mx-auto
        py-8
        grid
        grid-cols-1
        md:grid-cols-2
        md:gap-x-8
      "
    >
      <Tooltip multiline={true} id="tooltip-buy-page" />

      <section className="w-full">
        <div className="mb-16">
          {/* TODO female/male */}
          <div className="font-medium text-2xl mb-10">{t("profile.user")}</div>

          <div className="flex flex-col md:flex-row">
            <img
              src="contact-form-image.png"
              alt="decoration for contact form"
              className="w-40 h-auto"
            />
            <div className="md:ml-12">
              <div className="mt-8">
                <div className="text-base font-normal text-gray-300">
                  {t("profile.name-surname")}
                </div>
                <div className="font-semibold text-2xl">{profile.name}</div>
              </div>
              <div className="mt-8">
                <div className="text-base font-normal text-gray-300">
                  {t("profile.email")}
                </div>
                <div className="font-semibold text-2xl">{profile.email}</div>
              </div>
              <div className="flex mt-8">
                <div className="mr-12">
                  <div className="text-base font-normal text-gray-300">
                    {t("profile.age")}
                  </div>
                  {/* TODO sklonovanie 2 roky/33 rokov*/}
                  <div className="font-semibold text-2xl">
                    {profile.age} {t("profile.age-full")}
                  </div>
                </div>
                <div>
                  <div className="text-base font-normal text-gray-300">
                    {t("profile.zip")}
                  </div>
                  <div className="font-semibold text-2xl">{profile.zip}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="font-medium text-2xl mb-10">
            {t("profile.others")}
          </div>
          <div className="flex">
            {users.map((user, index) => (
              <div key={index} className="text-center mr-16">
                <div className="flex flex-row">
                  <img
                    src="contact-form-image.png"
                    alt="decoration for contact form"
                    className="w-40 h-40 mb-3"
                  />
                  <div>
                    <div className="flex justify-center items-center bg-redish py-2 px-2 rounded-full w-8 h-8 -ml-4 -mt-4">
                      <Icon name="close" />
                    </div>
                  </div>
                </div>
                <div className="font-medium text-base mb-3">{user.name}</div>
                <div className="font-normal text-base mb-3">
                  {/* TODO sklonovanie 2 roky/33 rokov*/}
                  {user.age} {t("profile.age-full")}
                </div>
              </div>
            ))}
            <div className="w-40 h-40 border-2 border-blueish rounded-lg font-medium text-base text-center flex flex-col justify-center px-2">
              <div className="flex justify-center mb-5 bg-blueish py-5 px-5 rounded-full mx-auto">
                <Icon name="plus" />
              </div>
              {t("profile.add-others")}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PersonManagement;
