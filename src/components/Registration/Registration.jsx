import React, { useState } from "react";
import { User, Mail, Lock, Image as ImageIcon } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import UseAuthContext from "../../Hooks/UseAuthContext";
import UseAxiosSecure from "../../Hooks/UseAxiosSecure";
import toast from "react-hot-toast";
import { getAuth } from "firebase/auth";

const Registration = () => {
  const { registerUser, signInGoogle, updateUserProfile } = UseAuthContext();
  const navigate = useNavigate();
  const axiosSecure = UseAxiosSecure();

  const [name, setName] = useState("");
  const [photo, setPhoto] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);

  // Sync user to backend
const syncUserToBackend = async () => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) return console.error("No current user found");

  await user.reload(); // ensure profile is updated

  try {
    await axiosSecure.post("/api/register-user", {
      displayName: user.displayName,
      photoURL: user.photoURL,
    });
    console.log("User synced to backend");
  } catch (err) {
    console.error("Backend sync failed:", err.response?.data || err.message);
  }
};


  // EMAIL/PASSWORD REGISTRATION
 const handleRegister = async () => {
   if (!name.trim() || !email.trim() || !pass.trim()) {
     toast.error("All fields are required");
     return;
   }

   setLoading(true);
   try {
     // 1️⃣ Create Firebase user
     const result = await registerUser(email, pass);

     // 2️⃣ Update profile
     await updateUserProfile({
       displayName: name,
       photoURL: photo || "https://i.ibb.co/4pB1q7q/user.png",
     });

     // 3️⃣ Sync to backend with Firebase token
     await syncUserToBackend();

     toast.success("Registration successful!");
     localStorage.setItem("role", "user");
     navigate("/");
   } catch (err) {
     console.error(err);
     toast.error(err.message || "Registration failed");
   } finally {
     setLoading(false);
   }
 };

  // GOOGLE SIGNUP
  const handleGoogleSignup = async () => {
    setLoading(true);
    try {
      const result = await signInGoogle();
      await syncUserToBackend(result.user);

      toast.success("Welcome with Google!");
      localStorage.setItem("role", "user");
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Google signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center px-4">
      <div className="hero-content flex-col lg:flex-row shadow-xl rounded-2xl bg-transparent-md p-10 gap-12">
        <div className="max-w-md text-center lg:text-left">
          <h1 className="text-5xl font-bold">Create an Account</h1>
          <p className="py-6 text-base-content/70">
            Register and get full access to booking & dashboard.
          </p>
        </div>

        <div className="card bg-base-100 w-full max-w-sm shadow-xl border border-base-300">
          <div className="card-body">
            <fieldset className="flex flex-col gap-4" disabled={loading}>
              <div>
                <label className="label font-medium">Name</label>
                <div className="relative">
                  <User
                    className="absolute left-3 top-3 opacity-70"
                    size={20}
                  />
                  <input
                    type="text"
                    className="input input-bordered w-full pl-10"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="label font-medium">Email</label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-3 opacity-70"
                    size={20}
                  />
                  <input
                    type="email"
                    className="input input-bordered w-full pl-10"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="label font-medium">Password</label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-3 opacity-70"
                    size={20}
                  />
                  <input
                    type="password"
                    className="input input-bordered w-full pl-10"
                    placeholder="••••••••"
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="label font-medium">
                  Photo URL (optional)
                </label>
                <div className="relative">
                  <ImageIcon
                    className="absolute left-3 top-3 opacity-70"
                    size={20}
                  />
                  <input
                    type="url"
                    className="input input-bordered w-full pl-10"
                    placeholder="https://i.ibb.co/..."
                    value={photo}
                    onChange={(e) => setPhoto(e.target.value)}
                  />
                </div>
              </div>

              <button
                className="btn btn-neutral mt-4 w-full"
                onClick={handleRegister}
                disabled={loading}
              >
                {loading ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  "Register"
                )}
              </button>

              <div className="divider text-sm">OR</div>

              <button
                className="btn btn-outline w-full flex items-center gap-2"
                onClick={handleGoogleSignup}
                disabled={loading}
              >
                <FcGoogle size={22} />
                Continue with Google
              </button>

              <p className="text-center text-sm pt-2">
                Already have an account?{" "}
                <Link to="/login" className="link link-primary">
                  Login here
                </Link>
              </p>
            </fieldset>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;
