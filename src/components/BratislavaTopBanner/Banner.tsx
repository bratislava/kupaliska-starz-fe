import React, { PropsWithChildren } from "react";

import { Icon } from "components";

const SocialMediaButton = ({
  children,
  paddingR = true,
}: PropsWithChildren<{ paddingR?: boolean }>) => (
  <button
    className={`bg-transparent ${
      paddingR ? "p-2" : "pl-2 py-2"
    } focus:outline-none`}
  >
    {children}
  </button>
);

const Banner = () => (
  <aside className="bg-secondary text-white">
    <div className="container mx-auto flex justify-between">
      <div className="flex items-center">
        <img
          className="py-2 pr-2"
          alt="logo of Bratislava"
          src={"Logo_biele.png"}
        />
        <span className="hidden md:block">
          Hlavné mesto Slovenskej republiky Bratislava
        </span>
      </div>
      <div className="items-center flex">
        <a href="https://www.facebook.com/STaRZ-Spr%C3%A1va-telov%C3%BDchovn%C3%BDch-a-rekrea%C4%8Dn%C3%BDch-zariaden%C3%AD-hlavn%C3%A9ho-mesta-SR-513951915371509" target="_blank" rel="noreferrer">
          <Icon name="facebook-logo" />
        </a>
      </div>
    </div>
  </aside>
);

export default Banner;
