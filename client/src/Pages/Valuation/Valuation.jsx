import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { CustomSelect } from "../../components";
import { getBrands } from "../../store/slices/brandsSlice";
import {
  submitValuationCoa,
  valuationCoaChangeStatus,
  pickValuationBraintreePayload,
} from "../../services/forumService";

const Valuation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth?.token);
  const { brands: apiBrands = [] } = useAppSelector((state) => state.brands);
  const { brands: authBrands = [] } = useAppSelector(
    (state) => state.authenticationRequest || {},
  );
  const [submitStatus, setSubmitStatus] = useState("idle");
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    shouldFocusError: true,
    defaultValues: {
      name: "",
      email: "",
      certificateNumber: "",
      brand: "",
      condition: "",
    },
  });

  useEffect(() => {
    dispatch(getBrands());
  }, [dispatch]);

  useEffect(() => {
    reset({
      name: "",
      email: "",
      certificateNumber: "",
      brand: "",
      condition: "",
    });
  }, [location.pathname, reset]);

  const TEST_COA_VALUE = "TEST";

  const onSubmit = async (data) => {
    setSubmitError("");
    setSubmitSuccess("");
    setSubmitStatus("loading");
    const coaNumber = data.certificateNumber?.trim() ?? "";
    const isTestMode = coaNumber.toUpperCase() === TEST_COA_VALUE.toUpperCase();

    try {
      if (isTestMode) {
        if (!token) {
          setSubmitError("Please log in to test the change-status API.");
          setSubmitStatus("failed");
          return;
        }
        const res = await valuationCoaChangeStatus({
          order_number: "VA-TEST",
          transaction_id: "test-transaction",
          token,
        });
        setSubmitSuccess(
          res?.msg ?? "Change-status API called successfully (test).",
        );
        setSubmitStatus("succeeded");
        reset();
        return;
      }

      const res = await submitValuationCoa({
        name: data.name,
        email: data.email,
        coa_number: coaNumber,
        description: data.condition,
        brand: data.brand,
        token,
      });

      const bt = pickValuationBraintreePayload(res);
      if (bt) {
        const fullName = (data.name || "").trim();
        const nameParts = fullName.split(/\s+/).filter(Boolean);
        const firstFromForm = nameParts[0] || "";
        const restFromForm = nameParts.slice(1).join(" ");
        navigate("/checkout", {
          state: {
            checkoutType: "valuation",
            page: "valuation-page",
            braintreePayload: {
              ...bt,
              token: bt.token,
              id: bt.id,
              order_number: bt.order_number,
              amount: bt.amount ?? bt.payed_amount ?? 10,
              queries_count: bt.queries_count,
              query_type: bt.query_type ?? "valuation",
              first_name: bt.first_name || firstFromForm,
              last_name: bt.last_name || restFromForm,
              encryptedAmount: bt.encrypt_amount,
              encrypt_amount: bt.encrypt_amount,
              email: bt.email ?? data.email,
              coupon_code: bt.coupon_code,
            },
          },
        });
        setSubmitStatus("idle");
        return;
      }

      const order_number = res?.data?.order_number ?? res?.order_number;
      const transaction_id = res?.data?.transaction_id ?? res?.transaction_id;
      if (order_number && transaction_id && token) {
        await valuationCoaChangeStatus({ order_number, transaction_id, token });
        setSubmitSuccess(
          res?.msg ?? "Valuation request submitted successfully.",
        );
        setSubmitStatus("succeeded");
        reset();
        return;
      }

      setSubmitError(
        res?.msg
          ? `${res.msg} (Payment could not be started — missing checkout token. Try again or contact support.)`
          : "Payment could not be started. Please try again.",
      );
      setSubmitStatus("failed");
    } catch (err) {
      const data = err?.data ?? err?.response?.data;
      const message =
        (data &&
          (data.msg ?? data.message ?? data.error ?? data.additionalMsg)) ||
        err?.message ||
        "Submission failed. Please try again.";
      setSubmitError(
        typeof message === "string"
          ? message
          : "Submission failed. Please try again.",
      );
      setSubmitStatus("failed");
    }
  };

  const closePopup = () => {
    setSubmitError("");
    setSubmitSuccess("");
  };

  const showPopup = submitError || submitSuccess;
  const isError = !!submitError;

  return (
    <div className="w-full min-h-screen bg-[#F5F5F0] py-8 sm:py-12 md:py-16">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-[22px] shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-6 sm:p-8 md:p-10 lg:p-12">
            {/* Header */}
            <div className="mb-6 sm:mb-8 flex items-center justify-between flex-wrap gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-primary">
                What's it worth?
              </h1>
            </div>

            {/* Description */}
            <div className="mb-6 sm:mb-8 space-y-4">
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Our valuation service provides an an expert assessment of your
                item's market value. Ideal for buyers and sellers, it ensures
                fair transactions and informed pricing. Our experts analyse
                market trends, comparable sales, and condition to deliver an
                accurate valuation.
              </p>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                In order to purchase this add on, a previous certificate of
                authenticity from Authentic Detective is required.{" "}
                <span className="font-bold">Price - $10</span>
              </p>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 mb-6 sm:mb-8"></div>

            {/* Error / Success popup modal */}
            {showPopup && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                role="dialog"
                aria-modal="true"
                aria-labelledby="popup-title"
              >
                <div
                  className="absolute inset-0 bg-black/50"
                  onClick={closePopup}
                  aria-hidden="true"
                />
                <div className="relative w-full max-w-md rounded-2xl bg-white shadow-xl border border-gray-200 p-6 sm:p-8">
                  <h2
                    id="popup-title"
                    className={`w-full flex items-center justify-center text-lg font-semibold mb-4 ${
                      isError ? "text-red-600" : "text-gray-900"
                    }`}
                  >
                    {isError ? "Error" : "Success"}
                  </h2>
                  <p className="text-gray-700 text-sm sm:text-base mb-6 text-center">
                    {submitError || submitSuccess}
                  </p>
                  <button
                    type="button"
                    onClick={closePopup}
                    className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                      isError
                        ? "bg-red-600 text-white hover:bg-red-700"
                        : "bg-primary text-secondary hover:bg-primary-hover"
                    }`}
                  >
                    OK
                  </button>
                </div>
              </div>
            )}

            {/* Form */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 sm:space-y-6"
            >
              {/* Name and Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    placeholder="Name"
                    {...register("name", { required: "Name is required" })}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-primary placeholder:text-gray-400 bg-gray-50`}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-primary placeholder:text-gray-400 bg-gray-50`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Certificate Number and Select Brand */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    placeholder="Certificate Number"
                    {...register("certificateNumber", {
                      required: "Certificate number is required",
                    })}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.certificateNumber
                        ? "border-red-500"
                        : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-primary placeholder:text-gray-400 bg-gray-50`}
                  />
                  {errors.certificateNumber && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.certificateNumber.message}
                    </p>
                  )}
                </div>
                <div>
                  <Controller
                    name="brand"
                    control={control}
                    rules={{ required: "Brand is required" }}
                    render={({ field }) => {
                      // Reuse the same brand source logic as Sign Up:
                      // prefer brands from brands slice, fall back to authenticationRequest.brands
                      const brandsSource =
                        Array.isArray(apiBrands) && apiBrands.length
                          ? apiBrands
                          : Array.isArray(authBrands)
                            ? authBrands
                            : [];
                      const sortedBrands = [...brandsSource].sort((a, b) => {
                        const nameA = (a.brand || a.name || a.brand_name || "")
                          .toString()
                          .toLowerCase();
                        const nameB = (b.brand || b.name || b.brand_name || "")
                          .toString()
                          .toLowerCase();
                        return nameA.localeCompare(nameB);
                      });
                      const options = [
                        // { value: '', label: 'Select Brand' },
                        ...sortedBrands.map((b) => ({
                          value: String(b.id),
                          label:
                            b.brand || b.name || b.brand_name || String(b.id),
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
                          placeholder="Select Brand"
                          triggerClassName={`bg-gray-50 ${errors.brand ? "border-red-500" : ""}`}
                          searchable
                          searchPlaceholder="Search brand..."
                        />
                      );
                    }}
                  />
                  {errors.brand && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.brand.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Condition */}
              <div>
                <textarea
                  placeholder="Condition"
                  rows={4}
                  {...register("condition", {
                    required: "Condition is required",
                  })}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.condition ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-primary placeholder:text-gray-400 bg-gray-50 resize-none`}
                />
                {errors.condition && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.condition.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={submitStatus === "loading"}
                  className="w-full bg-primary text-secondary py-3 sm:py-4 rounded-[7px] font-semibold text-base sm:text-lg hover:bg-primary-hover transition-colors shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitStatus === "loading" ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Valuation;
