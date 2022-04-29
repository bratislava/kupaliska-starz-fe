import React, { PropsWithChildren } from "react";

interface TypographyProps {
  fontWeight?: "bold" | "medium" | "normal";
  type: "title" | "subtitle" | "subtitle-small";
  color?: "primary" | "secondary" | "fontBlack";
  className?: string;
}
const Typography = ({
  fontWeight = "normal",
  type,
  color = "fontBlack",
  className = "",
  children,
}: PropsWithChildren<TypographyProps>) => {
  const classNames = `font-${fontWeight} text-${color} ${className}`;

  if (type === "title") {
    return (
      <h2 className={`${classNames} text-2xl xs:text-3xl 2xl:text-4xl`}>
        {children}
      </h2>
    );
  } else if (type === "subtitle") {
    return <h3 className={`${classNames} text-2xl`}>{children}</h3>;
  } else {
    return <h3 className={`${classNames} text-xl`}>{children}</h3>;
  }
};

export default Typography;
