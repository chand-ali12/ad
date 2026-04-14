import React, { useState, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import signUpImage from "../../../assets/images/signinpage.png";
import PropTypes from "prop-types";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  registerUser,
  registerBusinessUser,
  setError,
  setMessage,
  setStatus,
} from "../../../store/slices";
import { getBrands } from "../../../store/slices/brandsSlice";
import { fetchAuthenticateNowView } from "../../../store/slices/authenticationRequestSlice";
import { CustomSelect } from "../../../components";
import { countries } from "../../../utils/countries";

const SignUp = ({ className = "" }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userType, setUserType] = useState("User");
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("error");
  const [showToast, setShowToast] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const dispatch = useAppDispatch();
  const { status, error, message } = useAppSelector((state) => state.auth);
  const { brands: apiBrands = [] } = useAppSelector((state) => state.brands);
  const { brands: authBrands = [] } = useAppSelector(
    (state) => state.authenticationRequest || {},
  );
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    shouldFocusError: true,
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      business_name: "",
      website: "",
      country: "",
      business_brands: "",
      acceptTerms: false,
    },
  });

  const password = watch("password");
  const skipStaleToastRef = useRef(false);

  const emptyFormValues = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    business_name: "",
    website: "",
    country: "",
    business_brands: "",
    acceptTerms: false,
  };

  // When user lands on Sign Up (e.g. from Sign In): clear stale auth message/error and mark so we don't show that toast again
  useEffect(() => {
    dispatch(setError(null));
    dispatch(setMessage(null));
    skipStaleToastRef.current = true;
  }, [dispatch]);

  // Prefetch brands once so Business Brands dropdown can show all options
  useEffect(() => {
    dispatch(getBrands());
    dispatch(fetchAuthenticateNowView());
  }, [dispatch]);

  // Reset form when pathname is signup (e.g. returning to the page)
  useEffect(() => {
    if (location.pathname !== "/signup") return;
    reset(emptyFormValues);
    setUserType("User");
    dispatch(setError(null));
    dispatch(setMessage(null));
  }, [location.pathname, reset, dispatch]);

  // Show toast only for fresh errors/success; skip when we just landed with stale message (e.g. back from Sign In)
  useEffect(() => {
    if (!error && !message) {
      skipStaleToastRef.current = false;
      return;
    }
    if (skipStaleToastRef.current) {
      skipStaleToastRef.current = false;
      dispatch(setError(null));
      dispatch(setMessage(null));
      return;
    }
    if (error) {
      setToastMessage(error);
      setToastVariant("error");
      setShowToast(true);
    } else {
      setToastMessage(message);
      setToastVariant("success");
      setShowToast(true);
    }
    const timer = setTimeout(() => setShowToast(false), 5000);
    return () => clearTimeout(timer);
  }, [error, message, dispatch]);

  // On successful registration: clear form immediately, wait for user to see success popup, then redirect to Sign In
  useEffect(() => {
    if (status !== "succeeded") return;
    reset(emptyFormValues);
    setUserType("User");
    const delayMs = 5000;
    const timeoutId = setTimeout(() => {
      dispatch(setError(null));
      dispatch(setMessage(null));
      dispatch(setStatus("idle"));
      navigate("/signin");
    }, delayMs);
    return () => clearTimeout(timeoutId);
  }, [status, reset, dispatch, navigate]);

  const onSubmit = (data) => {
    if (userType === "Business") {
      dispatch(
        registerBusinessUser({
          name: data.name,
          email: data.email,
          password: data.password,
          business_name: data.business_name,
          website: data.website,
          business_brands: data.business_brands,
          country: data.country,
        }),
      );
      return;
    }

    dispatch(
      registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
      }),
    );
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
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-[38px] shadow-lg border border-[#ADADAD] overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Left Side - Image */}
            <div className="w-full lg:w-1/2 bg-white p-4 sm:p-6 md:p-8 flex items-center lg:items-start justify-center">
              {/* Option B: keep image size stable so it doesn't stretch with the form height */}
              <div className="w-full bg-white rounded-[21px] overflow-hidden sm:aspect-[4/3] lg:aspect-[4/5]">
                <img
                  src={signUpImage}
                  alt="Sign Up"
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

              {/* Sign Up Form */}
              <form
                key={location.pathname}
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4 sm:space-y-5"
                autoComplete="off"
              >
                {/* Name Field */}
                <div>
                  <input
                    type="text"
                    placeholder="Name"
                    autoComplete="off"
                    {...register("name", {
                      required: "Name is required",
                      minLength: {
                        value: 2,
                        message: "Name must be at least 2 characters",
                      },
                    })}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-primary placeholder:text-gray-400`}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>

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

                {userType === "Business" && (
                  <>
                    {/* Business Name Field */}
                    <div>
                      <input
                        type="text"
                        placeholder="Business Name"
                        autoComplete="off"
                        {...register("business_name", {
                          required:
                            userType === "Business"
                              ? "Business name is required"
                              : false,
                        })}
                        className={`w-full px-4 py-3 rounded-lg border ${
                          errors.business_name
                            ? "border-red-500"
                            : "border-gray-300"
                        } focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-primary placeholder:text-gray-400`}
                      />
                      {errors.business_name && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.business_name.message}
                        </p>
                      )}
                    </div>

                    {/* Website Field */}
                    <div>
                      <input
                        type="url"
                        placeholder="Website"
                        autoComplete="off"
                        {...register("website", {
                          required:
                            userType === "Business"
                              ? "Website is required"
                              : false,
                        })}
                        className={`w-full px-4 py-3 rounded-lg border ${
                          errors.website ? "border-red-500" : "border-gray-300"
                        } focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-primary placeholder:text-gray-400`}
                      />
                      {errors.website && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.website.message}
                        </p>
                      )}
                    </div>

                    {/* Country Field */}
                    <div>
                      <Controller
                        name="country"
                        control={control}
                        rules={{
                          required:
                            userType === "Business"
                              ? "Country is required"
                              : false,
                        }}
                        render={({ field }) => (
                          <CustomSelect
                            ref={field.ref}
                            name={field.name}
                            onBlur={field.onBlur}
                            options={[
                              { value: "", label: "Country" },
                              ...countries.map((country) => ({
                                value: country.code,
                                label: country.name,
                              })),
                            ]}
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Country"
                            triggerClassName={`${errors.country ? "border-red-500" : ""}`}
                          />
                        )}
                      />
                      {errors.country && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.country.message}
                        </p>
                      )}
                    </div>

                    {/* Business Brands Field */}
                    <div>
                      <Controller
                        name="business_brands"
                        control={control}
                        rules={{
                          required: "Business brands is required",
                        }}
                        render={({ field }) => {
                          const brandsList =
                            Array.isArray(apiBrands) && apiBrands.length
                              ? apiBrands
                              : Array.isArray(authBrands)
                                ? authBrands
                                : [];
                          const sortedBrands = [...brandsList].sort((a, b) => {
                            const nameA = (a.brand || a.name || "")
                              .toString()
                              .toLowerCase();
                            const nameB = (b.brand || b.name || "")
                              .toString()
                              .toLowerCase();
                            return nameA.localeCompare(nameB);
                          });
                          const options = [
                            // { value: "", label: "Business Brands" },
                            ...sortedBrands.map((b) => ({
                              value: b.brand || b.name || String(b.id),
                              label: b.brand || b.name || String(b.id),
                            })),
                          ];
                          return (
                            <CustomSelect
                              ref={field.ref}
                              name={field.name}
                              onBlur={field.onBlur}
                              options={options}
                              value={field.value}
                              onChange={field.onChange}
                              placeholder="Business Brands"
                              searchable
                              searchPlaceholder="Search brands..."
                              triggerClassName={`${errors.business_brands ? "border-red-500" : ""}`}
                            />
                          );
                        }}
                      />
                      {errors.business_brands && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.business_brands.message}
                        </p>
                      )}
                    </div>
                  </>
                )}

                {/* Password Field */}
                <div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      autoComplete="new-password"
                      {...register("password", {
                        required: "Please enter a password",
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
                      className="password-toggle absolute right-3 top-1/2 -translate-y-1/2 p-1 text-primary/70 hover:text-primary focus:outline-none focus:ring-0"
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

                {/* Confirm Password Field */}
                <div>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      autoComplete="new-password"
                      {...register("confirmPassword", {
                        required: "Please confirm your password",
                        validate: (value) =>
                          value === password || "Passwords do not match",
                      })}
                      className={`w-full px-4 py-3 pr-12 rounded-lg border ${
                        errors.confirmPassword
                          ? "border-red-500"
                          : "border-gray-300"
                      } focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-primary placeholder:text-gray-400`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="password-toggle absolute right-3 top-1/2 -translate-y-1/2 p-1 text-primary/70 hover:text-primary focus:outline-none focus:ring-0"
                      aria-label={
                        showConfirmPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showConfirmPassword ? (
                        <FiEye className="w-5 h-5" />
                      ) : (
                        <FiEyeOff className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                {/* Terms & Privacy acceptance */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="acceptTerms"
                    {...register("acceptTerms", {
                      required: "You must accept the Terms and Privacy Policy",
                    })}
                    className="w-5 h-5 flex-shrink-0 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <label
                    htmlFor="acceptTerms"
                    className="text-xs sm:text-sm text-primary"
                  >
                    I accept the{" "}
                    <Link to="/terms" className="text-blue-600 hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      to="/privacy"
                      className="text-blue-600 hover:underline"
                    >
                      Privacy Policy
                    </Link>
                  </label>
                </div>
                {errors.acceptTerms && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1">
                    {errors.acceptTerms.message}
                  </p>
                )}

                {/* Create Account Button */}
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full bg-primary text-secondary py-3 sm:py-4 rounded-[12px] font-medium text-base sm:text-lg hover:bg-primary-hover transition-colors shadow-md"
                >
                  {status === "loading" ? "Creating..." : "Create free account"}
                </button>

                {/* Sign In Link */}
                <p className="text-center text-sm text-primary mt-4">
                  Already have an account?{" "}
                  <Link
                    to="/signin"
                    className="underline font-bold hover:text-primary-hover transition-colors"
                  >
                    Sign In
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

SignUp.propTypes = {
  className: PropTypes.string,
};

export default SignUp;
