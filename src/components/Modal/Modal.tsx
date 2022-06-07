import React, { PropsWithChildren, useMemo } from "react";
import { useElementSize, useLockedBody } from "usehooks-ts";
import FocusTrap from "focus-trap-react";
import cx from "classnames";

import "./Modal.css";

const ModalButton = ({ button }: { button: React.ReactNode }) => {
  const [contentRef, { height: contentHeight }] = useElementSize();

  const height = useMemo(() => contentHeight / 2, [contentHeight]);

  return (
    <div style={{ height }}>
      <div className="transform -translate-y-2/4" ref={contentRef}>
        {button}
      </div>
    </div>
  );
};

interface ModalProps {
  open: boolean;
  onClose?: () => void;
  button?: React.ReactNode;
  modalClassName?: string;
  closeButton?: boolean;
}
const Modal = ({
  open,
  onClose = () => {},
  children,
  button,
  modalClassName,
  closeButton = false,
}: PropsWithChildren<ModalProps>) => {
  useLockedBody(open);

  return open ? (
    <FocusTrap>
      <div
        id="modal-backdrop"
        onClick={(event: React.MouseEvent<HTMLDivElement>) => {
          if ((event.target as Element).id === "modal-backdrop") {
            onClose();
          }
        }}
        className="fixed inset-0 flex flex-col justify-center items-center bg-fontBlack bg-opacity-30 z-50"
      >
        <div className={cx("relative", { "px-4": closeButton })}>
          <div
            className={cx(
              "relative bg-white rounded-lg shadow-lg overflow-y-auto",
              modalClassName
            )}
          >
            {children}
          </div>
          {closeButton && (
            <img
              src="/red-cross-circle.svg"
              alt=""
              className="absolute right-0 top-0 transform -translate-y-2/4 w-8 h-8 cursor-pointer"
              onClick={() => onClose()}
            />
          )}
        </div>

        {button && <ModalButton button={button}></ModalButton>}
      </div>
    </FocusTrap>
  ) : null;
};

export default Modal;
