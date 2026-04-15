import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FiArrowLeft, FiCreditCard } from "react-icons/fi";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  verifyCoupon,
  clearCoupon,
  getAuthCheckoutBraintreeToken,
  setError,
  getAuthenticityCardPricing,
  submitBraintreeAuthCards,
  submitBraintreeCheckout,
  submitBraintreeValuation,
} from "../../store/slices/checkoutSlice";
import { clearCart } from "../../store/slices/cartSlice";
import { valuationCoaChangeStatus } from "../../services/forumService";

const BRAINTREE_SCRIPT =
  "https://js.braintreegateway.com/web/dropin/1.36.0/js/dropin.min.js";

const loadScript = (src) =>
  new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });

const sanitizePaymentBody = (payload) => {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => {
      if (value == null) return false;
      if (Array.isArray(value)) return true;
      return typeof value !== "object";
    }),
  );
};

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [braintreePayload, setBraintreePayload] = useState(null);
  const [braintreeInstance, setBraintreeInstance] = useState(null);
  const [braintreeReady, setBraintreeReady] = useState(false);
  const [paymentSuccessMessage, setPaymentSuccessMessage] = useState("");
  const [paymentMethodError, setPaymentMethodError] = useState("");
  const braintreeContainerRef = useRef(null);
  const user = useAppSelector((state) => state.auth?.user);
  const authToken = useAppSelector((state) => state.auth?.token);
  const {
    coupon,
    couponError,
    couponStatus,
    cardPricing,
    cardPricingStatus,
    status: checkoutStatus,
    error: checkoutError,
  } = useAppSelector((state) => state.checkout);
  const { items: cartItems = [], subtotal: cartSubtotal = 0 } =
    useAppSelector((state) => state.cart) ?? {};

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
    setValue,
    setError,
    clearErrors,
  } = useForm({
    shouldFocusError: true,
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      contactNumber: "",
      street_1: "",
      street_2: "",
      country: "",
      city: "",
      state: "",
      postal_code: "",
      cardNumber: "",
      expirationDate: "",
      cvc: "",
      promoCode: "",
    },
  });

  // Load authenticity card pricing
  useEffect(() => {
    dispatch(getAuthenticityCardPricing());
  }, [dispatch]);

  // Reset form when component mounts
  useEffect(() => {
    setPaymentMethodError("");
    reset({
      firstName: "",
      lastName: "",
      email: "",
      contactNumber: "",
      street_1: "",
      street_2: "",
      country: "",
      city: "",
      state: "",
      postal_code: "",
      cardNumber: "",
      expirationDate: "",
      cvc: "",
      promoCode: "",
    });
  }, [location.pathname, reset]);

  const rawIds =
    location.state?.certificateIds ??
    cartItems.map((i) => i.id ?? i.coa_number).filter(Boolean);
  const certificateIds = rawIds
    .map((id) =>
      id != null && typeof id === "object"
        ? (id.id ?? id.query_id ?? id.certificate_id ?? id.coa_number)
        : id,
    )
    .filter((id) => id != null && id !== "");
  const checkoutType = location.state?.checkoutType;
  console.log("Checkout type :- ", checkoutType);
  
  const coaCount = certificateIds?.length ?? 0;

  // ad-old: Checkout receives payload only from previous step (Auth/Cart). No "prepare" API call on Checkout page.
  const [searchParams] = useSearchParams();
  useEffect(() => {
    const fromState = location.state?.braintreePayload;
    const fromQuery = searchParams.get("data");
    const pageName = searchParams.get("page") || location.state?.page;
    let payload = fromState;
    if (!payload && fromQuery) {
      try {
        payload = JSON.parse(decodeURIComponent(fromQuery));
      } catch (_) {}
    }
    if (checkoutType === "valuation" && payload) {
      setBraintreePayload(payload);
    }
    if (
      (checkoutType === "auth" ||
        pageName === "bulk" ||
        pageName === "auth-cards" ||
        payload?.query_type === "auth") &&
      payload
    ) {
      const token = payload?.token ?? payload?.client_token;
      const encryptedPayload =
        payload?.encrypt_amount ??
        payload?.encrypted_amount ??
        payload?.encryptedAmount ??
        payload?.encrypted_order ??
        payload?.encrypted_data ??
        payload?.encrypted_payload;
      if (token) {
        setBraintreePayload({
          ...payload,
          token,
          query_type:
            payload?.query_type ??
            (pageName === "auth-cards" ? "auth-cards" : "auth"),
          encrypt_amount: encryptedPayload ?? payload?.encryptedAmount,
          encryptedAmount: encryptedPayload ?? payload?.encryptedAmount,
        });
      }
    }
  }, [
    checkoutType,
    location.state?.braintreePayload,
    location.state?.page,
    searchParams,
  ]);

  // Prefill valuation payer name when Braintree payload includes it (from Valuation page).
  useEffect(() => {
    if (checkoutType !== "valuation" || !braintreePayload) return;
    const fn = braintreePayload.first_name;
    const ln = braintreePayload.last_name;
    if (fn != null && String(fn).trim())
      setValue("firstName", String(fn).trim());
    if (ln != null && String(ln).trim())
      setValue("lastName", String(ln).trim());
  }, [checkoutType, braintreePayload, setValue]);

  // Subtotal: use cart total when we have cart items (so Checkout matches Cart); otherwise use pricing API tier
  const pricingTier =
    Array.isArray(cardPricing) && coaCount > 0
      ? cardPricing.find(
          (t) => Number(t.qty) === coaCount && Number(t.type) === 1,
        ) || cardPricing.find((t) => Number(t.qty) === coaCount)
      : null;
  const subtotalFromPricing =
    pricingTier != null ? Number(pricingTier.amount) || 0 : 0;
  const subtotalFromCart = cartItems.length
    ? cartItems.reduce(
        (sum, i) => sum + (Number(i.price) || 0) * (i.quantity || 1),
        0,
      )
    : 0;
  let subtotal =
    cartItems.length > 0
      ? subtotalFromCart
      : subtotalFromPricing || subtotalFromCart;

  // For authenticity cards checkout (page=auth-cards, no cart items), fall back to Braintree payload amount
  const pageNameForTotals = searchParams.get("page") || location.state?.page;
  if (
    !cartItems.length &&
    braintreePayload?.amount != null &&
    pageNameForTotals === "auth-cards"
  ) {
    subtotal = Number(braintreePayload.amount) || 0;
  }

  // Coupon API: action.payload.data is the new total AFTER discount (e.g. 17),
  // or 0 when the coupon makes the order free. Older flows may still send an object
  // with { discount } / { discount_amount } – support both.
  let discount = 0;
  let total = subtotal;
  if (typeof coupon === "number") {
    // coupon is the discounted total from backend
    const discountedTotal = Number(coupon);
    if (!Number.isNaN(discountedTotal)) {
      total = Math.max(0, discountedTotal);
      discount = Math.max(0, subtotal - total);
    }
  } else if (coupon && typeof coupon === "object") {
    discount = Number(coupon.discount ?? coupon.discount_amount ?? 0) || 0;
    total = Math.max(0, subtotal - discount);
  }

  // ad-old: auth checkout uses /ad/checkout-braintree (get token), then Braintree, then same endpoint with nonce
  const onSubmit = async (data) => {
    if (checkoutType === "valuation") return;
    if (!certificateIds?.length) {
      dispatch(
        setError(
          "No certificates to checkout. Please add items from the Authentication page.",
        ),
      );
      return;
    }
    try {
      const result = await dispatch(
        getAuthCheckoutBraintreeToken({
          first_name: data.firstName,
          last_name: data.lastName,
          email: "",
          phone: "",
          street_1: "",
          street_2: "",
          country: "",
          city: "",
          state: "",
          postal_code: "",
          query_ids: certificateIds,
          amount: total,
          coa_count: certificateIds.length,
          coupon_code: getValues("promoCode")?.trim() || undefined,
        }),
      ).unwrap();
      const payload = result?.data ?? result;
      const token = payload?.token ?? payload?.client_token;
      const encryptedPayload =
        payload?.encrypt_amount ??
        payload?.encrypted_amount ??
        payload?.encryptedAmount ??
        payload?.encrypted_order;
      if (token && (payload?.id != null || payload?.order_number)) {
        setBraintreePayload({
          ...payload,
          token,
          first_name: data.firstName,
          last_name: data.lastName,
          query_type: "auth",
          encrypt_amount: encryptedPayload,
          encryptedAmount: encryptedPayload,
        });
      } else {
        dispatch(clearCart());
        navigate("/");
      }
    } catch (err) {
      const msg =
        err?.message ||
        err?.data?.msg ||
        err?.data?.message ||
        (typeof err === "string" ? err : err?.msg) ||
        "Checkout failed. Please try again.";
      const isDecryptError = /payload is invalid|DecryptException/i.test(
        String(msg),
      );
      const friendlyMsg = isDecryptError
        ? 'Payment could not be prepared. Please start from the Authentication page, submit your item(s), and use "Proceed to checkout" from there.'
        : msg;
      console.error("Checkout failed:", msg);
      dispatch(setError(friendlyMsg));
    }
  };

  // Phase 1: Load Braintree script and create drop-in when backend returned a token
  useEffect(() => {
    if (!braintreePayload?.token) return;
    let instance = null;
    loadScript(BRAINTREE_SCRIPT)
      .then(() => {
        if (
          !window.braintree ||
          !document.getElementById("braintree-dropin-container")
        )
          return;
        window.braintree.dropin.create(
          {
            authorization: braintreePayload.token,
            container: "#braintree-dropin-container",
            card: { cardholderName: false },
            paypal: {
              flow: "vault",
            },
          },
          (err, inst) => {
            if (err) {
              console.error("Braintree error:", err);
              dispatch(
                setError(err?.message || "Payment form could not load."),
              );
              return;
            }
            instance = inst;
            setBraintreeInstance(inst);
            setBraintreeReady(true);
          },
        );
      })
      .catch((err) => {
        console.error("Braintree script failed:", err);
        dispatch(setError("Payment form could not load."));
      });
    return () => {
      if (instance && instance.clearSelectedPaymentMethod) {
        instance.clearSelectedPaymentMethod();
      }
    };
  }, [braintreePayload?.token]);

  const onBraintreeSubmit = async (e) => {
    e.preventDefault();
    clearErrors(["firstName", "lastName"]);
    setPaymentMethodError("");
    // Ensure customer name is filled before taking payment, even when payload came from a previous step
    const first = (getValues("firstName") || "").trim();
    const last = (getValues("lastName") || "").trim();
    let hasNameError = false;
    if (!first) {
      setError("firstName", {
        type: "required",
        message: "First name is required",
      });
      hasNameError = true;
    }
    if (!last) {
      setError("lastName", {
        type: "required",
        message: "Last name is required",
      });
      hasNameError = true;
    }
    if (hasNameError) {
      try {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (_e) {}
      return;
    }
    if (!braintreeInstance || !braintreePayload) return;
    // Check if a payment method (card/PayPal) has been entered/selected in the drop-in
    if (!braintreeInstance.isPaymentMethodRequestable()) {
      // Try to get more specific error from Braintree
      try {
        await braintreeInstance.requestPaymentMethod();
      } catch (methodErr) {
        const errText = String(
          methodErr?.message || methodErr || "",
        ).toLowerCase();
        if (
          /card|hosted fields|number|expiry|expiration|cvc|cvv/i.test(errText)
        ) {
          setPaymentMethodError(
            "Please enter full card details (number, expiry date, CVC)",
          );
          return;
        }
      }
      setPaymentMethodError("Please select a payment method to continue");
      return;
    }
    const encryptValue =
      braintreePayload.encrypt_amount ??
      braintreePayload.encryptedAmount ??
      braintreePayload.encrypted_amount ??
      braintreePayload.encrypted_order ??
      braintreePayload.encrypted_data ??
      braintreePayload.encrypted_payload;
    if (
      checkoutType !== "valuation" &&
      (encryptValue == null || encryptValue === "")
    ) {
      dispatch(
        setError(
          "Payment session expired. Please fill the form and click Complete Order again.",
        ),
      );
      return;
    }
    try {
      const { nonce } = await braintreeInstance.requestPaymentMethod();
      const amountValue =
        braintreePayload.amount ?? braintreePayload.payed_amount ?? 0;
      const body = {
        _token: braintreePayload.token,
        first_name: getValues("firstName") || braintreePayload.first_name,
        last_name: getValues("lastName") || braintreePayload.last_name,
        id: braintreePayload.id,
        query_type:
          braintreePayload.query_type ??
          (checkoutType === "valuation" ? "valuation" : undefined),
        payment_method_nonce: nonce,
        amount: amountValue,
        order_number: braintreePayload.order_number,
        queries_count: braintreePayload.queries_count ?? certificateIds?.length,
        encrypt_amount: encryptValue,
        ...(user?.id && { user_id: user.id }),
        ...(braintreePayload.coupon_code && {
          coupon_code: braintreePayload.coupon_code,
        }),
        ...(braintreePayload.email != null &&
          braintreePayload.email !== "" && { email: braintreePayload.email }),
        ...(braintreePayload.brand_name != null &&
          braintreePayload.brand_name !== "" && {
            brand_name: braintreePayload.brand_name,
          }),
        ...(checkoutType === "valuation" &&
          braintreePayload.user && { user: braintreePayload.user }),
        ...(checkoutType === "valuation" &&
          braintreePayload.name && { name: braintreePayload.name }),
        ...(checkoutType === "valuation" &&
          braintreePayload.payed_amount != null && {
            payed_amount: braintreePayload.payed_amount,
          }),
        ...(checkoutType !== "valuation" &&
          braintreePayload.payed_amount != null && {
            payed_amount: braintreePayload.payed_amount,
          }),
      };
      const safeBody = sanitizePaymentBody(body);
      if (checkoutType === "valuation") {
        const result = await dispatch(submitBraintreeValuation(safeBody)).unwrap();

        // Some backend environments require an explicit status sync for admin listing.
        const responseData =
          result?.data && typeof result.data === "object"
            ? result.data
            : result;
        const orderNumber =
          responseData?.order_number ??
          responseData?.orderNumber ??
          body?.order_number ??
          braintreePayload?.order_number;
        const transactionId =
          responseData?.transaction_id ??
          responseData?.transactionId ??
          responseData?.id ??
          responseData?.transaction?.id;

        if (orderNumber && transactionId) {
          try {
            await valuationCoaChangeStatus({
              order_number: orderNumber,
              transaction_id: transactionId,
              token: authToken,
            });
          } catch (statusErr) {
            // Payment succeeded; do not block UX on secondary sync failure.
            console.warn("Valuation status sync failed:", statusErr);
          }
        }

        const successMsg =
          result?.msg || "Your order has been submitted successfully!";
        setBraintreePayload(null);
        setBraintreeInstance(null);
        setPaymentSuccessMessage(successMsg);
        try {
          window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (_e) {}
        setTimeout(() => {
          navigate("/", { replace: true });
        }, 4000);
        return;
      }
      if (useAuthCheckout) {
        const result = await dispatch(submitBraintreeCheckout(safeBody)).unwrap();
        const successMsg =
          result?.msg || "Your order has been submitted successfully!";
        dispatch(clearCart());
        setBraintreePayload(null);
        setBraintreeInstance(null);
        setPaymentSuccessMessage(successMsg);
        try {
          window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (_e) {}
        setTimeout(() => {
          navigate("/", { replace: true });
        }, 4000);
      } else {
        const result = await dispatch(submitBraintreeAuthCards(safeBody)).unwrap();
        const successMsg =
          result?.msg || "Your order has been submitted successfully!";
        dispatch(clearCart());
        setBraintreePayload(null);
        setBraintreeInstance(null);
        setPaymentSuccessMessage(successMsg);
        try {
          window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (_e) {}
        setTimeout(() => {
          navigate("/", { replace: true });
        }, 4000);
      }
    } catch (err) {
      console.error("Braintree payment failed:", err);
      const errorText = [
        err?.message,
        err?.details?.originalError?.message,
        err?.details?.originalError,
        err?.details,
        err?.response?.data?.msg,
        err?.response?.data?.message,
      ]
        .map((v) => (v == null ? "" : String(v)))
        .join(" ");
      const message =
        err?.message ||
        err?.response?.data?.msg ||
        err?.response?.data?.message ||
        "Payment failed. Please try again.";

      // Check if error is about no payment method/card details being entered
      if (
        /no payment method|payment method.+required|requestpaymentmethod errored|card details|enter.+card|method nonce|hosted fields/i.test(
          errorText,
        )
      ) {
        setPaymentMethodError("Please select payment method");
        return;
      }

      dispatch(setError(message));
    }
  };

  const showBraintreeStep = braintreePayload?.token != null;
  const pageNameForMode = searchParams.get("page") || location.state?.page;
  const useAuthCheckout =
    (checkoutType === "auth" && pageNameForMode !== "auth-cards") ||
    (braintreePayload?.query_type === "auth" &&
      pageNameForMode !== "auth-cards");
  // ad-old: Checkout never calls "prepare" API; payload must come from Authentication/Cart. If missing, show message.
  const authCheckoutWithoutPayload =
    !braintreePayload && checkoutType !== "valuation";

  const handleApplyCoupon = async () => {
    const code = getValues("promoCode")?.trim();
    if (!code) return;
    dispatch(clearCoupon());
    await dispatch(verifyCoupon({ coupon_code: code, amount: subtotal }));
  };

  const formatExpirationDate = (e) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length >= 2) {
      val = val.slice(0, 2) + "/" + val.slice(2, 4);
    }
    e.target.value = val;
    setValue("expirationDate", val, { shouldValidate: true });
  };

  const expDateRegister = register("expirationDate", {
    required: "Expiration date is required",
    pattern: {
      value: /^(0[1-9]|1[0-2])\/\d{2}$/,
      message: "Format: MM/YY",
    },
  });

  const isValuationCheckout = checkoutType === "valuation" && showBraintreeStep;

  return (
    <div className="w-full min-h-screen bg-[#F5F5F0] py-8 sm:py-12 md:py-16">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="bg-white rounded-[22px] shadow-lg border border-gray-200 overflow-hidden"
          style={{ borderRadius: "22px" }}
        >
          <div className="p-6 sm:p-8 md:p-10 lg:p-12">
            {/* Header (hidden after successful payment so only success card shows) */}
            {!paymentSuccessMessage && (
              <>
                <div className="flex items-center gap-3 mb-6 sm:mb-8">
                  <button
                    onClick={() => navigate(-1)}
                    className="text-primary hover:text-primary-hover transition-colors bg-transparent border-0 outline-none p-0"
                    style={{ backgroundColor: "transparent" }}
                    aria-label="Go back"
                  >
                    <FiArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </button>
                  <h1 className="text-2xl sm:text-3xl font-bold text-primary">
                    Checkout
                  </h1>
                </div>
                <div className="border-t border-gray-200 mb-6 sm:mb-8"></div>
              </>
            )}

            {paymentSuccessMessage && (
              <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
                {paymentSuccessMessage}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
              {/* Left Section - Customer Information & Payment (hidden for valuation; ad-old: valuation pays on Checkout) */}
              <div className="lg:col-span-2">
                {authCheckoutWithoutPayload && !paymentSuccessMessage && (
                  <div className="p-6 rounded-lg bg-amber-50 border border-amber-200">
                    <p className="text-primary font-medium mb-2">
                      Payment could not be prepared.
                    </p>
                    <p className="text-sm text-gray-700 mb-4">
                      Please start from the Authentication page, submit your
                      item(s), and use &quot;Proceed to checkout&quot; from
                      there.
                    </p>
                    <button
                      type="button"
                      onClick={() => navigate("/authentication")}
                      className="px-4 py-2 rounded-lg bg-primary text-secondary font-medium hover:opacity-90"
                    >
                      Go to Authentication
                    </button>
                  </div>
                )}

                {isValuationCheckout && (
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-primary mb-4">
                      Valuation – Complete payment
                    </h2>
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-primary mb-3 sm:mb-4">
                        Customer information
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <input
                            type="text"
                            placeholder="First Name"
                            autoComplete="given-name"
                            {...register("firstName", {
                              required: "First name is required",
                            })}
                            className={`w-full px-4 py-3 rounded-lg border ${
                              errors.firstName
                                ? "border-red-500"
                                : "border-gray-300"
                            } focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-primary placeholder:text-gray-400 bg-[#EBEBE4]`}
                          />
                          {errors.firstName && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.firstName.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <input
                            type="text"
                            placeholder="Last Name"
                            autoComplete="family-name"
                            {...register("lastName", {
                              required: "Last name is required",
                            })}
                            className={`w-full px-4 py-3 rounded-lg border ${
                              errors.lastName
                                ? "border-red-500"
                                : "border-gray-300"
                            } focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-primary placeholder:text-gray-400 bg-[#EBEBE4]`}
                          />
                          {errors.lastName && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.lastName.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Choose a way to pay
                    </p>
                    {paymentMethodError && (
                      <p className="text-red-500 text-sm mb-3 p-3 rounded-lg">
                        {paymentMethodError}
                      </p>
                    )}
                    <div
                      id="braintree-dropin-container"
                      ref={braintreeContainerRef}
                    />
                    {errors.paymentMethodNonce && (
                      <p className="text-red-500 text-sm mt-2">
                        {errors.paymentMethodNonce.message}
                      </p>
                    )}
                  </div>
                )}
                {!isValuationCheckout && !authCheckoutWithoutPayload && (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    {/* Customer Information */}
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-primary mb-4 sm:mb-6">
                        Customer information
                      </h2>

                      {/* First Name and Last Name only */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <input
                            type="text"
                            placeholder="First Name"
                            {...register("firstName", {
                              required: "First name is required",
                            })}
                            className={`w-full px-4 py-3 rounded-lg border ${
                              errors.firstName
                                ? "border-red-500"
                                : "border-gray-300"
                            } focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-primary placeholder:text-gray-400 bg-[#EBEBE4]`}
                          />
                          {errors.firstName && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.firstName.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <input
                            type="text"
                            placeholder="Last Name"
                            {...register("lastName", {
                              required: "Last name is required",
                            })}
                            className={`w-full px-4 py-3 rounded-lg border ${
                              errors.lastName
                                ? "border-red-500"
                                : "border-gray-300"
                            } focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-primary placeholder:text-gray-400 bg-[#EBEBE4]`}
                          />
                          {errors.lastName && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.lastName.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Payment method (hidden when Braintree drop-in is shown – use "Complete payment" for card/PayPal) */}
                    {!showBraintreeStep && (
                      <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-primary mb-4 sm:mb-6">
                          Payment method
                        </h2>

                        <div
                          className="mb-6 border rounded-lg overflow-hidden"
                          style={{ borderWidth: "1px", borderColor: "#ADADAD" }}
                        >
                          <label className="flex items-center gap-3 cursor-pointer p-4 bg-white">
                            <input
                              type="radio"
                              {...register("paymentMethod", {
                                required: "Payment method is required",
                              })}
                              value="card"
                              defaultChecked
                              className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                            />
                            <span className="text-base sm:text-lg text-primary font-medium">
                              Pay with Debit/ Credit Card
                            </span>
                          </label>

                          {/* Card Details */}
                          <div className="bg-[#EDEAE5] rounded-lg p-4 space-y-4">
                            {/* Card Number */}
                            <div className="relative">
                              <input
                                type="text"
                                placeholder="Card number"
                                {...register("cardNumber", {
                                  required: "Card number is required",
                                  pattern: {
                                    value: /^[0-9\s]{13,19}$/,
                                    message: "Invalid card number",
                                  },
                                })}
                                className={`w-full px-4 py-3 pr-12 rounded-lg border ${
                                  errors.cardNumber
                                    ? "border-red-500"
                                    : "border-gray-300"
                                } focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-primary placeholder:text-gray-400 bg-white`}
                              />
                              <FiCreditCard className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary" />
                              {errors.cardNumber && (
                                <p className="text-red-500 text-sm mt-1">
                                  {errors.cardNumber.message}
                                </p>
                              )}
                            </div>

                            {/* Expiration Date and CVC */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <input
                                  type="text"
                                  placeholder="Expiration date (MM/YY)"
                                  maxLength={5}
                                  {...expDateRegister}
                                  onChange={(e) => {
                                    formatExpirationDate(e);
                                    expDateRegister.onChange(e);
                                  }}
                                  className={`w-full px-4 py-3 rounded-lg border ${
                                    errors.expirationDate
                                      ? "border-red-500"
                                      : "border-gray-300"
                                  } focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-primary placeholder:text-gray-400 bg-white`}
                                />
                                {errors.expirationDate && (
                                  <p className="text-red-500 text-sm mt-1">
                                    {errors.expirationDate.message}
                                  </p>
                                )}
                              </div>
                              <div>
                                <input
                                  type="text"
                                  placeholder="CVC"
                                  {...register("cvc", {
                                    required: "CVC is required",
                                    pattern: {
                                      value: /^[0-9]{3,4}$/,
                                      message: "Invalid CVC",
                                    },
                                  })}
                                  className={`w-full px-4 py-3 rounded-lg border ${
                                    errors.cvc
                                      ? "border-red-500"
                                      : "border-gray-300"
                                  } focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-primary placeholder:text-gray-400 bg-white`}
                                />
                                {errors.cvc && (
                                  <p className="text-red-500 text-sm mt-1">
                                    {errors.cvc.message}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {showBraintreeStep && (
                      <div className="mt-6">
                        <h2 className="text-xl sm:text-2xl font-bold text-primary mb-4">
                          Complete payment
                        </h2>
                        {paymentMethodError && (
                          <p className="text-red-500 text-sm mb-3 p-3 rounded-lg">
                            {paymentMethodError}
                          </p>
                        )}
                        <div
                          id="braintree-dropin-container"
                          ref={braintreeContainerRef}
                        />
                      </div>
                    )}
                  </form>
                )}
              </div>

              {/* Right Section - Order Summary */}
              <div className="lg:col-span-1">
                {!paymentSuccessMessage && (
                  <div className="bg-[#EDEAE5] rounded-lg p-6 sm:p-8 h-fit sticky top-4">
                    {/* Order Summary */}
                    <div
                      className={`mb-6 flex flex-col ${isValuationCheckout ? "" : "min-h-[400px]"}`}
                    >
                      {!isValuationCheckout && (
                        <>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm sm:text-base font-semibold text-[#767676]">
                              SUBTOTAL
                            </span>
                          </div>
                          {cartItems.length > 0 ? (
                            cartItems.map((item, idx) => {
                              const lineTotal =
                                (Number(item.price) || 0) *
                                (item.quantity || 1);
                              const label =
                                item.brand ?? item.model ?? `Item ${idx + 1}`;
                              return (
                                <div key={item.id ?? idx} className="mb-2">
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm sm:text-base text-black">
                                      {label}
                                    </span>
                                    <span className="text-sm sm:text-base font-semibold text-black">
                                      ${lineTotal.toFixed(2)}
                                    </span>
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <div className="mb-2">
                              <div className="flex justify-between items-center">
                                <span className="text-sm sm:text-base text-black">
                                  Order
                                </span>
                                <span className="text-sm sm:text-base font-semibold text-black">
                                  ${subtotal.toFixed(2)}
                                </span>
                              </div>
                            </div>
                          )}
                          {discount > 0 && (
                            <div className="flex justify-between items-center mb-2 text-green-600">
                              <span className="text-sm font-medium">
                                Discount applied
                              </span>
                              <span className="text-sm font-semibold">
                                -${discount.toFixed(2)}
                              </span>
                            </div>
                          )}
                          <div className="border-t border-gray-400 my-2"></div>
                        </>
                      )}
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-base sm:text-lg font-bold text-black">
                          TOTAL
                        </span>
                        <span className="text-base sm:text-lg font-bold text-black">
                          $
                          {(isValuationCheckout
                            ? (braintreePayload?.amount ?? 0)
                            : total
                          ).toFixed(2)}
                        </span>
                      </div>

                      {/* Promo Code */}
                      <div className="mb-0 -mx-4 sm:-mx-6 md:-mx-8 px-4">
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Promo code"
                            {...register("promoCode")}
                            onFocus={() => dispatch(clearCoupon())}
                            className={`w-full px-2.5 py-2.5 pr-16 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-primary placeholder:text-gray-400 bg-white ${
                              couponError ? "border-red-500" : "border-gray-300"
                            }`}
                          />
                          <button
                            type="button"
                            onClick={handleApplyCoupon}
                            disabled={couponStatus === "loading"}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 px-2 py-1 text-black font-semibold text-sm hover:text-primary-hover transition-colors bg-transparent border-0 outline-none disabled:opacity-60 disabled:cursor-not-allowed"
                            style={{ backgroundColor: "transparent" }}
                          >
                            {couponStatus === "loading"
                              ? "Applying..."
                              : "Apply"}
                          </button>
                        </div>
                        {couponError && (
                          <p className="text-red-500 text-sm mt-1">
                            {couponError}
                          </p>
                        )}
                      </div>
                    </div>

                    {checkoutStatus === "failed" && checkoutError && (
                      <p className="text-red-500 text-sm mb-2">
                        {checkoutError}
                      </p>
                    )}
                    {/* Complete Order Button (hidden when Braintree step is shown or when no payload – ad-old: no prepare on Checkout) */}
                    {!showBraintreeStep && !authCheckoutWithoutPayload && (
                      <button
                        type="submit"
                        onClick={handleSubmit(onSubmit)}
                        disabled={checkoutStatus === "loading"}
                        className="w-full bg-primary text-secondary py-2 sm:py-2 rounded-lg font-semibold text-base sm:text-lg hover:bg-primary-hover transition-colors shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {checkoutStatus === "loading"
                          ? "Processing..."
                          : "Complete Order"}
                      </button>
                    )}
                    {/* Braintree step: drop-in container (in left column) and Pay button when token is ready */}
                    {showBraintreeStep && (
                      <div className="mt-4">
                        <button
                          type="button"
                          onClick={onBraintreeSubmit}
                          disabled={
                            !braintreeReady || checkoutStatus === "loading"
                          }
                          className="w-full bg-primary text-secondary py-2 sm:py-2 rounded-lg font-semibold text-base sm:text-lg hover:bg-primary-hover transition-colors shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          {checkoutStatus === "loading"
                            ? "Processing..."
                            : "Confirm & pay"}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
