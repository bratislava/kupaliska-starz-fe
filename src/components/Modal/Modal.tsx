import React, { PropsWithChildren } from "react";
interface ModalProps {
  open: boolean;
  onClose?: () => void;
}
const Modal = ({ open, onClose, children }: PropsWithChildren<ModalProps>) => {
  return open ? (
    <div
      id="modal-backdrop"
      onClick={(event: React.MouseEvent<HTMLDivElement>) => {
        if ((event.target as Element).id === "modal-backdrop") {
          onClose && onClose();
        }
      }}
      className="fixed inset-0 flex flex-col justify-center items-center bg-fontBlack bg-opacity-30 z-50"
    >
      {children}
    </div>
  ) : null;
};

export default Modal;
