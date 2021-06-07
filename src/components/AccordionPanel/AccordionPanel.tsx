import React, { PropsWithChildren, useEffect, useRef, useState } from "react";

import { Icon } from "components";

interface AccordionPanelProps {
  initialState?: boolean;
  open?: boolean;
  title?: string;
  onOpen?: () => void;
  className?: string;
}

const AccordionPanel = ({
  initialState = false,
  open,
  title = "",
  onOpen,
  children,
  className = "",
}: PropsWithChildren<AccordionPanelProps>) => {
  const [_open, setOpen] = useState<boolean>(initialState);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    open !== undefined && setOpen(open);
  }, [open]);

  const _onOpen = () => {
    if (onOpen) {
      onOpen();
    } else {
      setOpen(!_open);
    }
  };

  useEffect(() => {
    if (contentRef && contentRef.current) {
      if (_open) {
        contentRef.current.style.height =
          contentRef.current.scrollHeight + "px";
      } else {
        contentRef.current.style.height = "0px";
      }
    }
  }, [_open]);

  return (
    <div className={`${_open ? "border-primary border-2 border-solid" : "border-2-softGray"} rounded-lg shadow-xs p-4 ${className}`}>
      <div
        className={`flex cursor-pointer justify-between w-full font-medium text-sm ${
          _open ? "mb-4 text-primary" : ""
        }`}
        onClick={_onOpen}
      >
        {title}
        <button className="focus:outline-none text-fontBlack ml-4">
          {_open ? <Icon name="arrow-up" /> : <Icon name="arrow-down" />}
        </button>
      </div>
      <div
        ref={contentRef}
        className="overflow-hidden transition-all text-fontBlack text-sm"
      >
        {children}
      </div>
    </div>
  );
};

export default AccordionPanel;
