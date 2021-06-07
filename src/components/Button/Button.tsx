import React, { PropsWithChildren } from "react";

import "./Button.css";

interface ButtonProps {
  color?: "primary" | "secondary";
  type?: "outlined" | "filled" | "transparent";
  htmlType?: "button" | "submit" | "reset";
  thin?: boolean;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  rounded?: boolean;
}

const Button = ({
  color = "primary",
  type = "filled",
  children,
  onClick,
  thin = false,
  rounded = false,
  className = "",
  disabled = false,
  htmlType = "button",
}: PropsWithChildren<ButtonProps>) => {
  // tailwind purges values that are only interpolated in so i have to do this bad way
  const textColor = color === "primary" ? "text-primary" : "text-secondary";
  const bgColor = color === "primary" ? "bg-primary" : "bg-secondary";
  const borderColor =
    color === "primary" ? "border-primary" : "border-secondary";

  let classNames = `${
    thin ? "p-1" : "p-2"
  } flex justify-center items-center focus:outline-none ${
    rounded ? "rounded-lg" : "rounded"
  } `;
  if (type === "outlined") {
    classNames += `bg-transparent ${textColor} border-solid ${borderColor} border-2 font-bold`;
  } else if (type === "transparent") {
    classNames += `bg-transparent ${textColor} border-solid border-transparent border-2 font-bold`;
  } else {
    classNames += `${bgColor} text-white border-solid ${borderColor} border-2 font-bold`;
  }
  return (
    <button
      type={htmlType}
      onClick={onClick}
      className={`${classNames} ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
