// AuthContext.jsx  ← your exact file, only fixed
import { createContext, useState, useEffect } from "react";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "../Firebase/firebase.config";
import axios from "axios";
import { AuthContext } from "./AuthContext"; // ← this is correct if you have AuthContext.js separately

const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [adminEmail, setAdminEmail] = useState(
    localStorage.getItem("adminEmail")
  );
  const [loading, setLoading] = useState(true);

  const registerUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // Add this function inside AuthProvider
  const setAdmin = (email, token) => {
    setUser({
      email,
      displayName: "Administrator",
      photoURL: null,
    });
    setRole("admin");
    setAdminEmail(email);

    localStorage.setItem("adminEmail", email);
    localStorage.setItem("adminToken", token);

    // Optional: notify other listeners (already have useEffect for it)
    window.dispatchEvent(new Event("admin-logged-in"));
  };

  const signInUser = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signInGoogle = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  const updateUserProfile = (profile) =>
    updateProfile(auth.currentUser, profile);

  const logOut = async () => {
    setLoading(true);
    if (adminEmail) {
      localStorage.removeItem("adminEmail");
      setAdminEmail(null);
      setRole(null);
      setUser(null);
      setLoading(false);
      return;
    }
    await signOut(auth);
    setUser(null);
    setRole(null);
    setLoading(false);
  };

  const fetchRole = async (currentUser) => {
    try {
      if (adminEmail) {
        setRole("admin");
        return;
      }
      const token = await currentUser.getIdToken();
      const res = await axios.get("https://server-deco.vercel.app/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRole(res.data.role);
    } catch (err) {
      setRole(null);
    }
  };

  // Firebase listener (unchanged)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) await fetchRole(currentUser);
      else setRole(null);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // ONLY THIS PART IS ADDED – detects admin from localStorage on refresh or manual login
  useEffect(() => {
    const checkAdminFromStorage = () => {
      const savedAdminEmail = localStorage.getItem("adminEmail");
      if (savedAdminEmail && !user) {
        // Fake a user object so Navbar & PrivateRoute think someone is logged in
        setUser({
          email: savedAdminEmail,
          displayName: "Administrator",
          photoURL: null,
        });
        setRole("admin");
        setAdminEmail(savedAdminEmail);
        setLoading(false);
      }
    };

    checkAdminFromStorage();
    window.addEventListener("admin-logged-in", checkAdminFromStorage);

    return () => {
      window.removeEventListener("admin-logged-in", checkAdminFromStorage);
    };
  }, [user]); // re-run when Firebase user changes

  const authInfo = {
    user,
    role,
    adminEmail,
    loading,
    registerUser,
    signInUser,
    signInGoogle,
    updateUserProfile,
    logOut,
    setAdminEmail,
    setAdmin,
  };

  return <AuthContext value={authInfo}>{children}</AuthContext>;
};

export default AuthProvider;
