import React, { use } from "react";
import { AuthContext } from "../Provider/AuthContext";


const UseAuthContext = () => {
  const authInfo = use(AuthContext);
  return authInfo;
};

export default UseAuthContext;
