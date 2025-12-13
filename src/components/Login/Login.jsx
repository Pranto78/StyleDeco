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
  const [loading, setLoading] = useState(false); // ← Added loading state

  const handleLogin = async () => {
    setLoading(true);

    try {
      const adminRes = await fetch("http://localhost:3000/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: pass }),
      });

      if (adminRes.ok) {
        const data = await adminRes.json();
        setAdmin(email, data.token); // saves adminToken
        toast.success("Welcome back, Admin!");
        navigate("/dashboard/manage-decorators");
        return;
      }
      // If admin fails → make sure we are NOT admin
      localStorage.removeItem("adminToken"); // ← CLEAR ANY OLD TOKEN
    } catch (error) {
      localStorage.removeItem("adminToken"); // ← ALWAYS clear on fail
    }

    // Normal Firebase Login
    signInUser(email, pass)
      .then(async (result) => {
        const user = result.user;

        localStorage.removeItem("adminToken");

        await fetch("http://localhost:3000/api/register-user", {
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

  const handleGoogleLogin = () => {
    setLoading(true); // ← Start loading for Google too

    signInGoogle()
      .then(async (result) => {
        const user = result.user;

        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminEmail");

        await fetch("http://localhost:3000/api/register-user", {
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
        toast.success("Logged in with Google! 🎊", {
          duration: 3000,
          position: "top-center",
        });

        navigate("/");
      })
      .catch((err) => {
        toast.error(err.message || "Google login failed");
      })
      .finally(() => {
        setLoading(false); // ← Stop loading
      });
  };

  //   -------------------------

  // ---------------------

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center px-4">
      <div className="hero-content flex-col lg:flex-row shadow-xl rounded-2xl bg-base-100 p-10 gap-12">
        {/* Left text */}
        <div className="max-w-md text-center lg:text-left">
          <h1 className="text-5xl font-bold">Welcome Back!</h1>
          <p className="py-6 text-base-content/70">
            Fast, secure login to your dashboard.
          </p>
        </div>

        {/* Login Card */}
        <div className="card bg-transparent-md w-full max-w-sm shadow-xl border border-base-300">
          <div className="card-body">
            <fieldset className="fieldset flex flex-col gap-3">
              {/* Email */}
              <label className="label font-medium">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 opacity-70" size={20} />
                <input
                  type="email"
                  className="input input-bordered w-full pl-10"
                  placeholder="Enter your email"
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>

              {/* Password */}
              <label className="label font-medium">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 opacity-70" size={20} />
                <input
                  type="password"
                  className="input input-bordered w-full pl-10"
                  placeholder="Enter your password"
                  onChange={(e) => setPass(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="flex justify-end text-sm mt-1">
                <a className="link link-hover text-primary">Forgot password?</a>
              </div>

              {/* Login Button */}
              <button
                className="btn btn-neutral mt-4 w-full text-base"
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

              {/* Divider */}
              <div className="divider text-sm">OR</div>

              {/* Google Login */}
              <button
                className="btn btn-outline w-full flex items-center gap-2"
                onClick={handleGoogleLogin}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Signing in with Google...
                  </>
                ) : (
                  <>
                    <FcGoogle size={22} />
                    Continue with Google
                  </>
                )}
              </button>

              <span className="text-sm pt-2">
                Don't have an account?{" "}
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
