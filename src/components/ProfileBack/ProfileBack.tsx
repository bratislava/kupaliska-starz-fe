import React from "react";
import { Link } from "react-router-dom";
import { Icon } from "../index";

const ProfileBack = () => {
  return (
    <div className="py-7">
      <Link to={"/profile"} className="flex items-center py-0.5">
        <Icon className="mr-4" name="arrow-right" />
        Späť
      </Link>
    </div>
  );
};

export default ProfileBack;
