import React from "react";

import { Button, Icon } from "components";
import { Typography } from "components";

import "./HeroBanner.css";
import { HashLink } from "react-router-hash-link";

const HeroBanner = () => {
  return (
    <div className="hero-container relative w-full flex items-center">
      <div className="wave absolute inset-0 flex flex-col lg:justify-end justify-center">
        <div className="h-9/10 xs:h-4/5 w-4/5 sm:h-3/5 sm:w-1/2 md:h-1/2 xl:h-3/5 bg-white lg:bg-transparent rounded-r-lg">
          <div className="ml-container flex items-center md:items-start h-full pr-8 md:pt-12 xl:pt-0">
            <div className="flex flex-col">
              <div className="flex">
                <div className="flex-1">
                  <Typography
                    type="title"
                    fontWeight="bold"
                    className="xl:mb-4"
                  >
                    Zakúp si lístok alebo permanentku
                  </Typography>
                  <Typography type="subtitle" className="xl:mb-4">
                    a užívaj si leto na ktoromkoľvek z našich kúpalísk v
                    Bratislave
                  </Typography>
                </div>
                <div className="lg:flex-1/2" />
              </div>
              <div className="flex flex-col items-start lg:flex-row">
                <HashLink to="/#ticket-buy" className="flex-1 w-full">
                  <Button className="w-full my-3 lg:mt-4 lg:mr-2">
                    <span className="xs:hidden">Chcem lístok</span>
                    <span className="pr-2 lg:pr-1 xl:pr-2 hidden xs:block">
                      Chcem lístok/permanentku
                    </span>
                    <Icon name="shopping-cart" className="hidden xs:block" />
                  </Button>
                </HashLink>
                <HashLink to="/#swimming-pools" className="flex-1 w-full">
                  <Button
                    className="w-full mb-1 xs:mb-3 lg:mt-4 lg:ml-4 flex-1"
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
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
