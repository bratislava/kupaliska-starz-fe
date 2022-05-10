import React, { PropsWithChildren } from "react";

import "./Button.css";

interface ButtonProps {
  // TODO: Rename to `type`.
  color?: "primary" | "secondary" | "outlined" | "blueish";
  htmlType?: "button" | "submit" | "reset";
  thin?: boolean;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  rounded?: boolean;
}

const Button = ({
  color = "primary",
  children,
  onClick,
  thin = false,
  rounded = false,
  className = "",
  disabled = false,
  htmlType = "button",
}: PropsWithChildren<ButtonProps>) => {
  // tailwind purges values that are only interpolated in so i have to do this bad way
  const textColor = { primary: 'text-white', secondary: 'text-secondary"', outlined: "text-primary", blueish: "text-primary" }[color]
  const bgColor = { primary: 'bg-primary', secondary: 'bg-secondary"', outlined: "bg-transparent", blueish: "bg-blueish" }[color]
  const borderColor = { primary: 'border-primary', secondary: 'border-secondary"', outlined: "border-primary", blueish: "border-blueish" }[color]
  const thinClass = thin ? "p-1" : "p-2";
  const roundedClass = rounded ? "rounded-lg" : "rounded";
  const classNames = `flex justify-center items-center focus:outline-none border-solid border-2 ${textColor} ${bgColor} ${borderColor} ${thinClass} ${roundedClass}`

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
