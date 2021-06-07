import React from "react";

import "./Icon.css";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: string;
  color?: "primary" | "secondary" | "white" | "fontBlack";
  className?: string;
}

const Icon = ({ name, color, className = "", ...rest }: IconProps) => {
  const ImportedIconRef =
    React.useRef<React.FC<React.SVGProps<SVGSVGElement>>>();
  const [loading, setLoading] = React.useState(false);

  React.useEffect((): void => {
    setLoading(true);
    const importIcon = async (): Promise<void> => {
      try {
        ImportedIconRef.current = (
          await import(
            `!!@svgr/webpack?-svgo,+titleProp,+ref!../../assets/icons/${name}.svg`
          )
        ).default;
      } catch (err) {
        throw err;
      } finally {
        setLoading(false);
      }
    };
    importIcon();
  }, [name]);
  if (!loading && ImportedIconRef.current) {
    const { current: ImportedIcon } = ImportedIconRef;
    return (
      <div className={`icon ${className} ${color}`}>
        <ImportedIcon {...rest} />
      </div>
    );
  }

  return null;
};

export default Icon;
