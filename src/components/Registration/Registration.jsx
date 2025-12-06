import React, { useState } from "react";
import { User, Mail, Lock, Image as ImageIcon } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import UseAuthContext from "../../Hooks/UseAuthContext";


const Registration = () => {
  const { registerUser, signInGoogle, updateUserProfile } = UseAuthContext();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [photo, setPhoto] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  // Handle form submit
  const handleRegister = async () => {
    try {
      const result = await registerUser(email, pass);

      await updateUserProfile({
        displayName: name,
        photoURL: photo,
      });

      navigate("/"); // redirect after register
    } catch (err) {
      console.log(err.message);
    }
  };

  // Google Signup
  const handleGoogleSignup = () => {
    signInGoogle()
      .then(() => navigate("/"))
      .catch((err) => console.log(err.message));
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
      <div className="hero-content flex-col lg:flex-row shadow-xl rounded-2xl bg-base-100 p-10 gap-12">
        {/* Left Text */}
        <div className="max-w-md text-center lg:text-left">
          <h1 className="text-5xl font-bold">Create an Account</h1>
          <p className="py-6 text-base-content/70">
            Register and get full access to your dashboard.
          </p>
        </div>

        {/* Registration Card */}
        <div className="card bg-base-100 w-full max-w-sm shadow-xl border border-base-300">
          <div className="card-body">
            <fieldset className="fieldset flex flex-col gap-3">
              {/* Name */}
              <label className="label font-medium">User Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 opacity-70" size={20} />
                <input
                  type="text"
                  className="input input-bordered w-full pl-10"
                  placeholder="Enter your name"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

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

              {/* Photo URL */}
              <label className="label font-medium">User Photo URL</label>
              <div className="relative">
                <ImageIcon
                  className="absolute left-3 top-3 opacity-70"
                  size={20}
                />
                <input
                  type="text"
                  className="input input-bordered w-full pl-10"
                  placeholder="Photo URL"
                  onChange={(e) => setPhoto(e.target.value)}
                />
              </div>

              {/* Submit Button */}
              <button
                className="btn btn-neutral mt-4 w-full text-base"
                onClick={handleRegister}
              >
                Register
              </button>

              {/* Divider */}
              <div className="divider text-sm">OR</div>

              {/* Google Signup */}
              <button
                className="btn btn-outline w-full flex items-center gap-2"
                onClick={handleGoogleSignup}
              >
                <FcGoogle size={22} />
                Sign up with Google
              </button>

              <span className="text-sm pt-2">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-400 underline">
                  Login
                </Link>
              </span>
            </fieldset>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;
