import React, { useState } from "react";
import { Button, Icon, Modal, PeopleList, ProfileNavBar } from "components";
import { useTranslation } from "react-i18next";
import PersonComponent, {
  PersonComponentMode,
} from "../../components/PersonComponent/PersonComponent";
import { PeopleListMode } from "../../components/PeopleList/PeopleList";
import {
  AssociatedSwimmer,
  AssociatedSwimmerFetchResponse,
  deleteAssociatedSwimmer,
  fetchAssociatedSwimmers,
} from "../../store/associatedSwimmers/api";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { fetchUser, User } from "../../store/user/api";
import { useAccount } from "@azure/msal-react";
import { useHistory } from "react-router-dom";
import ProfileLine from "../../components/ProfileLine/ProfileLine";
import { AxiosResponse } from "axios";
import { produce } from "immer";

const UserInfo = ({ user }: { user: User }) => {
  const { t } = useTranslation();
  const account = useAccount();
  const history = useHistory();

  const handleProfileEditClick = () => {
    history.push("/profile/edit");
  };

  return (
    <div className="flex flex-col md:flex-row">
      <PersonComponent
        mode={PersonComponentMode.DisplayOnlyPhoto}
        person={{ image: user.image }}
      ></PersonComponent>

      <div className="mt-6 md:mt-0 md:ml-12">
        <div>
          <div className="text-base font-normal text-fontBlack opacity-75">
            {t("profile.name-firstname")}
          </div>
          <div className="font-semibold text-2xl">
            {account?.idTokenClaims?.given_name}{" "}
            {account?.idTokenClaims?.family_name}
          </div>
        </div>
        <div className="mt-8">
          <div className="text-base font-normal text-fontBlack opacity-75">
            {t("profile.email")}
          </div>
          <div className="font-semibold text-2xl">{account?.username}</div>
        </div>
        <div className="flex mt-8">
          <div className="mr-12">
            <div className="text-base font-normal text-fontBlack opacity-75">
              {t("profile.age")}
            </div>
            {/* TODO sklonovanie 2 roky/33 rokov*/}
            <div className="font-semibold text-2xl">
              {user.age != null && (
                <>
                  {user.age} {t("profile.age-full")}
                </>
              )}
            </div>
          </div>
          <div>
            <div className="text-base font-normal text-fontBlack opacity-75">
              {t("profile.zip")}
            </div>
            <div className="font-semibold text-2xl">{user.zip}</div>
          </div>
        </div>
        <div className="flex mt-8">
          <Button className="px-6" onClick={handleProfileEditClick}>
            Upraviť údaje <Icon className="ml-4" name="arrow-left" />
          </Button>
        </div>
      </div>
    </div>
  );
};

const AssociatedSwimmersInfo = ({
  associatedSwimmers,
}: {
  associatedSwimmers: AssociatedSwimmer[];
}) => {
  const history = useHistory();

  const [swimmerToDelete, setSwimmerToDelete] =
    useState<AssociatedSwimmer | null>(null);

  const handleDeleteSwimmerModalClose = () => {
    setSwimmerToDelete(null);
  };

  const handleOnSwimmerEditClick = (swimmer: Partial<AssociatedSwimmer>) => {
    history.push(`profile/swimmer/${swimmer.id}`);
  };

  const handleOnSwimmerAddClick = () => {
    history.push(`profile/swimmer/new`);
  };

  return (
    <>
      <DeleteAssociatedSwimmerModal
        open={Boolean(swimmerToDelete)}
        onClose={handleDeleteSwimmerModalClose}
        person={swimmerToDelete}
      ></DeleteAssociatedSwimmerModal>
      <PeopleList
        people={associatedSwimmers}
        mode={PeopleListMode.Profile}
        onRemoveClick={(person) =>
          setSwimmerToDelete(person as AssociatedSwimmer)
        }
        onPersonClick={handleOnSwimmerEditClick}
        onAddClick={handleOnSwimmerAddClick}
      ></PeopleList>
    </>
  );
};

const DeleteAssociatedSwimmerModal = ({
  open = false,
  onClose,
  person = null,
}: {
  open: boolean;
  onClose: any;
  person: AssociatedSwimmer | null;
}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation(() => deleteAssociatedSwimmer(person!.id!), {
    onSuccess: () => {
      // Update data to see edited content before the refetch.
      queryClient.setQueryData<
        AxiosResponse<AssociatedSwimmerFetchResponse> | undefined
      >("associatedSwimmers", (old) => {
        if (!old) {
          return;
        }

        return produce(old, (draft) => {
          draft.data.associatedSwimmers = old.data.associatedSwimmers.filter(
            (swimmerFromList) => swimmerFromList.id !== person!.id
          );
        });
      });
      queryClient.invalidateQueries("associatedSwimmers");
      onClose();
    },
  });
  const handleRemove = () => {
    mutation.mutate();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      button={
        <Button onClick={handleRemove} className="px-10">
          Odstrániť z profilu
        </Button>
      }
      modalClassName="w-full md:w-max max-w-sm"
      closeButton={true}
    >
      <div className="flex flex-col p-10 items-center">
        <span className="text-primary font-semibold text-xl mb-5 text-center">
          Naozaj chcete odstrániť túto osobu z vášho profilu?
        </span>
        {person && (
          <PersonComponent
            person={person}
            mode={PersonComponentMode.DisplayWithDescription}
          ></PersonComponent>
        )}
      </div>
    </Modal>
  );
};

const ProfilePage = () => {
  const { t } = useTranslation();

  const associatedSwimmersQuery = useQuery(
    "associatedSwimmers",
    fetchAssociatedSwimmers
  );

  const userQuery = useQuery("user", fetchUser);

  return (
    <section className="w-full">
      <div className="container mx-auto">
        <ProfileNavBar></ProfileNavBar>
        <ProfileLine></ProfileLine>
        <div className="mt-14 mb-24">
          {/* TODO female/male */}
          <div className="font-medium text-2xl mb-4 md:mb-8">
            {t("profile.user")}
          </div>

          {userQuery.isSuccess && (
            <UserInfo user={userQuery.data.data}></UserInfo>
          )}
        </div>
        <div>
          <div className="font-medium text-2xl mb-4">{t("profile.others")}</div>
          <div className="flex">
            {associatedSwimmersQuery.isSuccess && (
              <AssociatedSwimmersInfo
                associatedSwimmers={
                  associatedSwimmersQuery.data.data.associatedSwimmers
                }
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;
