import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FiArrowLeft, FiCreditCard, FiLoader } from "react-icons/fi";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  verifyCoupon,
  clearCoupon,
  getAuthCheckoutBraintreeToken,
  setError as setCheckoutError,
  getAuthenticityCardPricing,
  submitBraintreeAuthCards,
  submitBraintreeCheckout,
  submitBraintreeValuation,
} from "../../store/slices/checkoutSlice";
import { clearCart } from "../../store/slices/cartSlice";
import {
  freeProcessPaypalOrder,
  freeSubmitBulk,
} from "../../store/slices/authenticationRequestSlice";
import { valuationCoaChangeStatus } from "../../services/forumService";
import { getUserQueries } from "../../services/profileServices";

const BRAINTREE_SCRIPT =
  "https://js.braintreegateway.com/web/dropin/1.36.0/js/dropin.min.js";
const CARD_DETAILS_ERROR =
  "Please enter full card details (number, expiry date, CVC)";
const PAYMENT_METHOD_NOT_SELECTED_ERROR = "Method of payment not selected";

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

const getPaymentMethodErrorMessage = (errorLike) => {
  const errorText = [
    errorLike?.message,
    errorLike?.code,
    errorLike?.name,
    errorLike?.details?.originalError?.message,
    errorLike?.details?.originalError?.code,
    errorLike?.details?.originalError,
    errorLike?.details,
  ]
    .map((value) => (value == null ? "" : String(value)))
    .join(" ")
    .toLowerCase();

  if (
    /hosted_fields|hosted fields|fields_invalid|field is invalid|fields are invalid|number is invalid|expiration|expiry|cvc|cvv|card number|card details|enter.+card|empty fields|fields_empty/i.test(
      errorText,
    )
  ) {
    return CARD_DETAILS_ERROR;
  }

  if (
    /no payment method|payment method.+required|method nonce|requestpaymentmethod errored|payment option|payment method not selected|select.+payment/i.test(
      errorText,
    )
  ) {
    return PAYMENT_METHOD_NOT_SELECTED_ERROR;
  }

  return "";
};

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [braintreePayload, setBraintreePayload] = useState(null);
  const [braintreeInstance, setBraintreeInstance] = useState(null);
  const [braintreeReady, setBraintreeReady] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");
  const [paymentMethodError, setPaymentMethodError] = useState("");
  // Tracks the payment option the user has picked inside the Braintree
  // drop-in ("card", "paypal", etc.). Driven by drop-in events so we don't
  // have to guess from the DOM.
  const [selectedPaymentOption, setSelectedPaymentOption] = useState("");
  const [paymentMethodRequestable, setPaymentMethodRequestable] =
    useState(false);
  const [isPreparingCheckout, setIsPreparingCheckout] = useState(false);
  const [isPaymentSubmitting, setIsPaymentSubmitting] = useState(false);
  const prepareCheckoutLockRef = useRef(false);
  const paymentSubmitLockRef = useRef(false);
  const successRedirectTimeoutRef = useRef(null);
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
    setError: setFormError,
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

    dispatch(clearCoupon());
    return () => {
      dispatch(clearCoupon());
      if (successRedirectTimeoutRef.current) {
        clearTimeout(successRedirectTimeoutRef.current);
      }
    };
  }, [location.pathname, reset, dispatch]);

  const showToastMsg = (msg, variant = "success", duration = 3000) => {
    if (!msg) return;
    setToastVariant(variant);
    setToastMessage(String(msg));
    window.setTimeout(() => {
      setToastMessage("");
    }, duration);
  };

  const acquirePaymentSubmitLock = () => {
    if (paymentSubmitLockRef.current) return false;
    paymentSubmitLockRef.current = true;
    setIsPaymentSubmitting(true);
    return true;
  };

  const releasePaymentSubmitLock = () => {
    paymentSubmitLockRef.current = false;
    setIsPaymentSubmitting(false);
  };

  const acquirePrepareCheckoutLock = () => {
    if (prepareCheckoutLockRef.current) return false;
    prepareCheckoutLockRef.current = true;
    setIsPreparingCheckout(true);
    return true;
  };

  const releasePrepareCheckoutLock = () => {
    prepareCheckoutLockRef.current = false;
    setIsPreparingCheckout(false);
  };

  const navigateToQueryChat = async (result, savedCartItems) => {
    const expedited =
      isExpedited || savedCartItems?.some((item) => item.is_expedited);
    if (!expedited) {
      navigate("/", { replace: true });
      return;
    }

    const responseData = result?.data ?? result ?? {};
    const numericId = responseData?.id ?? braintreePayload?.id;

    // Fetch the freshly-created query so we get the backend-assigned
    // order_number and firebase_chat_id (same approach as profile page).
    let queryData = null;
    if (numericId) {
      try {
        const token = authToken || localStorage.getItem("authToken");
        const queriesRes = await getUserQueries({ token, type: 0, all: 1 });
        const queries = queriesRes?.data ?? [];
        queryData = queries.find((q) => Number(q.id) === Number(numericId));
      } catch (err) {
        console.warn("[navigateToQueryChat] get-user-queries failed:", err);
      }
    }

    const orderId = String(
      queryData?.order_number ??
      responseData?.order_number ??
      braintreePayload?.order_number ??
      responseData?.order_id ??
      responseData?.id ??
      braintreePayload?.id ??
      "",
    );
    const chatId = String(
      queryData?.firebase_chat_id ??
      responseData?.firebase_chat_id ??
      braintreePayload?.firebase_chat_id ??
      "",
    ).trim();

    const firstPath = savedCartItems?.[0]?.imagePaths;
    const rawImage = Array.isArray(firstPath)
      ? firstPath[0]
      : typeof firstPath === "string"
        ? firstPath
        : "";
    const imageUuid = (rawImage || "")
      .replace(/^authenticateImage\//, "")
      .replace(/^\/+/, "");

    const params = new URLSearchParams();
    if (orderId) params.set("orderId", orderId);
    params.set("deferProvision", "1");
    if (chatId) params.set("room", chatId);
    if (imageUuid) params.set("image", imageUuid);
    navigate(`/expedited-chat?${params.toString()}`, { replace: true });
  };

  /** Required for paid (Braintree) and $0 coupon checkout; sets field errors + toast if missing. */
  const validateCheckoutCustomerNames = () => {
    clearErrors(["firstName", "lastName"]);
    const first = (getValues("firstName") || "").trim();
    const last = (getValues("lastName") || "").trim();
    let valid = true;
    if (!first) {
      setFormError("firstName", {
        type: "required",
        message: "First name is required",
      });
      valid = false;
    }
    if (!last) {
      setFormError("lastName", {
        type: "required",
        message: "Last name is required",
      });
      valid = false;
    }
    if (!valid) {
      window.scrollTo?.({ top: 0, behavior: "smooth" });
    }
    return valid;
  };

  const rawIds =
    location.state?.certificateIds ??
    cartItems.map((i) => i.id ?? i.coa_number).filter(Boolean);
  const certificateIds = [...new Set(
    rawIds
    .map((id) =>
      id != null && typeof id === "object"
        ? (id.id ?? id.query_id ?? id.certificate_id ?? id.coa_number)
        : id,
    )
    .filter((id) => id != null && id !== ""),
  )];
  const checkoutType = location.state?.checkoutType;
  const isExpedited =
    location.state?.is_expedited ?? braintreePayload?.is_expedited ?? false;

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

  // When a coupon reduces the payable total to $0 the card / Braintree UI is
  // unnecessary — the order can be submitted as a free order.
  const isFreeAfterCoupon = couponStatus === "succeeded" && total === 0;

  // ad-old: auth checkout uses /ad/checkout-braintree (get token), then Braintree, then same endpoint with nonce
  const onSubmit = async (data) => {
    if (checkoutType === "valuation") return;
    // Guard: once Braintree token is present, we are already in payment step.
    // Ignore any accidental form submit events (Enter key / bubbling).
    if (braintreePayload?.token) return;
    if (!acquirePrepareCheckoutLock()) {
      showToastMsg("Payment already processing. Please wait...", "error", 1800);
      return;
    }
    if (!certificateIds?.length) {
      dispatch(
        setCheckoutError(
          "No certificates to checkout. Please add items from the Authentication page.",
        ),
      );
      releasePrepareCheckoutLock();
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
          coupon_code: getValues("promoCode")?.trim() || null,
          is_expedited: isExpedited,
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
      dispatch(setCheckoutError(friendlyMsg));
    } finally {
      releasePrepareCheckoutLock();
    }
  };

  const resolvePaymentMethodError = (errorLike) => {
    // If the user already has a payment method ready (card filled in, or
    // a vaulted method), Braintree's drop-in handles inline field
    // validation itself — no need for our own banner.
    if (paymentMethodRequestable) {
      const parsedError = getPaymentMethodErrorMessage(errorLike);
      if (parsedError === CARD_DETAILS_ERROR) return "";
      return parsedError || "";
    }

    // User hasn't picked any option at all.
    if (!selectedPaymentOption) {
      return PAYMENT_METHOD_NOT_SELECTED_ERROR;
    }

    // An option is selected but something is wrong. Braintree's drop-in
    // already shows inline validation on card fields, so we only surface
    // our own banner for non-card methods.
    if (selectedPaymentOption === "card") {
      return "";
    }

    const parsedError = getPaymentMethodErrorMessage(errorLike);
    if (parsedError === CARD_DETAILS_ERROR) return "";
    return parsedError || "";
  };

  const setSafePaymentMethodError = (message) => {
    setPaymentMethodError(String(message || ""));
  };

  // Keep the error message in sync with drop-in state: the moment a payment
  // method becomes usable (valid card entered, PayPal connected, vaulted
  // method chosen), any stale "not selected / fill card details" error is
  // cleared without needing a click.
  useEffect(() => {
    if (paymentMethodRequestable && paymentMethodError) {
      setPaymentMethodError("");
    }
  }, [paymentMethodRequestable, paymentMethodError]);

  useEffect(() => {
    if (
      selectedPaymentOption &&
      paymentMethodError === PAYMENT_METHOD_NOT_SELECTED_ERROR
    ) {
      setPaymentMethodError("");
    }
  }, [selectedPaymentOption, paymentMethodError]);

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
                setCheckoutError(err?.message || "Payment form could not load."),
              );
              return;
            }
            instance = inst;
            setBraintreeInstance(inst);
            setBraintreeReady(true);

            // If the drop-in already has a requestable method on init (e.g.
            // a vaulted payment method for a logged-in user), reflect it.
            try {
              const alreadyRequestable =
                typeof inst.isPaymentMethodRequestable === "function" &&
                inst.isPaymentMethodRequestable();
              setPaymentMethodRequestable(!!alreadyRequestable);
              if (alreadyRequestable) {
                const active =
                  typeof inst.getActivePaymentMethod === "function"
                    ? inst.getActivePaymentMethod()
                    : null;
                const type = String(active?.type || "").toLowerCase();
                if (type.includes("paypal")) setSelectedPaymentOption("paypal");
                else if (type) setSelectedPaymentOption("card");
              }
            } catch (_e) {}

            // Keep selection / requestable state in sync via drop-in events.
            try {
              inst.on("paymentOptionSelected", (payload) => {
                const option = String(
                  payload?.paymentOption || "",
                ).toLowerCase();
                if (option) setSelectedPaymentOption(option);
                setPaymentMethodError("");
              });
              inst.on("paymentMethodRequestable", (payload) => {
                setPaymentMethodRequestable(true);
                const type = String(payload?.type || "").toLowerCase();
                if (type.includes("paypal")) setSelectedPaymentOption("paypal");
                else if (type) setSelectedPaymentOption("card");
                setPaymentMethodError("");
              });
              inst.on("noPaymentMethodRequestable", () => {
                setPaymentMethodRequestable(false);
              });
            } catch (_e) {
              // Event API not available – ignore; submit-time checks still apply.
            }
          },
        );
      })
      .catch((err) => {
        console.error("Braintree script failed:", err);
        dispatch(setCheckoutError("Payment form could not load."));
      });
    return () => {
      if (instance && instance.clearSelectedPaymentMethod) {
        instance.clearSelectedPaymentMethod();
      }
      setSelectedPaymentOption("");
      setPaymentMethodRequestable(false);
    };
  }, [braintreePayload?.token]);

  const onBraintreeSubmit = async (e) => {
    e.preventDefault();
    setSafePaymentMethodError("");
    if (!validateCheckoutCustomerNames()) return;

    if (!braintreeInstance || !braintreePayload) return;
    if (!acquirePaymentSubmitLock()) {
      showToastMsg("Payment already processing. Please wait...", "error", 1800);
      return;
    }
    let shouldReleaseSubmitLock = true;

    try {
      if (!braintreeInstance.isPaymentMethodRequestable()) {
        // Prefer the state set by drop-in events; fall back to a fresh
        // `getActivePaymentMethod` probe in case events haven't fired yet.
        let currentOption = selectedPaymentOption;
        if (!currentOption) {
          try {
            const active =
              typeof braintreeInstance.getActivePaymentMethod === "function"
                ? braintreeInstance.getActivePaymentMethod()
                : null;
            const type = String(active?.type || "").toLowerCase();
            if (type.includes("paypal")) currentOption = "paypal";
            else if (type) currentOption = "card";
          } catch (_e) {}
        }

        if (!currentOption) {
          setSafePaymentMethodError(PAYMENT_METHOD_NOT_SELECTED_ERROR);
          return;
        }

        // An option is selected (e.g. card) but the form is incomplete.
        // Calling requestPaymentMethod() triggers Braintree's own inline
        // field validation (red highlights on empty/invalid card fields).
        try {
          await braintreeInstance.requestPaymentMethod();
        } catch (methodErr) {
          const resolved = resolvePaymentMethodError(methodErr);
          if (resolved) setSafePaymentMethodError(resolved);
          return;
        }
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
          setCheckoutError(
            "Payment session expired. Please fill the form and click Complete Order again.",
          ),
        );
        return;
      }
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
        coupon_code:
          (braintreePayload.coupon_code ?? getValues("promoCode")?.trim()) ||
          null,
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
        is_expedited: isExpedited,
      };
      const safeBody = sanitizePaymentBody(body);
      if (checkoutType === "valuation") {
        const result = await dispatch(
          submitBraintreeValuation(safeBody),
        ).unwrap();

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
        showToastMsg(successMsg, "success", 3000);
        successRedirectTimeoutRef.current = setTimeout(() => {
          navigate("/", { replace: true });
        }, 1200);
        shouldReleaseSubmitLock = false;
        return;
      }
      if (useAuthCheckout) {
        const result = await dispatch(
          submitBraintreeCheckout(safeBody),
        ).unwrap();
        const successMsg =
          result?.msg || "Your order has been submitted successfully!";
        const savedCartItems = [...cartItems];
        dispatch(clearCart());
        showToastMsg(successMsg, "success", 3000);
        successRedirectTimeoutRef.current = setTimeout(() => {
          navigateToQueryChat(result, savedCartItems);
        }, 1200);
        shouldReleaseSubmitLock = false;
      } else {
        const result = await dispatch(
          submitBraintreeAuthCards(safeBody),
        ).unwrap();
        const successMsg =
          result?.msg || "Your order has been submitted successfully!";
        dispatch(clearCart());
        showToastMsg(successMsg, "success", 3000);
        successRedirectTimeoutRef.current = setTimeout(() => {
          navigate("/", { replace: true });
        }, 1200);
        shouldReleaseSubmitLock = false;
      }
    } catch (err) {
      console.error("Braintree payment failed:", err);
      const message =
        err?.message ||
        err?.response?.data?.msg ||
        err?.response?.data?.message ||
        "Payment failed. Please try again.";

      const paymentError = getPaymentMethodErrorMessage(err);
      if (paymentError) {
        const resolved = resolvePaymentMethodError(err);
        if (resolved) setSafePaymentMethodError(resolved);
        return;
      }

      dispatch(setCheckoutError(message));
    } finally {
      if (shouldReleaseSubmitLock) releasePaymentSubmitLock();
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
    const userEmail =
      user?.email?.trim() ||
      user?.user_email?.trim() ||
      getValues("email")?.trim() ||
      "";
    await dispatch(
      verifyCoupon({ coupon_code: code, amount: subtotal, email: userEmail }),
    );
  };

  // Called when coupon reduces total to $0 — uses /ad/free-process-paypal (single)
  // or /ad/free-submit (bulk) instead of going through Braintree.
  const handleFreeCheckout = async () => {
    if (!cartItems.length) return;
    if (!validateCheckoutCustomerNames()) return;
    if (!acquirePaymentSubmitLock()) {
      showToastMsg("Payment already processing. Please wait...", "error", 1800);
      return;
    }
    let shouldReleaseSubmitLock = true;
    const couponCode = getValues("promoCode")?.trim() || null;
    const savedCartItems = [...cartItems];

    try {
      let freeResult = null;
      if (cartItems.length === 1) {
        const item = cartItems[0];
        const itemEmail =
          item.email?.trim() ||
          user?.email?.trim() ||
          user?.user_email?.trim() ||
          "";
        const brandIdNum = Number(item.brand_id) || item.brand_id;
        const firstNameVal = (getValues("firstName") || "").trim();
        const lastNameVal = (getValues("lastName") || "").trim();
        const payload = {
          brand_name: brandIdNum,
          category_id: item.category_id,
          model: item.model ?? "",
          description: item.description ?? "",
          sku: item.sku ?? "",
          email: itemEmail,
          emailc: itemEmail,
          user_email: itemEmail,
          first_name: firstNameVal,
          last_name: lastNameVal,
          valuation: item.valuation ?? 0,
          uploadedImages: Array.isArray(item.imagePaths)
            ? item.imagePaths.join(",")
            : (item.imagePaths ?? ""),
          terms_and_condition_privacy_policy: true,
          amount: 0,
          query_amount: item.price ?? subtotal,
          queries_count: 0,
          is_user_paid: 0,
          add_on: item.add_on ?? 0,
          coupon_code: couponCode,
          is_expedited: item.is_expedited || isExpedited || false,
        };
        freeResult = await dispatch(
          freeProcessPaypalOrder({
            singleFormData: payload,
            is_expedited: item.is_expedited || isExpedited || false,
          }),
        ).unwrap();
      } else {
        // Multiple items — use existing free bulk endpoint
        const firstItem = cartItems[0];
        const bulkEmail =
          firstItem.email?.trim() ||
          user?.email?.trim() ||
          user?.user_email?.trim() ||
          "";
        const queries = cartItems.map((item) => {
          const qBrandId = Number(item.brand_id) || item.brand_id;
          const itemEmail =
            item.email?.trim() || user?.email?.trim() || "";
          return {
            uploadedImages: Array.isArray(item.imagePaths)
              ? item.imagePaths.join(",")
              : (item.imagePaths ?? ""),
            brand_id: qBrandId,
            brand_name: qBrandId,
            selectCategory: item.category_id,
            category: item.category_id,
            email: itemEmail,
            user_email: itemEmail,
            model: item.model ?? "",
            sku: item.sku ?? "",
            description: item.description ?? "",
            valuation: item.valuation ?? 0,
            ip: "",
            query_amount: item.price ?? 0,
            is_user_paid: 0,
            paid_amount: 0,
            is_subscription: 0,
            add_on: item.add_on ?? 0,
          };
        });
        freeResult = await dispatch(
          freeSubmitBulk({
            user_email: bulkEmail,
            total_price: 0,
            queries_count: cartItems.length,
            total_queries_count: cartItems.length,
            queries,
            coupon_code: couponCode,
          }),
        ).unwrap();
      }

      dispatch(clearCart());
      showToastMsg("Your order has been submitted successfully!", "success", 3000);
      successRedirectTimeoutRef.current = setTimeout(() => {
        navigateToQueryChat(freeResult, savedCartItems);
      }, 1200);
      shouldReleaseSubmitLock = false;
    } catch (err) {
      console.error("Free checkout failed:", err);
      const message =
        err?.message ||
        err?.response?.data?.msg ||
        err?.response?.data?.message ||
        "Order submission failed. Please try again.";
      dispatch(setCheckoutError(message));
    } finally {
      if (shouldReleaseSubmitLock) releasePaymentSubmitLock();
    }
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
  const isCheckoutProcessing =
    checkoutStatus === "loading" || isPaymentSubmitting || isPreparingCheckout;
  const isConfirmPayProcessing =
    checkoutStatus === "loading" || isPaymentSubmitting;

  return (
    <div className="w-full min-h-screen bg-[#F5F5F0] py-8 sm:py-12 md:py-16">
      {toastMessage && (
        <div
          className={`fixed top-4 right-4 z-[140] max-w-sm rounded-lg border px-4 py-3 text-sm shadow-lg ${
            toastVariant === "success"
              ? "border-green-200 bg-green-50 text-green-800"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
          role="alert"
        >
          <p className="font-medium">{toastMessage}</p>
        </div>
      )}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="bg-white rounded-[22px] shadow-lg border border-gray-200 overflow-hidden"
          style={{ borderRadius: "22px" }}
        >
          <div className="p-6 sm:p-8 md:p-10 lg:p-12">
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
              {/* Left Section - Customer Information & Payment (hidden for valuation; ad-old: valuation pays on Checkout) */}
              <div className="lg:col-span-2">
                {authCheckoutWithoutPayload && (
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
                    {!isFreeAfterCoupon && (
                      <>
                        {paymentMethodError && (
                          <p className="text-red-500 text-sm mb-3 p-3 rounded-lg">
                            {paymentMethodError}
                          </p>
                        )}
                        <div
                          id="braintree-dropin-container"
                          ref={braintreeContainerRef}
                        />
                      </>
                    )}
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

                    {/* Payment method (hidden when Braintree drop-in is shown, or when coupon makes total $0) */}
                    {!showBraintreeStep && !isFreeAfterCoupon && (
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
                    {showBraintreeStep && !isFreeAfterCoupon && (
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
                              (Number(item.price) || 0) * (item.quantity || 1);
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
                      {couponStatus === "succeeded" ? (
                        <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-green-400 bg-green-50">
                          <span className="text-sm font-medium text-green-700">
                            Coupon applied!
                          </span>
                        </div>
                      ) : (
                        <>
                          <div className="relative">
                            <input
                              type="text"
                              placeholder="Promo code"
                              {...register("promoCode")}
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
                              {couponStatus === "loading" ? "Applying..." : "Apply"}
                            </button>
                          </div>
                          {couponError && (
                            <p className="text-red-500 text-sm mt-1">
                              {couponError}
                            </p>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {checkoutStatus === "failed" && checkoutError && (
                    <p className="text-red-500 text-sm mb-2">{checkoutError}</p>
                  )}
                  {/* Complete Order Button (hidden when Braintree step is shown or when no payload – ad-old: no prepare on Checkout) */}
                  {!showBraintreeStep && !authCheckoutWithoutPayload && (
                    <button
                      type={isFreeAfterCoupon ? "button" : "submit"}
                      onClick={isFreeAfterCoupon ? handleFreeCheckout : undefined}
                      disabled={
                        isCheckoutProcessing
                      }
                      className="w-full bg-primary text-secondary py-2 sm:py-2 rounded-lg font-semibold text-base sm:text-lg hover:bg-primary-hover transition-colors shadow-md disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                    >
                      Complete Order
                    </button>
                  )}
                  {/* Braintree step: Pay button (drop-in hidden when free after coupon) */}
                  {showBraintreeStep && (
                    <div className="mt-4">
                      <button
                        type="button"
                        onClick={
                          isFreeAfterCoupon ? handleFreeCheckout : onBraintreeSubmit
                        }
                        disabled={
                          (!isFreeAfterCoupon && !braintreeReady) ||
                          isConfirmPayProcessing
                        }
                        className="w-full bg-primary text-secondary py-2 sm:py-2 rounded-lg font-semibold text-base sm:text-lg hover:bg-primary-hover transition-colors shadow-md disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                      >
                        {isFreeAfterCoupon ? "Complete Order" : "Confirm & pay"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isCheckoutProcessing && (
        <div className="fixed inset-0 z-[120] bg-black/35 backdrop-blur-[1px] flex items-center justify-center px-4">
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 px-6 py-5 flex items-center gap-3">
            <FiLoader className="w-6 h-6 text-primary animate-spin" />
            <p className="text-primary font-semibold text-sm sm:text-base">
              Processing payment...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
