import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { FiEye, FiEyeOff } from "react-icons/fi";
import PropTypes from "prop-types";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { changePassword } from "../../../store/slices";

const UpdatePassword = ({ className = "" }) => {
  const dispatch = useAppDispatch();
  const { status, token, user } = useAppSelector((state) => state.auth);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordMismatchError, setPasswordMismatchError] = useState("");
  const [toast, setToast] = useState({
    show: false,
    message: "",
    variant: "error",
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    shouldFocusError: true,
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPassword = watch("newPassword");
  const confirmPassword = watch("confirmPassword");

  // Check password match on each change
  useEffect(() => {
    if (newPassword && confirmPassword) {
      if (newPassword !== confirmPassword) {
        setPasswordMismatchError("Passwords do not match");
      } else {
        setPasswordMismatchError("");
      }
    } else if (!confirmPassword) {
      setPasswordMismatchError("");
    }
  }, [newPassword, confirmPassword]);

  const onSubmit = async (data) => {
    try {
      const res = await dispatch(
        changePassword({
          newPassword: data.newPassword,
          old_password: data.oldPassword,
          authToken: token,
        }),
      ).unwrap();

      setToast({
        show: true,
        message: res?.message || res?.msg || "Password updated successfully.",
        variant: "success",
      });
      // Hide after 3 seconds
      setTimeout(() => {
        setToast((prev) => ({
          ...prev,
          show: false,
        }));
      }, 3000);
      reset();
    } catch (err) {
      setToast({
        show: true,
        message: String(err || "Could not update password."),
        variant: "error",
      });
    }
  };

  const toastStyles =
    toast.variant === "success"
      ? "border-green-200 bg-green-50 text-green-700"
      : "border-red-200 bg-red-50 text-red-700";

  return (
    <section
      className={`w-full pb-12 bg-[#F5F5F0] flex items-start justify-center pt-8 md:pt-12 ${className}`}
    >
      {toast.show && (
        <div
          className={`fixed top-4 right-4 z-[9999] max-w-sm rounded-lg border px-4 py-3 text-sm shadow-lg ${toastStyles}`}
        >
          {toast.message}
        </div>
      )}
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-[22px] shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-6 sm:p-8 md:p-10 lg:p-12">
            <div className="mb-6 text-center">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight text-primary">
                Change Password
              </h2>
              <p className="mt-2 text-sm sm:text-base md:text-lg leading-relaxed text-primary opacity-80">
                Change your password for your logged-in account.
              </p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Old Password */}
              <div>
                <div className="relative">
                  <input
                    type={showOldPassword ? "text" : "password"}
                    placeholder="Current Password"
                    autoComplete="current-password"
                    {...register("oldPassword", {
                      required: "Current password is required",
                    })}
                    className={`w-full px-4 py-3 pr-10 rounded-lg border ${errors.oldPassword ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-primary placeholder:text-gray-400 bg-white`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-primary/70 hover:text-primary"
                  >
                    {showOldPassword ? (
                      <FiEyeOff className="w-5 h-5" />
                    ) : (
                      <FiEye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.oldPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.oldPassword.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      className={`w-full px-4 py-3 pr-10 rounded-lg border ${errors.newPassword ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-primary placeholder:text-gray-400 bg-white`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword((p) => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-primary/70 hover:text-primary"
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
                      className={`w-full px-4 py-3 pr-10 rounded-lg border ${passwordMismatchError ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-primary placeholder:text-gray-400 bg-white`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((p) => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-primary/70 hover:text-primary"
                    >
                      {showConfirmPassword ? (
                        <FiEyeOff className="w-5 h-5" />
                      ) : (
                        <FiEye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {/* {!passwordMismatchError && errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.confirmPassword.message}
                    </p>
                  )} */}
                  {passwordMismatchError && (
                    <p className="text-red-500 text-sm mt-1">
                      {passwordMismatchError}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full bg-primary text-secondary py-3 sm:py-4 rounded-[7px] font-medium text-base sm:text-lg hover:bg-primary-hover transition-colors shadow-md"
              >
                {status === "loading" ? "changing..." : "Change Password"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

UpdatePassword.propTypes = {
  className: PropTypes.string,
};

export default UpdatePassword;
