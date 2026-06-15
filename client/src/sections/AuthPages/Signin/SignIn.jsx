import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import signInImage from "../../../assets/images/signinpage.png";
import PropTypes from "prop-types";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  loginUser,
  setUserType as setGlobalUserType,
  setMessage as setAuthMessage,
} from "../../../store/slices";

const SignIn = ({ className = "" }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userType, setUserType] = useState("User");
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("error");
  const [showToast, setShowToast] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch();
  const { status } = useAppSelector((state) => state.auth);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    shouldFocusError: true,
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Reset form when component mounts or when returning to the page
  useEffect(() => {
    reset({
      email: "",
      password: "",
    });
  }, [location.pathname, reset]);

  const onSubmit = async (data) => {
    // Persist the selected tab (User / Business) into auth state for downstream checks
    dispatch(setGlobalUserType(userType));
    try {
      await dispatch(
        loginUser({
          email: data.email,
          password: data.password,
          userType: userType,
        }),
      ).unwrap();
      setToastMessage("Your are Logged in successfully.");
      setToastVariant("success");
      setShowToast(true);
      const from = location.state?.from?.pathname || "/";
      setTimeout(() => {
        navigate(from, { replace: true });
        dispatch(setAuthMessage(null));
      }, 900);
    } catch (err) {
      setToastMessage(String(err || "Unable to sign in. Please try again."));
      setToastVariant("error");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);
    }
  };

  return (
    <section
      className={`w-full pb-12 bg-[#F5F5F0] flex items-start justify-center pt-8 md:pt-12 ${className}`}
    >
      {showToast && (
        <div
          className={`fixed top-4 right-4 z-[9999] max-w-sm rounded-lg border px-4 py-3 text-sm shadow-lg ${
            toastVariant === "success"
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
          role="alert"
        >
          {toastMessage}
        </div>
      )}
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-[38px] shadow-lg border border-[#ADADAD] overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Left Side - Image */}
            <div className="w-full lg:w-1/2 bg-white p-4 sm:p-6 md:p-8 flex items-center justify-center">
              <div className="w-full h-full bg-white rounded-[21px] overflow-hidden">
                <img
                  src={signInImage}
                  alt="Sign In"
                  className="w-full h-auto object-contain  object-center rounded-[21px] sm:h-full sm:object-cover sm:object-right"
                />
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 p-6 sm:p-8 md:p-10 lg:p-12 flex flex-col justify-center">
              {/* User Type Toggle */}
              <div className="flex gap-2 mb-6 sm:mb-8">
                <button
                  type="button"
                  onClick={() => setUserType("User")}
                  className={`flex-1 py-2 sm:py-3 px-4 rounded-[8.4px] font-semibold text-sm sm:text-base transition-colors ${
                    userType === "User"
                      ? "bg-primary text-secondary"
                      : "bg-[#F5F5F0] text-primary hover:text-secondary"
                  }`}
                >
                  User
                </button>
                <button
                  type="button"
                  onClick={() => setUserType("Business")}
                  className={`flex-1 py-2 sm:py-3 px-4 rounded-[8.4px] font-semibold text-sm sm:text-base transition-colors ${
                    userType === "Business"
                      ? "bg-primary text-secondary"
                      : "bg-[#F5F5F0] text-primary hover:text-secondary"
                  }`}
                >
                  Business
                </button>
              </div>

              {/* Sign In Form */}
              <form
                key={location.pathname}
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4 sm:space-y-5"
                autoComplete="off"
              >
                {/* Email Field */}
                <div>
                  <input
                    type="email"
                    placeholder="Email"
                    autoComplete="off"
                    {...register("email", {
                      required: "Please enter your email address",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message:
                          "Please enter a valid email address (e.g. name@example.com)",
                      },
                    })}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-primary placeholder:text-gray-400`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      autoComplete="new-password"
                      {...register("password", {
                        required: "Please enter your password",
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters",
                        },
                      })}
                      className={`w-full px-4 py-3 pr-12 rounded-lg border ${
                        errors.password ? "border-red-500" : "border-gray-300"
                      } focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-primary placeholder:text-gray-400`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-primary/70 hover:text-primary focus:outline-none focus:ring-0"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <FiEye className="w-5 h-5" />
                      ) : (
                        <FiEyeOff className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Forget Password Link */}
                <div className="flex justify-start">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate("/forget-password");
                    }}
                    className="text-sm transition-colors"
                    style={{ color: "#000000DE" }}
                  >
                    Forgot password?
                  </a>
                </div>

                {/* Sign In Button */}
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full bg-primary text-secondary py-3 sm:py-4 rounded-[12px] font-semibold text-base sm:text-lg hover:bg-primary-hover transition-colors shadow-md"
                >
                  {status === "loading" ? "Signing In..." : "Sign In"}
                </button>

                {/* Sign Up Link */}
                <p className="text-center text-sm text-primary mt-4">
                  Don't have an account?{" "}
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate("/signup");
                    }}
                    className="underline font-bold hover:text-primary-hover transition-colors"
                  >
                    Sign up
                  </a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

SignIn.propTypes = {
  className: PropTypes.string,
};

export default SignIn;
