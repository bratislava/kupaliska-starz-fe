import React from "react";

import "./Icon.css";
import { useIsMounted } from "usehooks-ts";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: string;
  color?: "primary" | "secondary" | "white" | "fontBlack" | "blueish";
  className?: string;
}

const Icon = ({ name, color, className = "", ...rest }: IconProps) => {
  const ImportedIconRef =
    React.useRef<React.FC<React.SVGProps<SVGSVGElement>>>();
  const [loading, setLoading] = React.useState(false);
  const isMounted = useIsMounted();

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
        if (isMounted()) {
          setLoading(false);
        }
      }
    };
    importIcon();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
