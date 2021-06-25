import React from "react";

import { Button, Icon } from "components";
import { Typography } from "components";

import "./HeroBanner.css";
import { HashLink } from "react-router-hash-link";

const HeroBanner = () => {
  return (
    <div className="relative mb-8">
      <div className="relative hero-image w-full">
        <div className="wave w-full h-full absolute bottom-0"></div>
      </div>
      <div className="container mx-auto content relative z-10">
        <Typography
          type="title"
          fontWeight="bold"
          className="xl:mb-4 max-w-xs"
        >
          Kúp si lístok na ktorékoľvek kúpalisko v Bratislave online
        </Typography>

        <div
          className="
            flex
            space-x-4
            w-full
            mt-8
            mb-16

            md:flex-col
            md:space-y-4
            md:space-x-0
            md:w-1/2

            lg:flex-row
            lg:space-y-0
            lg:space-x-4

            xl:w-2/5
          "
        >
          <HashLink to="/#ticket-buy" className="flex-1 w-full">
            <Button className="w-full">
              <span className="pr-4">Kúpiť lístok</span>
              <Icon name="shopping-cart" />
            </Button>
          </HashLink>
          <HashLink to="/#swimming-pools" className="hidden sm:block flex-1 w-full">
            <Button
              className="w-full flex-1"
              type="outlined"
            >
              <span className="pr-2">Letné kúpaliská STaRZ</span>
              <Icon
                name="swimming-man"
                color="primary"
                className="hidden xs:block"
              />
            </Button>
          </HashLink>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
