import React, { useState } from "react";
import { Mail, Lock } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import UseAuthContext from "../../Hooks/UseAuthContext";


const Login = () => {
  const { signInUser, signInGoogle } = UseAuthContext();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const handleLogin = () => {
    signInUser(email, pass)
      .then(() => navigate("/"))
      .catch((err) => console.log(err.message));
  };

  const handleGoogleLogin = () => {
    signInGoogle()
      .then(() => navigate("/"))
      .catch((err) => console.log(err.message));
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
      <div className="hero-content flex-col lg:flex-row shadow-xl rounded-2xl bg-base-100 p-10 gap-12">
        {/* Left text */}
        <div className="max-w-md text-center lg:text-left">
          <h1 className="text-5xl font-bold">Welcome Back!</h1>
          <p className="py-6 text-base-content/70">
            Fast, secure login to your dashboard.
          </p>
        </div>

        {/* Login Card */}
        <div className="card bg-base-100 w-full max-w-sm shadow-xl border border-base-300">
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
                />
              </div>

              <div className="flex justify-end text-sm mt-1">
                <a className="link link-hover text-primary">Forgot password?</a>
              </div>

              {/* Login Button */}
              <button
                className="btn btn-neutral mt-4 w-full text-base"
                onClick={handleLogin}
              >
                Login
              </button>

              {/* Divider */}
              <div className="divider text-sm">OR</div>

              {/* Google Login */}
              <button
                className="btn btn-outline w-full flex items-center gap-2"
                onClick={handleGoogleLogin}
              >
                <FcGoogle size={22} />
                Continue with Google
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
