import React, { ReactNode, useMemo, useState } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

import "./InputField.css";

interface InputProps {
  type?: "text" | "number" | "email" | "password";
  placeholder?: string;
  onChange?: (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
  onBlur?: (
    event:
      | React.FocusEvent<HTMLInputElement>
      | React.FocusEvent<HTMLTextAreaElement>
  ) => void;
  value?: string | number;
  name?: string;
  register?: any;
  error?: string;
  leftExtra?: ReactNode;
  rightExtra?: ReactNode;
  inputClassName?: string;
  className?: string;
  thin?: boolean;
  element?: "textarea" | "input";
  label?: string;
  shouldUnregister?: boolean;
  max?: number;
}

const InputField = ({
  type = "text",
  placeholder = "",
  onChange,
  onBlur,
  value,
  name,
  register,
  error,
  leftExtra,
  rightExtra,
  inputClassName = "",
  thin = false,
  className = "",
  element: Input = "input",
  label,
  shouldUnregister = false,
  max,
}: InputProps) => {
  const [focused, setFocus] = useState<boolean>(false);
  const registerValues: UseFormRegisterReturn | undefined = useMemo(
    () => (register ? register(name, { shouldUnregister }) : undefined),
    [register, name, shouldUnregister]
  );
  let inputClasses = "";
  let inputWrapperClasses = "";
  let labelClasses = "";
  if (error !== undefined) {
    inputWrapperClasses = "border-error text-error";
    inputClasses = "placeholder-error text-error";
    labelClasses = "text-error font-medium text-xl mb-3";
  } else if (focused) {
    inputWrapperClasses = "border-primary text-primary";
    inputClasses = "text-fontBlack";
    labelClasses = "text-primary font-medium text-xl";
  } else {
    inputWrapperClasses = "border-2-softGray text-fontBlack text-opacity-10";
    inputClasses = "text-fontBlack";
    labelClasses = "text-fontBlack font-medium text-xl";
  }
  return (
    <div className={`flex-col w-full ${className}`}>
      {label && (
        <div className="mb-3">
          <label className={`font-medium ${labelClasses}`}>{label}</label>
        </div>
      )}
      <div
        className={`${inputWrapperClasses} border-solid border-2 transition-all duration-100 rounded-lg ${
          thin ? "" : "p-5"
        } flex flex-1 items-center`}
      >
        {!!leftExtra && leftExtra}
        <Input
          style={{ resize: "none" }}
          value={value}
          type={type}
          placeholder={placeholder}
          max={max}
          className={`focus:outline-none h-full flex-1 min-w-0 rounded-lg px-2 text-xl font-normal ${inputClasses} ${inputClassName}`}
          onFocus={() => setFocus(true)}
          name={registerValues && registerValues.name}
          onBlur={(
            event:
              | React.FocusEvent<HTMLTextAreaElement>
              | React.FocusEvent<HTMLInputElement>
          ) => {
            setFocus(false);
            registerValues && registerValues.onBlur(event);
            onBlur && onBlur(event);
          }}
          onChange={(
            event:
              | React.ChangeEvent<HTMLTextAreaElement>
              | React.ChangeEvent<HTMLInputElement>
          ) => {
            onChange && onChange(event);
            registerValues && registerValues.onChange(event);
          }}
          ref={registerValues && registerValues.ref}
          rows={8}
        />
        {!!rightExtra && rightExtra}
      </div>
      {error && <div className="text-error px-2 text-sm">{error}</div>}
    </div>
  );
};
export default InputField;
