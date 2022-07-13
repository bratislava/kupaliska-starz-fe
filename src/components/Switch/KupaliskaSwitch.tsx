import Switch from "react-switch";
import React from "react";

// https://github.com/tailwindlabs/tailwindcss/discussions/1853#discussioncomment-1239755
// @ts-ignore
const { onColor, offColor } = preval`
  const resolveConfig = require('tailwindcss/resolveConfig');
  const tailwindConfig = require('../../../tailwind.config');
  const resolvedConfig = resolveConfig(tailwindConfig); 
  
  module.exports = {onColor: resolvedConfig.theme.colors.primary, offColor: resolvedConfig.theme.colors.inactive}
` as { onColor: string; offColor: string };

const KupaliskaSwitch = (props: React.ComponentProps<typeof Switch>) => {
  return (
    <Switch
      onColor={onColor}
      offColor={offColor}
      height={24}
      width={48}
      handleDiameter={16}
      uncheckedIcon={false}
      checkedIcon={false}
      {...props}
    >
      {props.children}
    </Switch>
  );
};

export default KupaliskaSwitch;
