// src/Hooks/useAuthContext.js  (rename file to useAuthContext.js)
import { useContext } from "react";
import { AuthContext } from "../Provider/AuthContext";
// import { AuthContext } from "../Provider/AuthContext";

const UseAuthContext = () => {
  const authInfo = useContext(AuthContext);
  if (authInfo === null || authInfo === undefined) {
    // Helpful message that tells you where the consumer is being used
    throw new Error(
      "useAuthContext must be used inside an AuthProvider. Check that AuthProvider wraps your app and that you are importing the same AuthContext module everywhere."
    );
  }
  return authInfo;
};

export default UseAuthContext;
