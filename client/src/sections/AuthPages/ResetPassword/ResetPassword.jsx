import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import PropTypes from "prop-types";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  resetPasswordSubmit,
  setError,
  setMessage,
} from "../../../store/slices";

const ResetPassword = ({ className = "" }) => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const {
    status,
    error,
    token: authToken,
    user,
  } = useAppSelector((state) => state.auth);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("error");
  const [showToast, setShowToast] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    shouldFocusError: true,
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const newPassword = watch("newPassword");

  // Reset form when component mounts or when returning to the page
  useEffect(() => {
    reset({
      newPassword: "",
      confirmPassword: "",
    });
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    dispatch(setError(null));
    dispatch(setMessage(null));
  }, [location.pathname, reset, dispatch]);

  useEffect(() => {
    if (error) {
      setToastMessage(error);
      setToastVariant("error");
      setShowToast(true);
    } else {
      return;
    }

    const timer = setTimeout(() => {
      setShowToast(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, [error, dispatch]);

  const onSubmit = async (data) => {
    dispatch(setError(null));
    dispatch(setMessage(null));
    const searchParams = new URLSearchParams(location.search);
    const hashParams = new URLSearchParams(
      String(location.hash || "")
        .replace(/^#/, "")
        .replace(/^\?/, ""),
    );
    const readParam = (key) => searchParams.get(key) || hashParams.get(key);
    const resetToken =
      readParam("token") ||
      readParam("reset_token") ||
      readParam("access_token") ||
      readParam("resetToken") ||
      readParam("code") ||
      readParam("otp");
    const email = readParam("email") || readParam("user_email") || user?.email;

    if (!resetToken && !authToken) {
      dispatch(setError("Reset link is missing or invalid."));
      return;
    }

    try {
      await dispatch(
        resetPasswordSubmit({
          newPassword: data.newPassword,
          confirmPassword: data.confirmPassword,
          token: resetToken,
          email,
        }),
      ).unwrap();

      setToastMessage("Password updated successfully.");
      setToastVariant("success");
      setShowToast(true);
    } catch (err) {
      setToastMessage(err?.message || "Could not update password.");
      setToastVariant("error");
      setShowToast(true);
    }
  };

  const toastStyles =
    toastVariant === "success"
      ? "border-green-200 bg-green-50 text-green-700"
      : "border-red-200 bg-red-50 text-red-700";

  return (
    <section
      className={`w-full pb-12 bg-[#F5F5F0] flex items-start justify-center pt-8 md:pt-12 ${className}`}
    >
      {showToast && (
        <div
          className={`fixed top-4 right-4 z-50 max-w-sm rounded-lg border px-4 py-3 text-sm shadow-lg ${toastStyles}`}
          role="alert"
        >
          {toastMessage}
        </div>
      )}
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-[22px] shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-6 sm:p-8 md:p-10 lg:p-12">
            <div className="mb-6 text-center">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight text-primary">
                Reset your password
              </h2>
              <p className="mt-2 text-sm sm:text-base md:text-lg leading-relaxed text-primary opacity-80">
                Enter and confirm your new password to continue.
              </p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Password Fields Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* New Password Field */}
                <div>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      placeholder="New Password"
                      autoComplete="new-password"
                      {...register("newPassword", {
                        required: "New password is required",
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters",
                        },
                      })}
                      className={`w-full px-4 py-3 pr-10 rounded-lg border ${
                        errors.newPassword
                          ? "border-red-500"
                          : "border-gray-300"
                      } focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-primary placeholder:text-gray-400 bg-white`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="password-toggle absolute right-3 top-1/2 -translate-y-1/2 p-1 flex items-center justify-center text-primary/70 hover:text-primary focus:outline-none focus:ring-0"
                      aria-label={
                        showNewPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showNewPassword ? (
                        <FiEyeOff className="w-5 h-5" />
                      ) : (
                        <FiEye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors.newPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.newPassword.message}
                    </p>
                  )}
                </div>

                {/* Confirm New Password Field */}
                <div>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm New Password"
                      autoComplete="new-password"
                      {...register("confirmPassword", {
                        required: "Please confirm your password",
                        validate: (value) =>
                          value === newPassword || "Passwords do not match",
                      })}
                      className={`w-full px-4 py-3 pr-10 rounded-lg border ${
                        errors.confirmPassword
                          ? "border-red-500"
                          : "border-gray-300"
                      } focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-primary placeholder:text-gray-400 bg-white`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="password-toggle absolute right-3 top-1/2 -translate-y-1/2 p-1 flex items-center justify-center text-primary/70 hover:text-primary focus:outline-none focus:ring-0"
                      aria-label={
                        showConfirmPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showConfirmPassword ? (
                        <FiEyeOff className="w-5 h-5" />
                      ) : (
                        <FiEye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Update Password Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full bg-primary text-secondary py-3 sm:py-4 rounded-[7px] font-medium text-base sm:text-lg hover:bg-primary-hover transition-colors shadow-md"
                >
                  {status === "loading" ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

ResetPassword.propTypes = {
  className: PropTypes.string,
};

export default ResetPassword;
