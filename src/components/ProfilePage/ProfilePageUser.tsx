import { AxiosError } from 'axios'
import { ErrorWithMessages } from 'helpers/general'
import { useState } from 'react'
import { Button as AriaButton } from 'react-aria-components'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'

import { environment } from '../../environment'
import { useAccount } from '../../hooks/useAccount'
import { useErrorToast } from '../../hooks/useErrorToast'
import { fetchUser } from '../../store/user/api'
import { Button, Icon, Spinner } from '../index'
import Photo from '../Photo/Photo'
import ProfilePageAgeZipModal from './ProfilePageAgeZipModal'
import ProfilePagePhotoModal from './ProfilePagePhotoModal'

const ProfilePageUser = () => {
  const { dispatchErrorToastForHttpRequest } = useErrorToast()

  const { data, isLoading, isError } = useQuery('user', fetchUser, {
    onError: (err: AxiosError<ErrorWithMessages>) => {
      dispatchErrorToastForHttpRequest(err)
    },
  })
  const account = useAccount()
  const [isAgeModalOpen, setIsAgeModalOpen] = useState(false)
  const [isZipModalOpen, setIsZipModalOpen] = useState(false)
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false)
  const { t } = useTranslation()

  return (
    <>
      {data && (
        <>
          {isAgeModalOpen && (
            <ProfilePageAgeZipModal
              type="dateOfBirth"
              user={data.data}
              onClose={() => setIsAgeModalOpen(false)}
            />
          )}
          {isZipModalOpen && (
            <ProfilePageAgeZipModal
              type="zip"
              user={data.data}
              onClose={() => setIsZipModalOpen(false)}
            />
          )}
          {isPhotoModalOpen && (
            <ProfilePagePhotoModal user={data.data} onClose={() => setIsPhotoModalOpen(false)} />
          )}
        </>
      )}
      <div className="rounded-lg bg-sunscreen lg:col-span-7">
        <div className="flex flex-col items-start gap-6 border-b-2 border-b-divider px-6 py-4 sm:flex-row sm:items-center">
          <div className="flex flex-1 flex-col gap-1">
            <p className="text-xl font-semibold">{t('profile.personal-info')}</p>
            <p>{t('profile.manage-in-city-account')}</p>
          </div>
          <a href={`${environment.cityAccountFrontendUrl}/moj-profil`}>
            <Button>
              <Icon className="no-fill mr-2" name="castle" />{' '}
              {t('profile.manage-in-account-button')}
            </Button>
          </a>
        </div>
        <div className="flex flex-col gap-6 p-6">
          <div className="flex flex-col gap-6 sm:flex-row">
            <Photo photo={data?.data.image} size="normal" />
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <p className="font-semibold">{t('buy-page.photo-title')}</p>
                <p className="text-sm whitespace-pre-line">{t('common.photo-required')}</p>
              </div>
              <Button
                className="self-start"
                color="outlined"
                disabled={isLoading || isError}
                onClick={() => setIsPhotoModalOpen(true)}
              >
                <Icon className="no-fill mr-2" name="upload" /> {t('profile.upload-photo')}
              </Button>
            </div>
          </div>
          <div className="h-0.5 bg-divider" />
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:gap-6">
              <div className="flex items-center gap-2 font-semibold sm:w-[200px]">
                <p>{t('profile.name-firstname')}</p>
              </div>
              <p>
                {account.data?.given_name} {account.data?.family_name}
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:gap-6">
              <div className="flex items-center gap-2 font-semibold sm:w-[200px]">
                <p>{t('profile.email')}</p>
              </div>
              <p>{account.data?.email}</p>
            </div>
          </div>
          <div className="h-0.5 bg-divider" />
          {isLoading && (
            <div className="flex justify-center p-6">
              <Spinner />
            </div>
          )}
          {data && (
            <>
              <div className="flex flex-col gap-2 sm:flex-row sm:gap-6">
                <div className="flex items-center gap-2 font-semibold sm:w-[200px]">
                  <p>{t('person-add.age')}</p>
                </div>
                <div className="flex grow">
                  <p className="grow">
                    {data.data.age != null &&
                      t('common.age-interval', { postProcess: 'interval', count: data.data.age })}
                  </p>
                  <AriaButton
                    onPress={() => setIsAgeModalOpen(true)}
                    aria-label={t('profile.edit-date-of-birth')}
                  >
                    <Icon name="pencil" className="no-fill" />
                  </AriaButton>
                </div>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:gap-6">
                <div className="flex items-center gap-2 font-semibold sm:w-[200px]">
                  <p>{t('buy-page.zip')}</p>
                </div>
                <div className="flex grow">
                  <p className="grow">{data.data.zip}</p>
                  <AriaButton
                    onPress={() => setIsZipModalOpen(true)}
                    aria-label={t('profile.edit-zip')}
                  >
                    <Icon name="pencil" className="no-fill" />
                  </AriaButton>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default ProfilePageUser
