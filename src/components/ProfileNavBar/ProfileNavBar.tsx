import React from "react";
import { NavLink } from "react-router-dom";
import "./ProfileNavBar.css";

interface LinkProps {
  url: string;
  text: string;
}

interface ProfileNavBarProps {
  links?: LinkProps[];
}

const Link = ({ url, text }: LinkProps) => {
  return (
    <NavLink className="flex items-center flex-col relative group" to={url}>
      <div className="line h-1 bg-primary w-full"></div>
      <div className="triangle absolute top-1 w-0 h-0 border-solid border-transparent"></div>
      <span title={text} className="p-7 text-center">
        {text}
      </span>
    </NavLink>
  );
};

const ProfileNavBar = ({
  links = [
    { url: "tickets", text: "Lístky a permanentky" },
    { url: "profile", text: "Osobné údaje" },
  ],
}: ProfileNavBarProps) => {
  return (
    <div className="profile-navbar flex flex-row justify-center">
      {links.map((link, index) => (
        <Link url={link.url} text={link.text} key={index} />
      ))}
    </div>
  );
};

export default ProfileNavBar;
