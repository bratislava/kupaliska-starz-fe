import { useTranslation } from 'react-i18next'

import ButtonComponentLibraryWrapper from '@/components/Button/ButtonComponentLibraryWrapper'

import Dialog from '../Dialog/Dialog'

interface ChildrenConfirmationModalProps {
  onSaveSuccess?: () => Promise<void>
  onClose?: () => void
}

export const ChildrenConfirmationModal = ({
  onSaveSuccess,
  onClose,
}: ChildrenConfirmationModalProps) => {
  const { t } = useTranslation()

  return (
    <Dialog
      title={t('tickets.childrenConfirmationModalTitle')}
      open={true}
      footerButton={
        <ButtonComponentLibraryWrapper
          variant="solid"
          onClick={async () => {
            if (onSaveSuccess) {
              await onSaveSuccess()
            }
          }}
        >
          {t('tickets.childrenConfirmationModalTextConfirmation')}
        </ButtonComponentLibraryWrapper>
      }
      className="max-w-[800px]"
      onClose={onClose}
    >
      <div className="flex flex-col gap-12">{t('tickets.childrenConfirmationModalText')}</div>
    </Dialog>
  )
}

export default ChildrenConfirmationModal
