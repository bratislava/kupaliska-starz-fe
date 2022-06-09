import React from "react";
import { Link } from "react-router-dom";

const Footer = () => (
  <div className="w-full bg-blueish mt-4 md:mt-24">
    <div className="w-full flex items-center justify-between py-4 grid grid-cols-1 md:grid-cols-3 container mx-auto">
      <div className="flex flex-col text-primary order-1 my-2 md:my-0 md:order-1">
        <span className="font-semibold">Kontakt</span>
        <span>
          Správa telovýchovných a rekreačných zariadení hlavného mesta
          Slovenskej republiky Bratislavy
        </span>
        <span></span>
        <span>Junácka 4, 831 04 Bratislava 3</span>
        <span>IČO: 00179663</span>
        <span>DIČ: 2020801695</span>
      </div>
      <div className="text-primary flex items-center order-3 md:order-2 justify-center col-span-1">
        STARZ |{" "}
        <a
          href="https://inovacie.bratislava.sk"
          rel="noopener noreferrer"
          target="_blank"
          className="link ml-1 mr-1"
        >
          Inovácie mesta Bratislava
        </a>
        | 2022
      </div>
      <div className="flex flex-col text-primary md:items-end order-2 md:order-3 my-2 md:my-0">
        <span className="font-semibold">Dôležité linky</span>
        <Link className="link" to="/vop">
          Všeobecné obchodné podmienky
        </Link>
        <Link className="link" to="/gdpr">
          Zásady ochrany údajov
        </Link>
      </div>
    </div>
  </div>
);

export default Footer;
