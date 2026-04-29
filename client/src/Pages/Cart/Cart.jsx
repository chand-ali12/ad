import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  removeItem,
  updateQuantity,
  clearCart,
  updateItem,
} from "../../store/slices/cartSlice";
import {
  processPaypalPayment,
  freeSubmitBulk,
  bundleQueryFormSubmitBulk,
} from "../../store/slices/authenticationRequestSlice";
import CartItem from "../../components/client/CartItem/CartItem";

const Cart = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const {
    items: cartItems = [],
    subtotal = 0,
    total = 0,
  } = useAppSelector((state) => state.cart) ?? {};
  const { user: authUser } = useAppSelector((state) => state.auth);
  const userEmail = authUser?.email ?? authUser?.user_email ?? "";
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [orderSuccessMessage, setOrderSuccessMessage] = useState(null);

  const resolveCheckoutEmail = (item) => {
    const fromItem = item?.email != null ? String(item.email).trim() : "";
    const fromUser = userEmail != null ? String(userEmail).trim() : "";
    return fromItem || fromUser;
  };

  // Older cart rows (localStorage) may lack `email`; attach logged-in user email so the payment API receives it.
  useEffect(() => {
    const u = (authUser?.email ?? authUser?.user_email ?? "").trim();
    if (!u || !cartItems.length) return;
    cartItems.forEach((item) => {
      const has = item.email && String(item.email).trim();
      if (!has) {
        dispatch(updateItem({ id: item.id, email: u }));
      }
    });
  }, [authUser?.email, authUser?.user_email, cartItems, dispatch]);

  useEffect(() => {
    if (location.state?.orderSuccess && location.state?.message) {
      setOrderSuccessMessage(location.state.message);
      window.history.replaceState({}, document.title, location.pathname);
      const t = setTimeout(() => setOrderSuccessMessage(null), 4000);
      return () => clearTimeout(t);
    }
  }, [
    location.state?.orderSuccess,
    location.state?.message,
    location.pathname,
  ]);

  const handleDelete = (itemId) => {
    dispatch(removeItem(itemId));
  };

  const handleQuantityChange = (itemId, quantity) => {
    dispatch(updateQuantity({ id: itemId, quantity: Math.max(1, quantity) }));
  };

  const handleToggleValuation = (itemId, checked) => {
    const item = cartItems.find((entry) => entry.id === itemId);
    if (!item) return;
    const hadValuation = item.valuation === 1 || item.valuation === true;
    if (checked === hadValuation) return;

    const valuationPrice = Number(item.valuation_price);
    const currentPrice = Number(item.price) || 0;
    const newPrice = checked
      ? currentPrice + valuationPrice
      : Math.max(0, currentPrice - valuationPrice);

    dispatch(
      updateItem({
        id: itemId,
        valuation: checked ? 1 : 0,
        price: newPrice,
        valuation_price: valuationPrice,
      }),
    );
  };

  /**
   * ad-old flow: Cart "Checkout" calls /ad/process-paypal (single item) or
   * /ad/bundle-query-form-submit (bulk) FIRST to create the order on the
   * backend.  The backend returns { token, id, order_number, amount, ... }
   * which is then passed to /checkout as the braintreePayload.
   */
  const handleProceedToPayment = async () => {
    if (!cartItems.length) return;

    const missingEmail = cartItems.some((item) => !resolveCheckoutEmail(item));
    if (missingEmail) {
      setSubmitError(
        "Email is required for checkout. Sign in or add items from Authentication with your email address.",
      );
      return;
    }

    setSubmitting(true);
    setSubmitError("");

    try {
      if (cartItems.length === 1) {
        // Single item → /ad/process-paypal (same as ad-old single-cart.js submitBulkQuery)
        const item = cartItems[0];
        const itemEmail = resolveCheckoutEmail(item);
        const brandIdNum = Number(item.brand_id) || item.brand_id;
        const singleFormData = {
          brand_id: brandIdNum,
          brand_name: brandIdNum,
          category_id: item.category_id,
          model: item.model ?? "",
          description: item.description ?? "",
          sku: item.sku ?? "",
          email: itemEmail,
          emailc: itemEmail,
          user_email: itemEmail,
          valuation: item.valuation ?? 0,
          uploadedImages: Array.isArray(item.imagePaths)
            ? item.imagePaths.join(",")
            : (item.imagePaths ?? ""),
          terms_and_condition_privacy_policy: true,
          amount: total,
          query_amount: item.price ?? total,
          queries_count: 0,
          is_user_paid: total > 0 ? 1 : 0,
          add_on: item.add_on ?? 0,
          is_expedited: item.is_expedited || false,
        };

        if (total === 0) {
          // Free – submit and go home
          await dispatch(
            freeSubmitBulk({
              user_email: itemEmail,
              total_price: 0,
              queries_count: 1,
              total_queries_count: 1,
              queries: [
                {
                  uploadedImages: singleFormData.uploadedImages,
                  brand_id: singleFormData.brand_id,
                  brand_name: singleFormData.brand_id,
                  selectCategory: singleFormData.category_id,
                  category: singleFormData.category_id,
                  email: itemEmail,
                  user_email: itemEmail,
                  model: singleFormData.model,
                  sku: singleFormData.sku,
                  description: singleFormData.description,
                  valuation: singleFormData.valuation,
                  ip: "",
                  query_amount: 0,
                  is_user_paid: 0,
                  paid_amount: 0,
                  is_subscription: 0,
                  add_on: 0,
                  is_expedited: item.is_expedited || false,
                },
              ],
            }),
          ).unwrap();
          dispatch(clearCart());
          navigate("/");
          return;
        }

        const result = await dispatch(
          processPaypalPayment({
            singleFormData,
            is_expedited: item.is_expedited || false,
          }),
        ).unwrap();
        const braintreeData = result?.data ?? result;
        const token = braintreeData?.token ?? braintreeData?.client_token;

        if (
          token &&
          (braintreeData?.id != null || braintreeData?.order_number)
        ) {
          const payloadForCheckout = {
            ...braintreeData,
            email: braintreeData?.email ?? itemEmail,
            brand_name: braintreeData?.brand_name ?? singleFormData.brand_name,
            is_expedited: item.is_expedited || false,
          };
          const query =
            "?data=" +
            encodeURIComponent(JSON.stringify(payloadForCheckout)) +
            "&page=single";
          navigate("/checkout" + query, {
            state: {
              braintreePayload: payloadForCheckout,
              checkoutType: "auth",
              is_expedited: item.is_expedited || false,
            },
          });
        } else {
          // Fallback: navigate with whatever we got
          navigate("/checkout", {
            state: {
              certificateIds: [braintreeData?.id ?? result?.data],
              checkoutType: "auth",
              is_expedited: item.is_expedited || false,
            },
          });
        }
      } else {
        // Multiple items → /ad/bundle-query-form-submit (same as ad-old bulk flow)
        const firstItem = cartItems[0];
        const queries = cartItems.map((item) => {
          const qBrandId = Number(item.brand_id) || item.brand_id;
          const itemEmail = resolveCheckoutEmail(item);
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
            is_user_paid: (item.price ?? 0) > 0 ? 1 : 0,
            paid_amount: item.price ?? 0,
            is_subscription: 0,
            add_on: item.add_on ?? 0,
          };
        });

        const bulkUserEmail = resolveCheckoutEmail(firstItem);
        const payload = {
          user_email: bulkUserEmail,
          total_price: total,
          queries_count: cartItems.length,
          total_queries_count: cartItems.length,
          queries,
        };

        if (total === 0) {
          await dispatch(freeSubmitBulk(payload)).unwrap();
          dispatch(clearCart());
          navigate("/");
          return;
        }

        const result = await dispatch(
          bundleQueryFormSubmitBulk(payload),
        ).unwrap();
        const braintreeData = result?.data ?? result;
        const token = braintreeData?.token ?? braintreeData?.client_token;

        if (
          token &&
          (braintreeData?.id != null || braintreeData?.order_number)
        ) {
          const payloadForCheckout = {
            ...braintreeData,
            email: braintreeData?.email ?? bulkUserEmail,
            brand_name:
              braintreeData?.brand_name ??
              firstItem.brand ??
              firstItem.brand_id,
          };
          const query =
            "?data=" +
            encodeURIComponent(JSON.stringify(payloadForCheckout)) +
            "&page=bulk";
          navigate("/checkout" + query, {
            state: {
              braintreePayload: payloadForCheckout,
              checkoutType: "auth",
            },
          });
        } else {
          navigate("/checkout", {
            state: { certificateIds: [], checkoutType: "auth" },
          });
        }
      }
    } catch (err) {
      const msg =
        err?.message || String(err) || "Checkout failed. Please try again.";
      console.error("Cart checkout failed:", msg);
      console.error("[Cart] Full error object:", err);
      console.error("[Cart] Backend response (err.data):", err?.data);
      console.error("[Cart] HTTP status (err.status):", err?.status);
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#F5F5F0] py-8 sm:py-12 md:py-16">
      {orderSuccessMessage && (
        <div
          className="fixed top-4 right-4 z-[100] max-w-sm rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-800 shadow-lg"
          role="alert"
        >
          {orderSuccessMessage}
        </div>
      )}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-[22px] shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-6 sm:p-8 md:p-10 lg:p-12">
            {/* Header */}
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
                Cart
              </h1>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 mb-4"></div>

            {/* Cart Items */}
            <div className="space-y-0">
              {cartItems.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-primary/70 mb-4">Your cart is empty.</p>
                  <button
                    type="button"
                    onClick={() => navigate("/authentication")}
                    className="bg-primary text-secondary px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold text-sm sm:text-base hover:bg-primary-hover transition-colors shadow-md"
                  >
                    Add items from Authentication
                  </button>
                </div>
              ) : (
                cartItems.map((item, index) => (
                  <div key={item.id}>
                    {index > 0 && (
                      <div className="border-t border-gray-200"></div>
                    )}
                    <CartItem
                      image={item.image}
                      brand={item.brand}
                      model={item.model}
                      price={item.price}
                      quantity={item.quantity}
                      valuation={item.valuation}
                      onToggleValuation={(checked) =>
                        handleToggleValuation(item.id, checked)
                      }
                      onDelete={() => handleDelete(item.id)}
                      // onQuantityChange={(qty) =>
                      //   handleQuantityChange(item.id, qty)
                      // }
                    />
                    {index < cartItems.length - 1 && (
                      <div className="border-t border-gray-200"></div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Order Summary */}
            {cartItems.length > 0 && (
              <>
                <div className="border-t border-gray-200 pt-4 pb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm sm:text-base font-semibold text-primary">
                      SUBTOTAL
                    </span>
                    <span className="text-sm sm:text-base text-gray-600">
                      ${Number(subtotal).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-base sm:text-lg font-bold text-primary">
                      TOTAL
                    </span>
                    <span className="text-base sm:text-lg font-bold text-black">
                      ${Number(total).toFixed(2)}
                    </span>
                  </div>
                </div>

                {submitError && (
                  <p className="text-red-500 text-sm mb-3">{submitError}</p>
                )}

                {/* Proceed to Payment */}
                <div className="flex flex-col sm:flex-row justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleProceedToPayment}
                    disabled={submitting}
                    className="order-1 bg-primary text-secondary px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold text-sm sm:text-base hover:bg-primary-hover transition-colors shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {submitting ? "Processing..." : "Proceed to payment"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
