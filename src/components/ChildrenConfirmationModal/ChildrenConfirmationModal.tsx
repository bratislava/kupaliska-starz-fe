import React from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '../index'
import Dialog from '../Dialog/Dialog'

type ChildrenConfirmationModalProps = {
  onSaveSuccess?: () => void
  onClose?: () => void
}

export const ChildrenConfirmationModal = ({
  onSaveSuccess,
  onClose,
}: ChildrenConfirmationModalProps) => {
  const { t } = useTranslation()

  return (
    <Dialog
      title={'Potvrdenie deti'}
      open={true}
      footerButton={
        <Button onClick={onSaveSuccess}>
          {t('tickets.childrenConirmationModalTextConfirmation')}
        </Button>
      }
      className="max-w-[800px]"
      onClose={onClose}
    >
      <div className="flex flex-col gap-12">{t('tickets.childrenConirmationModalText')}</div>
    </Dialog>
  )
}

export default ChildrenConfirmationModal
