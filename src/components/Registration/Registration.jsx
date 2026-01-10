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
  const [errors, setErrors] = useState({});

  // ---------------- VALIDATION (UI ONLY) ----------------
  const validate = () => {
    const newErrors = {};

    if (!name.trim()) newErrors.name = "Name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    if (!pass.trim()) newErrors.pass = "Password is required";
    if (pass && pass.length < 6)
      newErrors.pass = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ---------------- BACKEND SYNC ----------------
  const syncUserToBackend = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    await user.reload();

    try {
      await axiosSecure.post("/api/register-user", {
        displayName: user.displayName,
        photoURL: user.photoURL,
      });
    } catch (err) {
      console.error("Backend sync failed:", err.response?.data || err.message);
    }
  };

  // ---------------- EMAIL REGISTRATION ----------------
  const handleRegister = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      await registerUser(email, pass);

      await updateUserProfile({
        displayName: name,
        photoURL: photo || "https://i.ibb.co/4pB1q7q/user.png",
      });

      await syncUserToBackend();

      toast.success("Registration successful!");
      localStorage.setItem("role", "user");
      navigate("/");
    } catch (err) {
      toast.error(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- GOOGLE SIGNUP ----------------
  const handleGoogleSignup = async () => {
    setLoading(true);
    try {
      await signInGoogle();
      await syncUserToBackend();

      toast.success("Welcome to StyleDecor!");
      localStorage.setItem("role", "user");
      navigate("/");
    } catch (err) {
      toast.error(err.message || "Google signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-transparent mt-18">
      <div className="hero-content flex-col lg:flex-row gap-14">
        {/* LEFT TEXT */}
        <div className="max-w-md text-center lg:text-left">
          <h1 className="text-5xl font-bold text-primary-gradient p-5">
            Join StyleDecor
          </h1>
          <p className="p-5 text-base-content/70">
            Where Your Home Meets Your Style! Create your account and unlock the
            full experience.
          </p>
        </div>

        {/* REGISTER CARD */}
        <div
          className="
            card w-full max-w-xl
            bg-transparent backdrop-blur-xl
            border border-blue-400/30
            shadow-2xl
            rounded-2xl
            ring-1 ring-blue-500/20
            hover:ring-blue-500/40
            transition-all duration-300
          "
        >
          <div className="card-body">
            <fieldset className="flex flex-col gap-4" disabled={loading}>
              {/* NAME */}
              <label className="label font-medium">Name</label>
              <div className="relative">
                <User className="absolute left-3 top-2 opacity-70" size={20} />
                <input
                  type="text"
                  className={`input bg-transparent w-full pl-10
                    ${errors.name ? "border-red-400" : "focus:border-blue-400"}
                  `}
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              {errors.name && (
                <p className="text-red-400 text-sm">{errors.name}</p>
              )}

              {/* EMAIL */}
              <label className="label font-medium">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2 opacity-70" size={20} />
                <input
                  type="email"
                  className={`input bg-transparent w-full pl-10
                    ${errors.email ? "border-red-400" : "focus:border-blue-400"}
                  `}
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-sm">{errors.email}</p>
              )}

              {/* PASSWORD */}
              <label className="label font-medium">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2 opacity-70" size={20} />
                <input
                  type="password"
                  className={`input bg-transparent w-full pl-10
                    ${errors.pass ? "border-red-400" : "focus:border-blue-400"}
                  `}
                  placeholder="••••••••"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                />
              </div>
              {errors.pass && (
                <p className="text-red-400 text-sm">{errors.pass}</p>
              )}

              {/* PHOTO */}
              <label className="label font-medium">Photo URL (optional)</label>
              <div className="relative">
                <ImageIcon
                  className="absolute left-3 top-2 opacity-70"
                  size={20}
                />
                <input
                  type="url"
                  className="input bg-transparent w-full pl-10 focus:border-blue-400"
                  placeholder="https://i.ibb.co/..."
                  value={photo}
                  onChange={(e) => setPhoto(e.target.value)}
                />
              </div>

              {/* REGISTER BUTTON */}
              <button
                className="btn btn-neutral mt-4 w-full"
                onClick={handleRegister}
                disabled={loading}
              >
                {loading ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  "Create Account"
                )}
              </button>

              <div className="divider text-sm">OR</div>

              {/* GOOGLE */}
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
                <Link to="/login" className="text-blue-400 underline">
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
