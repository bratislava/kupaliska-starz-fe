import Switch from "react-switch";
import React from "react";

const KupaliskaSwitch = (props: React.ComponentProps<typeof Switch>) => {
    return <Switch
        // TODO: use values from tailwind
        onColor={'#07038C'}
        offColor={"#CCCCCC"}
        height={24}
        width={48}
        handleDiameter={16}
        uncheckedIcon={false}
        checkedIcon={false}
        {...props}>{props.children}</Switch>
}

export default KupaliskaSwitch;
