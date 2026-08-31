import { useTranslation } from 'react-i18next'

import Dialog from '../Dialog/Dialog'
import { Button } from '../index'

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
        <Button
          onClick={async () => {
            if (onSaveSuccess) {
              await onSaveSuccess()
            }
          }}
        >
          {t('tickets.childrenConfirmationModalTextConfirmation')}
        </Button>
      }
      className="max-w-[800px]"
      onClose={onClose}
    >
      <div className="flex flex-col gap-12">{t('tickets.childrenConfirmationModalText')}</div>
    </Dialog>
  )
}

export default ChildrenConfirmationModal
