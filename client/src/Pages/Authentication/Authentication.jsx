import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthenticationHero from "../../sections/Authentication/AuthenticationHero/AuthenticationHero";
import WhyChooseUs from "../../sections/Authentication/WhyChooseUs/WhyChooseUs";
import ViewPricingCard from "../../sections/Authentication/ViewPricingCard/ViewPricingCard";
import ChooseSpeedQuantity from "../../sections/Authentication/ChooseSpeedQuantity/ChooseSpeedQuantity";
import Prices from "../../sections/Authentication/Prices/Prices";
import Form from "../../sections/Authentication/Form/Form";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { clearUploadedPaths } from "../../store/slices/uploadSlice";
import {
  submitAuthenticateNow,
  freeSubmitBulk,
  bundleQueryFormSubmitBulk,
  getQueryPrice,
} from "../../store/slices/authenticationRequestSlice";
import { addItem, clearCart } from "../../store/slices/cartSlice";
import { fetchSubscription } from "../../store/slices/subscriptionSlice";
import { IMAGE_BASE_URL, BASE_URL_OLD_IMAGE_URL } from "../../config/env";

const Authentication = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [bulkQuantity, setBulkQuantity] = useState(0);
  const { brands: authBrands = [], category: categoryList = [] } =
    useAppSelector((state) => state.authenticationRequest);
  const { brands: apiBrands = [] } = useAppSelector((state) => state.brands);
  const { user: authUser } = useAppSelector((state) => state.auth);
  const currentSubscription = useAppSelector(
    (state) => state.subscription?.currentSubscription,
  );
  const profileAddOns = useAppSelector((state) => state.profile?.addOns);
  const businessAddOns = useAppSelector((state) => state.business?.addOns);
  const addOns = profileAddOns || businessAddOns;
  const brandsList = apiBrands?.length ? apiBrands : authBrands;
  const userEmail = authUser?.email ?? authUser?.user_email ?? "";
  const [submitError, setSubmitError] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [showStickyButtons, setShowStickyButtons] = useState(false);
  const [openBulkDialogRequest, setOpenBulkDialogRequest] = useState(false);

  const [speedType, setSpeedType] = useState("standard"); // can be "standard" | "expedited"
  const [valuationValue, setValuationValue] = useState(10);
  const [normalValue, setNormalValue] = useState(null);
  const [expeditedValue, setexpeditedValue] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const subscriptionDetails =
    currentSubscription?.subscription ?? currentSubscription ?? null;
  const remainingCertificates = Number(
    subscriptionDetails?.remaining_certificates ?? 0,
  );

  const mediaBaseUrl = (
    BASE_URL_OLD_IMAGE_URL && BASE_URL_OLD_IMAGE_URL.trim()
      ? BASE_URL_OLD_IMAGE_URL
      : IMAGE_BASE_URL || ""
  ).replace(/\/+$/, "");

  const buildAuthImageUrl = (path) => {
    if (!path) return null;
    const raw = String(path).trim();
    if (!raw) return null;
    if (
      raw.startsWith("http://") ||
      raw.startsWith("https://") ||
      raw.startsWith("blob:")
    )
      return raw;
    const normalized = raw.replace(/^\/+/, "");
    return normalized.startsWith("authenticateImage/")
      ? `${mediaBaseUrl}/${normalized}`
      : `${mediaBaseUrl}/authenticateImage/${normalized}`;
  };

  const resolveItemMeta = (entry) => {
    const selectedBrand =
      brandsList.find((b) => String(b.id) === String(entry.brand_id)) ||
      brandsList.find(
        (b) => String(b.brand || b.name) === String(entry.brand_id),
      );
    const brandIdForApi =
      selectedBrand != null ? selectedBrand.id : entry.brand_id;
    const selectedCategory = categoryList.find(
      (c) => String(c.id) === String(entry.category),
    );
    const categoryIdForApi = entry.category;
    const categoryPrice = Number(selectedCategory?.price ?? 0);
    const valuationSurcharge = 10;
    const fallbackPrice =
      categoryPrice + (entry.marketValuation ? valuationSurcharge : 0);
    return {
      selectedBrand,
      selectedCategory,
      brandIdForApi,
      categoryIdForApi,
      categoryPrice,
      fallbackPrice,
    };
  };

  const toSafeNumber = (value) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const getCategoryBasePrice = (category, speed) => {
    const categoryPricing = category?.pricing;
    const normalCandidate =
      categoryPricing?.normal_query ?? category?.price ?? normalValue ?? 0;
    const expeditedCandidate =
      categoryPricing?.expedited_query ??
      expeditedValue ??
      normalCandidate ??
      0;
    return speed === "expedited"
      ? toSafeNumber(expeditedCandidate)
      : toSafeNumber(normalCandidate);
  };

  const isCategorySpecial = (category) =>
    Number(category?.is_special ?? 1) === 1;

  const buildPricedItem = ({
    entry,
    selectedBrand,
    selectedCategory,
    brandIdForApi,
    categoryIdForApi,
    imagePaths,
    availableSubscriptionCredits = 0,
  }) => {
    const basePrice = getCategoryBasePrice(selectedCategory, speedType);
    const valuationSurcharge =
      entry.marketValuation === true ? toSafeNumber(valuationValue) : 0;
    const eligibleForSubscription =
      speedType !== "expedited" &&
      !isCategorySpecial(selectedCategory) &&
      availableSubscriptionCredits > 0;
    const payableBase = eligibleForSubscription ? 0 : basePrice;
    const payablePrice = toSafeNumber(payableBase + valuationSurcharge);
    const firstPath = Array.isArray(imagePaths) ? imagePaths[0] : imagePaths;
    const imageUrl = buildAuthImageUrl(firstPath);
    const brandName =
      selectedBrand?.brand || selectedBrand?.name || String(entry.brand_id);
    const categoryName = selectedCategory?.name || String(categoryIdForApi);

    return {
      cartPayload: {
        id: `cart_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
        brand: brandName,
        model: entry.model || categoryName || "—",
        price: payablePrice,
        quantity: 1,
        image: imageUrl,
        category_id: categoryIdForApi,
        brand_id: brandIdForApi,
        valuation_price: valuationValue,
        description: entry.additionalInfo ?? "",
        valuation: entry.marketValuation ? 1 : 0,
        add_on: entry.insurance ? 1 : 0,
        imagePaths: Array.isArray(imagePaths) ? imagePaths : [imagePaths],
        email: entry.email ?? userEmail,
        sku: entry.sku ?? "",
        is_expedited: speedType === "expedited",
        is_subscription: eligibleForSubscription ? 1 : 0,
      },
      queryPayload: {
        uploadedImages: Array.isArray(imagePaths)
          ? imagePaths.join(",")
          : String(imagePaths ?? ""),
        brand_id: brandIdForApi,
        brand_name: brandIdForApi,
        selectCategory: categoryIdForApi,
        category: categoryIdForApi,
        email: entry.email ?? userEmail,
        user_email: entry.email ?? userEmail,
        model: entry.model ?? "",
        sku: entry.sku ?? "",
        description: entry.additionalInfo ?? "",
        valuation: entry.marketValuation ? 1 : 0,
        ip: "",
        query_amount: payablePrice,
        is_user_paid: payablePrice > 0 ? 1 : 0,
        paid_amount: payablePrice,
        is_subscription: eligibleForSubscription ? 1 : 0,
        add_on: entry.insurance ? 1 : 0,
        is_expedited: speedType === "expedited",
      },
      usedSubscriptionCredit: eligibleForSubscription ? 1 : 0,
      payablePrice,
    };
  };

  const submitFreeQueriesAndExit = async ({ email, queries }) => {
    await dispatch(
      freeSubmitBulk({
        user_email: email ?? userEmail,
        total_price: 0,
        queries_count: queries.length,
        total_queries_count: queries.length,
        queries,
        is_expedited: speedType === "expedited",
      }),
    ).unwrap();
    setToastVariant("success");
    setToastMessage("Your query was submitted successfully.");
    dispatch(clearUploadedPaths());
    dispatch(clearCart());
    window.scrollTo({ top: 0, behavior: "auto" });
    setTimeout(() => navigate("/"), 1200);
  };

  const showToastMsg = (msg, variant = "success", duration = 3000) => {
    if (!msg) return;
    setToastVariant(variant);
    setToastMessage(String(msg));
    window.setTimeout(() => {
      setToastMessage("");
    }, duration);
  };

  // console.log("Category id is :- ", selectedCategoryId);
  // console.log("Valuation val is :- ", valuationValue);
  // console.log("Speed Type is :- ", speedType);
  // console.log("Normal Value is :- ", normalValue);
  // console.log("Expiteted Value is :- ", expeditedValue);

  useEffect(() => {
    async function getAllPrices(id) {
      const res = await dispatch(getQueryPrice({ category_id: id }));
      console.log("Response is :- ", res);
      if (res.payload.data !== null) {
        setexpeditedValue(Number(res.payload.data.expedited_query));
        setNormalValue(Number(res.payload.data.normal_query));
      }
    }
    if (selectedCategoryId) getAllPrices(selectedCategoryId);
  }, [selectedCategoryId, dispatch]);

  useEffect(() => {
    if (!authUser?.id) return;
    dispatch(fetchSubscription());
  }, [dispatch, authUser?.id]);

  // const resolvePriceForEntry = async (
  //   entry,
  //   categoryIdForApi,
  //   fallbackPrice,
  // ) => {
  //   try {
  //     const queryLabel =
  //       entry?.model || entry?.sku
  //         ? [entry.model, entry.sku].filter(Boolean).join(" · ")
  //         : "";
  //     const priceRes = await dispatch(
  //       getQueryPrice({
  //         category_id: categoryIdForApi,
  //         // valuation: entry.marketValuation ? 1 : 0,
  //         // brand_id: entry.brand_id,
  //         // model: entry.model,
  //         // query: queryLabel || undefined,
  //       }),

  //       console.log("Prices are 👌👌😒", priceRes),
  //     ).unwrap();
  //     const rawAmount =
  //       priceRes?.data?.amount ??
  //       priceRes?.data?.total_price ??
  //       priceRes?.amount ??
  //       priceRes?.total_price ??
  //       priceRes?.data ??
  //       0;
  //     return Number(rawAmount) || 0;
  //   } catch {
  //     return fallbackPrice;
  //   }
  // };

  const scrollToAuthenticationForm = () => {
    if (typeof window === "undefined") return;
    const section = document.getElementById("bulk-authentication");
    if (!section) return;
    // Keep the form title visible below sticky header.
    const headerOffset = 96;
    const targetTop =
      section.getBoundingClientRect().top + window.scrollY - headerOffset;
    window.scrollTo({ top: Math.max(0, targetTop), behavior: "smooth" });
  };

  const scrollToChooseSpeedSection = () => {
    if (typeof window === "undefined") return;
    const section = document.getElementById("choose-speed-quantity");
    if (!section) return;
    // Keep the section title visible below sticky header.
    const headerOffset = 96;
    const targetTop =
      section.getBoundingClientRect().top + window.scrollY - headerOffset;
    window.scrollTo({ top: Math.max(0, targetTop), behavior: "smooth" });
  };

  const handlePrimaryButtonClick = () => {
    setIsBulkMode(false);
    scrollToAuthenticationForm();
  };

  const handleSecondaryButtonClick = () => {
    setIsBulkMode(true);
    scrollToAuthenticationForm();
  };

  const handleFormSubmit = async (data, options = {}) => {
    const {
      brand_id,
      category: categoryId,
      model,
      sku,
      additionalInfo,
      email,
      marketValuation,
      insurance,
      imagePaths,
      reCaptchaToken,
    } = data;
    setSubmitError("");
    const addOnValue = insurance ? 1 : 0;

    if (Array.isArray(options?.bulkItems) && options.bulkItems.length > 0) {
      try {
        dispatch(clearCart());
        let availableSubscriptionCredits = remainingCertificates;
        const pricedItems = [];
        for (const entry of options.bulkItems) {
          const {
            selectedBrand,
            selectedCategory,
            brandIdForApi,
            categoryIdForApi,
          } = resolveItemMeta(entry);
          const priced = buildPricedItem({
            entry,
            selectedBrand,
            selectedCategory,
            brandIdForApi,
            categoryIdForApi,
            imagePaths: entry.imagePaths,
            availableSubscriptionCredits,
          });
          availableSubscriptionCredits -= priced.usedSubscriptionCredit;
          pricedItems.push(priced);
        }

        const payableTotal = pricedItems.reduce(
          (sum, item) => sum + toSafeNumber(item.payablePrice),
          0,
        );

        if (payableTotal === 0) {
          await submitFreeQueriesAndExit({
            email: options?.bulkItems?.[0]?.email ?? userEmail,
            queries: pricedItems.map((item) => item.queryPayload),
          });
          return true;
        }

        for (const item of pricedItems) {
          dispatch(addItem(item.cartPayload));
        }
        dispatch(clearUploadedPaths());
        window.scrollTo({ top: 0, behavior: "auto" });
        navigate(options?.goToCheckout ? "/checkout" : "/cart");
        return true;
      } catch (err) {
        setSubmitError(err?.message || "Could not add bulk items to cart.");
        return false;
      }
    }
    if (!brand_id) {
      setSubmitError("Please select a brand");
      return false;
    }
    // Match ad-old: send brand and category as ids (selectBrand.id, selectCategory.id)
    const selectedBrand =
      brandsList.find((b) => String(b.id) === String(brand_id)) ||
      brandsList.find((b) => String(b.brand || b.name) === String(brand_id));
    const brandIdForApi = selectedBrand != null ? selectedBrand.id : brand_id;
    const categoryIdForApi = categoryId;
    const imageStr = Array.isArray(imagePaths)
      ? imagePaths.join(",")
      : String(imagePaths || "");
    const selectedCategory = categoryList.find(
      (c) => String(c.id) === String(categoryIdForApi),
    );
    const categoryPrice = Number(selectedCategory?.price ?? 0);
    const valuationSurcharge = 10;
    const fallbackPrice =
      categoryPrice + (marketValuation ? valuationSurcharge : 0);

    const resolvePrice = async () => {
      try {
        const queryLabel =
          model || sku ? [model, sku].filter(Boolean).join(" · ") : "";
        const priceRes = await dispatch(
          getQueryPrice({
            category_id: categoryIdForApi,
            valuation: marketValuation ? 1 : 0,
            brand_id: brandIdForApi,
            model,
            query: queryLabel || undefined,
          }),
        ).unwrap();
        const rawAmount =
          priceRes?.data?.amount ??
          priceRes?.data?.total_price ??
          priceRes?.amount ??
          priceRes?.total_price ??
          priceRes?.data ??
          0;
        return Number(rawAmount) || 0;
      } catch {
        return fallbackPrice;
      }
    };

    // Add to cart (same as ad-old): no API call, save to Redux and go to cart
    if (options?.addToCart) {
      try {
        dispatch(clearCart());
        const priced = buildPricedItem({
          entry: {
            brand_id,
            model,
            sku,
            additionalInfo,
            marketValuation,
            insurance,
            email,
          },
          selectedBrand,
          selectedCategory,
          brandIdForApi,
          categoryIdForApi,
          imagePaths,
          availableSubscriptionCredits: remainingCertificates,
        });

        if (priced.payablePrice === 0) {
          await submitFreeQueriesAndExit({
            email: email ?? userEmail,
            queries: [priced.queryPayload],
          });
          return true;
        }

        dispatch(addItem(priced.cartPayload));
        dispatch(clearUploadedPaths());
        window.scrollTo({ top: 0, behavior: "auto" });
        navigate(options?.goToCheckout ? "/checkout" : "/cart");
        return true;
      } catch (err) {
        setSubmitError(err?.message || "Could not add to cart.");
        return false;
      }
    }

    try {
      if (isBulkMode) {
        // Same as ad-old: brand_name = selectBrand.id, selectCategory/category = selectCategory.id
        const queriesAdOld = [
          {
            uploadedImages: imageStr,
            brand_name: brandIdForApi,
            selectCategory: categoryIdForApi,
            category: categoryIdForApi,
            model: model !== undefined && model !== null ? String(model) : "",
            sku: sku !== undefined && sku !== null ? String(sku) : "",
            description: additionalInfo ?? "",
            valuation: marketValuation ? 1 : 0,
            ip: "",
            query_amount: 0,
            is_user_paid: 0,
            paid_amount: 0,
            is_subscription: 0,
            add_on: addOnValue,
          },
        ];
        const payload = {
          user_email: email,
          queries_count: 1,
          total_queries_count: 1,
          queries: queriesAdOld,
        };
        const totalPrice = await resolvePrice();
        const result =
          totalPrice === 0
            ? await dispatch(
                freeSubmitBulk({ ...payload, total_price: 0 }),
              ).unwrap()
            : await dispatch(
                bundleQueryFormSubmitBulk({
                  ...payload,
                  total_price: totalPrice,
                }),
              ).unwrap();
        dispatch(clearUploadedPaths());
        if (totalPrice === 0) {
          showToastMsg("Your query was submitted successfully.");
          navigate("/");
          return true;
        }
        const braintreeData = result?.data ?? result;
        const token = braintreeData?.token ?? braintreeData?.client_token;
        if (
          token &&
          (braintreeData?.id != null || braintreeData?.order_number)
        ) {
          const payloadForCheckout = {
            ...braintreeData,
            email: braintreeData?.email ?? email,
            brand_name: braintreeData?.brand_name ?? brandIdForApi,
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
          const certIds = result?.data
            ? Array.isArray(result.data)
              ? result.data
              : [result.data]
            : [];
          navigate("/checkout", {
            state: { certificateIds: certIds, checkoutType: "auth" },
          });
        }
        return true;
      } else {
        // ad-old single paid flow: save item and go to cart
        const amount = await resolvePrice();
        if (amount === 0) {
          await dispatch(
            submitAuthenticateNow({
              brand_name: brandIdForApi,
              category_id: categoryIdForApi,
              category: categoryIdForApi,
              model: model || "",
              description: additionalInfo || "",
              email,
              image: imagePaths,
              reCaptchaToken,
              type: "single",
              valuation: marketValuation ? 1 : 0,
              add_on: addOnValue,
            }),
          ).unwrap();
          dispatch(clearUploadedPaths());
          showToastMsg("Your query was submitted successfully.");
          navigate("/");
          return true;
        }

        dispatch(clearCart());
        const cartId = `cart_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
        const brandName =
          selectedBrand?.brand || selectedBrand?.name || String(brand_id);
        const categoryName = selectedCategory?.name || String(categoryIdForApi);
        const firstPath = Array.isArray(imagePaths)
          ? imagePaths[0]
          : imagePaths;
        const imageUrl = buildAuthImageUrl(firstPath);
        dispatch(
          addItem({
            id: cartId,
            brand: brandName,
            model: model || categoryName || "—",
            price: Number(amount) || categoryPrice || 0,
            quantity: 1,
            image: imageUrl,
            category_id: categoryIdForApi,
            brand_id: brandIdForApi,
            valuation_price: valuationValue,
            description: additionalInfo ?? "",
            valuation: marketValuation ? 1 : 0,
            add_on: addOnValue,
            imagePaths: Array.isArray(imagePaths) ? imagePaths : [imagePaths],
            email: email ?? userEmail,
            sku: sku !== undefined && sku !== null ? String(sku) : "",
          }),
        );
        dispatch(clearUploadedPaths());
        window.scrollTo({ top: 0, behavior: "auto" });
        navigate("/cart");
        return true;
      }
    } catch (err) {
      setSubmitError(
        err?.message ||
          String(err) ||
          "Submission failed. Please sign in and try again.",
      );
      return false;
    }
  };

  const scrollToBulkAuthentication = () => {
    scrollToAuthenticationForm();
  };

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window === "undefined") return;
      const formEl = document.getElementById("bulk-authentication");
      const viewportHeight = window.innerHeight || 0;
      const formRect = formEl ? formEl.getBoundingClientRect() : null;
      const formOnScreen =
        !!formRect && formRect.top < viewportHeight && formRect.bottom > 0;

      // Show sticky bar once user has scrolled a bit down the page
      // (over hero image, Why Choose Us, and Prices) but hide it
      // whenever the main form is on screen.
      const scrolledPastTop = window.scrollY > 150;
      setShowStickyButtons(scrolledPastTop && !formOnScreen);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <div>
      {toastMessage && (
        <div
          className={`fixed top-4 right-4 z-[9999] max-w-sm rounded-lg border px-4 py-3 text-sm shadow-lg ${
            toastVariant === "success"
              ? "border-green-200 bg-green-50 text-green-800"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
          role="alert"
        >
          <p className="font-medium">{toastMessage}</p>
        </div>
      )}
      <AuthenticationHero onGetStartedClick={scrollToChooseSpeedSection} />
      <WhyChooseUs />
      <ViewPricingCard />
      <section id="choose-speed-quantity" className="scroll-mt-4">
        <ChooseSpeedQuantity
          quantity={isBulkMode ? "bulk" : "single"}
          setIsBulkMode={setIsBulkMode}
          bulkQuantity={bulkQuantity}
          setBulkQuantity={setBulkQuantity}
          isLoggedIn={!!authUser}
          onQuantityChange={(isBulk) => {
            const bulk = !!isBulk;
            setIsBulkMode(bulk);
            // When user selects "Bulk Authentication" from the top toggle,
            // open the same bulk flow dialog that the (now-removed) brown CTA used.
            if (bulk) {
              setOpenBulkDialogRequest(true);
            }
            scrollToBulkAuthentication();
          }}
          speedType={speedType}
          setSpeedType={setSpeedType}
        />
      </section>
      {/* <Prices /> */}
      {submitError && (
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 md:px-8 mb-4">
          <p className="text-red-500 text-sm">{submitError}</p>
        </div>
      )}
      <section id="bulk-authentication" className="scroll-mt-4">
        <Form
          onPrimaryButtonClick={handlePrimaryButtonClick}
          onSecondaryButtonClick={handleSecondaryButtonClick}
          onSubmit={handleFormSubmit}
          openBulkDialog={openBulkDialogRequest}
          onBulkDialogOpened={() => setOpenBulkDialogRequest(false)}
          setIsBulkMode={setIsBulkMode}
          bulkQuantity={bulkQuantity}
          setBulkQuantity={setBulkQuantity}
          selectedCategoryId={selectedCategoryId}
          setSelectedCategoryId={setSelectedCategoryId}
          valuationValue={valuationValue}
          remainingRequests={remainingCertificates}
          speedType={speedType}
          onUseStandardAuthentication={() => {
            setSpeedType("standard");
            setIsBulkMode(false);
            scrollToChooseSpeedSection();
          }}
        />
      </section>
      {/* {showStickyButtons && (
        <div className="fixed inset-x-0 bottom-0 z-40 bg-[#F5F5F0]/80 px-4 py-3">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row gap-4 sm:gap-16">
            <button
              type="button"
              onClick={() => {
                setIsBulkMode(false);
                scrollToBulkAuthentication();
              }}
              className="flex-1 bg-primary text-secondary py-3 rounded-lg font-semibold text-sm sm:text-base shadow-md hover:bg-primary-hover transition-colors active:scale-[0.98]"
            >
              Start Authentication
            </button>
            <button
              type="button"
              onClick={() => {
                setIsBulkMode(true);
                setOpenBulkDialogRequest(true);
                scrollToBulkAuthentication();
              }}
              className="flex-1 bg-secondary text-primary py-3 rounded-lg font-semibold text-sm sm:text-base shadow-md border border-gray-200 hover:bg-gray-50 transition-colors active:scale-[0.98]"
            >
              Bulk Authentication
            </button>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default Authentication;
