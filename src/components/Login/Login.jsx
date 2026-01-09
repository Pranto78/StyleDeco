import React, { useState } from "react";
import { Mail, Lock } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import UseAuthContext from "../../Hooks/UseAuthContext";
import toast from "react-hot-toast";

const Login = () => {
  const { signInUser, signInGoogle, setAdmin } = UseAuthContext();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // ---------------- VALIDATION (UI ONLY) ----------------
  const validate = () => {
    const newErrors = {};

    if (!email) newErrors.email = "Email is required";
    if (!pass) newErrors.pass = "Password is required";
    if (pass && pass.length < 6)
      newErrors.pass = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ---------------- LOGIN ----------------
  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);

    try {
      const adminRes = await fetch(
        "https://server-deco.vercel.app/admin-login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password: pass }),
        }
      );

      if (adminRes.ok) {
        const data = await adminRes.json();
        setAdmin(email, data.token);
        toast.success("Welcome back, Admin!");
        navigate("/dashboard/manage-decorators");
        return;
      }

      localStorage.removeItem("adminToken");
    } catch {
      localStorage.removeItem("adminToken");
    }

    signInUser(email, pass)
      .then(async (result) => {
        const user = result.user;

        localStorage.removeItem("adminToken");

        await fetch("https://server-deco.vercel.app/api/register-user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${await user.getIdToken()}`,
          },
          body: JSON.stringify({
            displayName: user.displayName,
            photoURL: user.photoURL,
          }),
        });

        localStorage.setItem("role", "user");
        toast.success("Logged in!");
        navigate("/");
      })
      .catch(() => toast.error("Invalid email or password"))
      .finally(() => setLoading(false));
  };

  // ---------------- GOOGLE LOGIN ----------------
  const handleGoogleLogin = () => {
    setLoading(true);

    signInGoogle()
      .then(async (result) => {
        const user = result.user;

        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminEmail");

        await fetch("https://server-deco.vercel.app/api/register-user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${await user.getIdToken()}`,
          },
          body: JSON.stringify({
            displayName: user.displayName,
            photoURL: user.photoURL,
          }),
        });

        localStorage.setItem("role", "user");
        toast.success("Logged in with Google! 🎊");
        navigate("/");
      })
      .catch((err) => toast.error(err.message || "Google login failed"))
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-transparent">
      <div className="hero-content flex-col lg:flex-row gap-14">
        {/* LEFT TEXT */}
        <div className="max-w-md text-center lg:text-left">
          <h1 className="text-5xl font-bold text-primary-gradient">
            Welcome to StyleDecor again
          </h1>
          <p className="py-6 text-base-content/70">
            Fast, secure login to your dashboard.
          </p>
        </div>

        {/* LOGIN CARD */}
        <div
          className="
            card w-full max-w-sm
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
            <fieldset className="flex flex-col gap-3">
              {/* EMAIL */}
              <label className="label font-medium">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2 opacity-70" size={20} />
                <input
                  type="email"
                  className={`input bg-transparent w-full pl-10
                    ${errors.email ? "border-red-400" : "focus:border-blue-400"}
                  `}
                  placeholder="Enter your email"
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
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
                  placeholder="Enter your password"
                  onChange={(e) => setPass(e.target.value)}
                  disabled={loading}
                />
              </div>
              {errors.pass && (
                <p className="text-red-400 text-sm">{errors.pass}</p>
              )}

              <div className="flex justify-end text-sm mt-1">
                <a className="link link-hover text-blue-400">
                  Forgot password?
                </a>
              </div>

              {/* LOGIN BUTTON */}
              <button
                className="btn btn-neutral bg-primary-gradient mt-4 w-full"
                onClick={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </button>

              <div className="divider text-sm">OR</div>

              {/* GOOGLE LOGIN */}
              <button
                className="btn btn-outline w-full flex items-center gap-2"
                onClick={handleGoogleLogin}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Signing in...
                  </>
                ) : (
                  <>
                    <FcGoogle size={22} />
                    Continue with Google
                  </>
                )}
              </button>

              <span className="text-sm pt-2">
                Don&apos;t have an account?{" "}
                <Link to="/signup" className="text-blue-400 underline">
                  Sign Up
                </Link>
              </span>
            </fieldset>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
