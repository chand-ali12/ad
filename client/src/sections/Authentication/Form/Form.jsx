import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { FaSearch } from "react-icons/fa";
import ReCAPTCHA from "react-google-recaptcha";
import { CustomSelect } from "../../../components";
import {
  FiPlus,
  FiX,
  FiHelpCircle,
  FiShield,
  FiCheckCircle,
} from "react-icons/fi";
import PropTypes from "prop-types";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { uploadImage } from "../../../store/slices/uploadSlice";
import { fetchAuthenticateNowView } from "../../../store/slices/authenticationRequestSlice";
import { getBrands } from "../../../store/slices/brandsSlice";
import { getUserProfile } from "../../../store/slices/profileSlice";
import { getBusinessProfile } from "../../../store/slices/businessSlice";
import { INSURANCE_POLICY_SECTIONS } from "./insurancePolicyContent";
import photoGuideImage from "../../../assets/images/photo-guide.png";

const Form = ({
  onPrimaryButtonClick,
  onSecondaryButtonClick,
  onSubmit,
  openBulkDialog = false,
  onBulkDialogOpened,
  className = "",
  setIsBulkMode,
  bulkQuantity,
  setBulkQuantity,
  selectedCategoryId,
  setSelectedCategoryId,
  valuationValue,
  remainingRequests = 0,
  speedType = "standard",
}) => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const fromCart = Boolean(location.state?.fromCart);
  const { brands: authBrands = [], category: categoryList = [] } =
    useAppSelector((state) => state.authenticationRequest);
  const { brands: apiBrands = [] } = useAppSelector((state) => state.brands);
  const { user: authUser } = useAppSelector((state) => state.auth);
  const profileAddOns = useAppSelector((state) => state.profile?.addOns);
  const businessAddOns = useAppSelector((state) => state.business?.addOns);
  const addOns = profileAddOns || businessAddOns;
  const hasAddOns = !!addOns;

  const {
    register,
    control,
    formState: { errors },
    trigger,
    getValues,
    watch,
    setValue,
    setFocus,
    reset,
    setError,
    clearErrors,
  } = useForm({
    shouldFocusError: true,
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      insurance: false,
      recaptcha: false,
      reCaptchaToken: "",
    },
  });

  const selectedBrandId = watch("brand_id");
  const recaptchaChecked =
    Boolean(watch("reCaptchaToken")) || !!watch("recaptcha");
  const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
  const [previewFiles, setPreviewFiles] = useState([]);
  const [bulkDialogOpen, setBulkDialogOpen] = useState(false);
  // const [bulkQuantity, setBulkQuantity] = useState(0);
  const [bulkStep, setBulkStep] = useState(1);
  const [bulkItems, setBulkItems] = useState([]);
  const [expandedImageIndex, setExpandedImageIndex] = useState(null);
  const [showMarketValuationAlert, setShowMarketValuationAlert] =
    useState(false);
  const [showInsurancePolicyModal, setShowInsurancePolicyModal] =
    useState(false);
  const [showModelInfoAlert, setShowModelInfoAlert] = useState(false);
  const [showPhotoGuideModal, setShowPhotoGuideModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadPopupState, setUploadPopupState] = useState("hidden");
  const isSubmittingRef = useRef(false);
  const fileInputRef = useRef(null);
  const recaptchaRef = useRef(null);
  const formCardRef = useRef(null);
  const previewFilesRef = useRef(previewFiles);
  const uploadPopupTimeoutRef = useRef(null);
  const wasUploadingRef = useRef(false);
  const uploadStartSuccessCountRef = useRef(0);
  previewFilesRef.current = previewFiles;

  const brandsList = apiBrands?.length ? apiBrands : authBrands;
  const sortedBrandsForSelect = [...(brandsList || [])].sort((a, b) => {
    const nameA = (a.brand || a.name || "").toString().toLowerCase();
    const nameB = (b.brand || b.name || "").toString().toLowerCase();
    return nameA.localeCompare(nameB);
  });
  const selectedBrand = brandsList.find(
    (b) => String(b.id) === String(selectedBrandId),
  );

  const categoriesForBrand = selectedBrandId
    ? categoryList.filter(
        (c) =>
          String(c.brand_id) === String(selectedBrandId) ||
          String(c.brand_id) === String(selectedBrand?.brand || ""),
      )
    : [];

  useEffect(() => {
    dispatch(fetchAuthenticateNowView());
    dispatch(getBrands());
  }, [dispatch]);

  // Fetch profile/business when logged in so addOns is available for Insurance checkbox
  useEffect(() => {
    if (!authUser?.id) return;
    dispatch(getUserProfile({ id: authUser.id }));
    const businessId =
      authUser?.user_business?.[0]?.id ?? authUser?.business_id;
    if (businessId) dispatch(getBusinessProfile({ id: businessId }));
  }, [dispatch, authUser?.id, authUser?.user_business, authUser?.business_id]);

  useEffect(() => {
    setValue("category", "");
  }, [selectedBrandId, setValue]);

  useEffect(() => {
    const hasUploaded = previewFiles.some((f) => f.uuid);
    if (hasUploaded) clearErrors("images");
  }, [previewFiles, clearErrors]);

  useEffect(() => {
    if (!errors.images) return;
    const hasEarlierFieldError = Boolean(
      errors.brand_id ||
      errors.category ||
      errors.model ||
      errors.sku ||
      errors.additionalInfo ||
      errors.email ||
      errors.confirmEmail,
    );
    if (hasEarlierFieldError) return;
    document
      .getElementById("auth-image-upload-section")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
    fileInputRef.current?.focus?.();
  }, [errors]);

  // Auto-fill email and confirm email when user is logged in
  useEffect(() => {
    const email = authUser?.email ?? authUser?.user_email ?? "";
    if (email && typeof email === "string" && email.trim()) {
      setValue("email", email.trim());
      setValue("confirmEmail", email.trim());
    }
  }, [authUser, setValue]);

  // Open bulk dialog when parent requests it (e.g. from sticky "Bulk Authentication" button)
  useEffect(() => {
    if (openBulkDialog) {
      setBulkDialogOpen(true);
      onBulkDialogOpened?.();
    }
  }, [openBulkDialog, onBulkDialogOpened]);

  const handleFileChange = async (e) => {
    const files = e.target.files;
    if (!files?.length) {
      setPreviewFiles([]);
      return;
    }
    const formValues = getValues();
    const formBrand = brandsList.find(
      (b) => String(b.id) === String(formValues.brand_id),
    );
    const brand_name = formBrand?.brand ?? formBrand?.name ?? "";
    const catsForBrand = categoryList.filter(
      (c) =>
        String(c.brand_id) === String(formValues.brand_id) ||
        String(c.brand_id) ===
          String(formBrand?.brand || formBrand?.name || ""),
    );
    const categoryName =
      catsForBrand.find((c) => String(c.id) === String(formValues.category))
        ?.name ??
      formValues.category ??
      "";
    const newItems = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const url = URL.createObjectURL(file);
      newItems.push({ file, url, uuid: null, uploading: true });
    }
    setPreviewFiles((prev) => [...prev, ...newItems]);
    const filesArray = Array.from(files);
    for (let i = 0; i < filesArray.length; i++) {
      const file = filesArray[i];
      try {
        const result = await dispatch(
          uploadImage({
            image: file,
            storage_type: "authenticateImage",
            brand_name,
            category: categoryName,
            model: formValues.model,
            description: formValues.additionalInfo,
            email: formValues.email,
          }),
        ).unwrap();
        const uuid = result?.data;
        setPreviewFiles((prev) => {
          const idx = prev.findIndex((p) => p.file === file && p.uploading);
          if (idx === -1) return prev;
          const next = [...prev];
          next[idx] = { ...next[idx], uuid, uploading: false };
          return next;
        });
      } catch (err) {
        console.error("Upload failed:", err);
        setPreviewFiles((prev) => {
          const idx = prev.findIndex((p) => p.file === file && p.uploading);
          if (idx === -1) return prev;
          const next = [...prev];
          next[idx] = {
            ...next[idx],
            uploading: false,
            error: err?.message || "Upload failed",
          };
          return next;
        });
      }
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const { ref: imageInputRef, ...imageInputRegister } = register("images", {
    onChange: handleFileChange,
  });

  useEffect(() => {
    return () => {
      previewFilesRef.current.forEach(
        (f) => f.url && URL.revokeObjectURL(f.url),
      );
    };
  }, []);

  useEffect(() => {
    if (expandedImageIndex == null) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        setExpandedImageIndex(null);
        setShowPhotoGuideModal(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [expandedImageIndex]);

  useEffect(() => {
    if (!showPhotoGuideModal) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setShowPhotoGuideModal(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showPhotoGuideModal]);

  const removePreview = (index) => {
    setExpandedImageIndex((prev) =>
      prev === index ? null : prev != null && prev > index ? prev - 1 : prev,
    );
    setPreviewFiles((prev) => {
      const next = prev.filter((_, i) => i !== index);
      if (prev[index]?.url) URL.revokeObjectURL(prev[index].url);
      if (next.length === 0 && fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return next;
    });
  };

  const clearFormAfterStep = (submittedData = null) => {
    const fromAuth = authUser?.email ?? authUser?.user_email ?? "";
    const trimmedAuth = typeof fromAuth === "string" ? fromAuth.trim() : "";
    const submittedEmail =
      submittedData?.email != null ? String(submittedData.email).trim() : "";
    const submittedConfirm =
      submittedData?.confirmEmail != null
        ? String(submittedData.confirmEmail).trim()
        : "";
    // Keep email on every bulk step: guest reuses what they typed; logged-in reuse profile email
    const emailNext = submittedEmail || trimmedAuth;
    const confirmNext = submittedConfirm || emailNext;

    reset({
      brand_id: "",
      category: "",
      model: "",
      sku: "",
      additionalInfo: "",
      email: emailNext,
      confirmEmail: confirmNext,
      marketValuation: false,
      insurance: false,
      recaptcha: false,
      reCaptchaToken: "",
      agreement: false,
    });
    recaptchaRef.current?.reset?.();
    setPreviewFiles((prev) => {
      prev.forEach((f) => f.url && URL.revokeObjectURL(f.url));
      return [];
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const scrollToFormTopForNextBulkStep = () => {
    requestAnimationFrame(() => {
      formCardRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      // Focus first field in sequence for the next item entry.
      setTimeout(() => setFocus("brand_id"), 50);
    });
  };

  const handleCloseBulkDialog = () => {
    setBulkDialogOpen(false);
    setIsBulkMode(false);
    setBulkQuantity(0);
  };

  const handleStartBulkFlow = () => {
    if (!bulkQuantity) return;
    setBulkItems([]);
    setBulkStep(1);
    setBulkDialogOpen(false);
    onSecondaryButtonClick?.();
  };

  const buildPayloadAndSubmit =
    (options = {}) =>
    async (data) => {
      if (previewFiles.some((f) => f.uploading)) return false;
      const imagePaths = previewFiles.filter((f) => f.uuid).map((f) => f.uuid);
      const payload = { ...data, imagePaths };

      const isBulkFlowLocal = bulkQuantity > 1;
      if (isBulkFlowLocal) {
        const updatedItems = [...bulkItems, payload];
        const isFinalStep = bulkStep >= bulkQuantity;
        if (isFinalStep) {
          const ok = onSubmit
            ? await Promise.resolve(
                onSubmit(payload, { ...options, bulkItems: updatedItems }),
              )
            : true;
          if (ok !== false) {
            setBulkItems([]);
            setBulkStep(1);
            setBulkQuantity(0);
            onPrimaryButtonClick?.();
            clearFormAfterStep(null);
          }
          return ok !== false;
        }
        setBulkItems(updatedItems);
        setBulkStep((prev) => prev + 1);
        clearFormAfterStep(payload);
        scrollToFormTopForNextBulkStep();
        return true;
      }

      if (onSubmit) {
        const ok = await Promise.resolve(onSubmit(payload, options));
        return ok !== false;
      }

      console.log("Form data:", payload);
      return true;
    };

  const isBulkFlow = bulkQuantity > 1;
  const isFinalBulkStep = isBulkFlow && bulkStep >= bulkQuantity;

  const handleAddToCartClick = async (e) => {
    e?.preventDefault?.();
    const focusFieldInSequence = (fieldName) => {
      if (fieldName === "images") {
        document
          .getElementById("auth-image-upload-section")
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
        fileInputRef.current?.focus?.();
        return;
      }

      if (fieldName === "agreement") {
        document
          .getElementById("agreement")
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
        setTimeout(() => document.getElementById("agreement")?.focus?.(), 30);
        return;
      }

      if (fieldName === "recaptcha") {
        document
          .getElementById("recaptcha-card")
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
        setTimeout(
          () => document.getElementById("recaptcha-card")?.focus?.(),
          30,
        );
        return;
      }

      const namedEl = document.querySelector(`[name="${fieldName}"]`);
      if (namedEl?.scrollIntoView) {
        namedEl.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      setTimeout(() => setFocus(fieldName), 30);
    };

    const validateImagesInSequence = async () => {
      if (isUploading) return false;
      const uploadedPaths = previewFiles
        .filter((f) => f.uuid)
        .map((f) => f.uuid);
      if (uploadedPaths.length === 0) {
        setError("images", {
          type: "manual",
          message: "Please upload at least one image",
        });
        return false;
      }
      clearErrors("images");
      return true;
    };

    const orderedChecks = [
      { name: "brand_id", check: async () => trigger("brand_id") },
      { name: "category", check: async () => trigger("category") },
      { name: "model", check: async () => trigger("model") },
      { name: "email", check: async () => trigger("email") },
      { name: "confirmEmail", check: async () => trigger("confirmEmail") },
      { name: "images", check: validateImagesInSequence },
      {
        name: "recaptcha",
        check: async () => {
          if (recaptchaSiteKey) return trigger("reCaptchaToken");
          return trigger("recaptcha");
        },
      },
      {
        name: "agreement",
        check: async () => trigger("agreement"),
      },
    ];

    for (const item of orderedChecks) {
      const ok = await item.check();
      if (!ok) {
        focusFieldInSequence(item.name);
        return;
      }
    }

    const data = getValues();

    const lockButton = !isBulkFlow || isFinalBulkStep;
    if (lockButton) {
      isSubmittingRef.current = true;
      setIsSubmitting(true);
    }

    try {
      const ok = await buildPayloadAndSubmit({
        addToCart: true,
        // Always go to cart first; user continues to checkout from there (card → home).
        goToCheckout: false,
      })(data);
      if (lockButton && ok === false) {
        setIsSubmitting(false);
        isSubmittingRef.current = false;
      }
    } catch (e) {
      console.error(e);
      if (lockButton) {
        setIsSubmitting(false);
        isSubmittingRef.current = false;
      }
    } finally {
      if (lockButton) {
        setIsSubmitting(false);
        isSubmittingRef.current = false;
      }
    }
  };

  const isUploading = previewFiles.some((f) => f.uploading);
  const successfulUploadsCount = previewFiles.filter((f) => f.uuid).length;

  useEffect(() => {
    if (isUploading) {
      if (!wasUploadingRef.current) {
        uploadStartSuccessCountRef.current = successfulUploadsCount;
      }
      if (uploadPopupTimeoutRef.current) {
        clearTimeout(uploadPopupTimeoutRef.current);
        uploadPopupTimeoutRef.current = null;
      }
      setUploadPopupState("uploading");
      wasUploadingRef.current = true;
      return;
    }

    if (wasUploadingRef.current) {
      const hasNewSuccess =
        successfulUploadsCount > uploadStartSuccessCountRef.current;

      if (hasNewSuccess) {
        setUploadPopupState("success");
        uploadPopupTimeoutRef.current = setTimeout(() => {
          setUploadPopupState("hidden");
        }, 1200);
      } else {
        setUploadPopupState("hidden");
      }

      wasUploadingRef.current = false;
    }
  }, [isUploading, successfulUploadsCount]);

  useEffect(() => {
    return () => {
      if (uploadPopupTimeoutRef.current) {
        clearTimeout(uploadPopupTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className={`bg-secondary py-8 sm:py-12 md:py-16 ${className}`}>
      <div className="w-full px-4 sm:px-6 md:px-8">
        {/* <p className="max-w-[800px] mx-auto text-center text-primary text-lg sm:text-xl md:text-2xl font-semibold mb-6">
          Have multiple items to authenticate?
        </p> */}

        {bulkQuantity > 1 && (
          <div className="max-w-[900px] mx-auto mb-4">
            <p className="text-center text-primary font-semibold text-sm sm:text-base">
              Bulk Authentication {Math.min(bulkStep, bulkQuantity)} /{" "}
              {bulkQuantity}
            </p>
          </div>
        )}

        {fromCart && (
          <div className="max-w-[900px] mx-auto mb-4 flex flex-wrap items-center justify-center gap-3 rounded-xl border border-primary/20 bg-white/90 px-4 py-3 text-center shadow-sm">
            <p className="text-sm text-primary">
              Adding more items? Your existing cart is saved.
            </p>
            <Link
              to="/cart"
              className="inline-flex items-center justify-center rounded-lg border-2 border-primary bg-primary px-4 py-2 text-sm font-semibold text-secondary hover:opacity-95 transition-opacity"
            >
              Back to cart
            </Link>
          </div>
        )}

        {/* Form Card */}
        <div
          ref={formCardRef}
          className="max-w-[900px] mx-auto bg-secondary border-2 border-gray-300 rounded-2xl p-6 md:p-8 shadow-lg"
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddToCartClick(e);
            }}
            className="space-y-6"
          >
            {/* Select Brand */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-primary mb-2">
                Select Brand <span className="text-red-500">*</span>
              </label>
              <Controller
                name="brand_id"
                control={control}
                rules={{ required: "Brand is required" }}
                render={({ field }) => (
                  <CustomSelect
                    ref={field.ref}
                    name={field.name}
                    onBlur={field.onBlur}
                    options={sortedBrandsForSelect.map((b) => ({
                      value: b.id,
                      label: b.brand || b.name || String(b.id),
                    }))}
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value);
                      trigger("brand_id");
                    }}
                    placeholder="Select Brand"
                    leftIcon={<FaSearch className="w-5 h-5" />}
                    searchable
                    searchPlaceholder="Search brand..."
                  />
                )}
              />
              {errors.brand_id && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.brand_id.message}
                </p>
              )}
              <p className="text-xs sm:text-sm text-primary/70 mt-2">
                Brand not available?{" "}
                <Link to="/contact" className="text-blue-600 hover:underline">
                  Contact us here
                </Link>
              </p>
            </div>

            {/* Select Category */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-primary mb-2">
                Select Category <span className="text-red-500">*</span>
              </label>
              <Controller
                name="category"
                control={control}
                rules={{ required: "Category is required" }}
                render={({ field }) => (
                  <CustomSelect
                    ref={field.ref}
                    name={field.name}
                    onBlur={field.onBlur}
                    options={[
                      ...categoriesForBrand.map((c) => ({
                        value: c.id,
                        label: c.name,
                      })),
                    ]}
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value);

                      console.log("Vale of cat is :- ", value);
                      setSelectedCategoryId(value);
                      trigger("category");
                    }}
                    placeholder={
                      selectedBrandId
                        ? "Select Category"
                        : "Select a brand first"
                    }
                    disabled={!selectedBrandId}
                  />
                )}
              />
              {errors.category && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.category.message}
                </p>
              )}
            </div>

            {/* Model */}
            <div>
              <div className="flex items-center gap-1 mb-2">
                <label className="block text-xs sm:text-sm font-semibold text-primary">
                  Model <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowModelInfoAlert(true)}
                  className="icon-button ml-1 text-blue-600 hover:text-blue-700 focus:outline-none focus:ring-0"
                  aria-label="Model information"
                >
                  <FiHelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
              <input
                type="text"
                placeholder="Enter model name"
                {...register("model", {
                  required: "Model is required",
                  onChange: () => trigger("model"),
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base text-primary"
              />
              {errors.model && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.model.message}
                </p>
              )}
            </div>

            {/* SKU */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-primary mb-2">
                SKU
              </label>
              <input
                type="text"
                placeholder="Enter SKU (optional)"
                {...register("sku")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base text-primary"
              />
            </div>

            {/* Additional Information */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-primary mb-2">
                Additional Information
              </label>
              <textarea
                placeholder="Please type here..."
                rows={1}
                {...register("additionalInfo")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base text-primary resize-none"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-primary mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                  onChange: () => {
                    trigger("email");
                    trigger("confirmEmail");
                  },
                })}
                readOnly={!!authUser}
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg text-sm sm:text-base text-primary ${
                  authUser
                    ? "bg-gray-100 cursor-not-allowed focus:outline-none focus:ring-0 focus:border-gray-300"
                    : "bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Confirm Email */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-primary mb-2">
                Confirm Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                {...register("confirmEmail", {
                  required: "Please confirm your email",
                  validate: (value, formValues) =>
                    value === formValues.email || "Emails do not match",
                  onChange: () => trigger("confirmEmail"),
                })}
                readOnly={!!authUser}
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg text-sm sm:text-base text-primary ${
                  authUser
                    ? "bg-gray-100 cursor-not-allowed focus:outline-none focus:ring-0 focus:border-gray-300"
                    : "bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                }`}
              />
              {errors.confirmEmail && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">
                  {errors.confirmEmail.message}
                </p>
              )}
            </div>

            {/* Image Upload Instructions */}
            <div>
              <p className="text-xs sm:text-sm text-primary/80 leading-relaxed">
                To avoid delay please make sure you submit at least 6 images,
                including clear photos of all the logos, heat stamps, hardware,
                and serial numbers.
                <button
                  type="button"
                  onClick={() => setShowPhotoGuideModal(true)}
                  className="inline font-medium text-blue-600 hover:underline p-0 pl-1"
                >
                  Photo guide
                </button>
              </p>
            </div>

            {/* Image Upload Section */}
            <div id="auth-image-upload-section">
              <label className="block text-xs sm:text-sm font-semibold text-primary mb-2">
                Upload Images
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 hover:bg-gray-100 transition-colors">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  {...imageInputRegister}
                  ref={(e) => {
                    imageInputRef(e);
                    fileInputRef.current = e;
                  }}
                  className="hidden"
                  id="image-upload"
                />
                {previewFiles.length > 0 ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-4 gap-2 sm:gap-3">
                      {previewFiles.map((item, index) => (
                        <div
                          key={index}
                          role="button"
                          tabIndex={0}
                          onClick={() =>
                            item.url &&
                            !item.uploading &&
                            setExpandedImageIndex(index)
                          }
                          onKeyDown={(e) => {
                            if (
                              (e.key === "Enter" || e.key === " ") &&
                              item.url &&
                              !item.uploading
                            ) {
                              e.preventDefault();
                              setExpandedImageIndex(index);
                            }
                          }}
                          className="relative w-full aspect-square rounded-lg overflow-hidden border border-gray-300 bg-white group cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
                          aria-label={`Expand image ${index + 1}`}
                        >
                          <img
                            src={item.url}
                            alt={`Preview ${index + 1}`}
                            className={`w-full h-full object-cover ${item.uploading ? "opacity-50" : ""}`}
                          />
                          {item.uploading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                              <span className="text-xs text-white font-medium">
                                Uploading...
                              </span>
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removePreview(index);
                            }}
                            title="Remove image"
                            className="absolute bg-white top-1 right-1 p-0.5 text-gray-700 hover:text-red-600 transition-colors"
                            aria-label="Remove image"
                          >
                            <FiX
                              className="w-4 h-4 sm:w-5 sm:h-5"
                              strokeWidth={2.5}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                    <label
                      htmlFor="image-upload"
                      className="inline-flex items-center gap-2 text-primary text-xs sm:text-sm font-medium cursor-pointer hover:underline"
                    >
                      <FiPlus className="w-4 h-4" />
                      Add more images
                    </label>
                  </div>
                ) : (
                  <label
                    htmlFor="image-upload"
                    className="flex flex-col items-center justify-center py-12 cursor-pointer"
                  >
                    <FiPlus className="w-12 h-12 text-primary/60 mx-auto mb-3" />
                    <p className="text-primary text-sm sm:text-base font-medium">
                      Upload image
                    </p>
                  </label>
                )}
              </div>
              {errors.images && (
                <p className="text-red-500 text-sm mt-2" role="alert">
                  {errors.images.message}
                </p>
              )}
            </div>

            {/* Image expand lightbox */}
            {expandedImageIndex != null &&
              previewFiles[expandedImageIndex]?.url && (
                <div
                  role="dialog"
                  aria-modal="true"
                  aria-label="Expanded image view"
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
                  onClick={() => setExpandedImageIndex(null)}
                >
                  <button
                    type="button"
                    onClick={() => setExpandedImageIndex(null)}
                    className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-10"
                    aria-label="Close"
                  >
                    <FiX className="w-6 h-6" strokeWidth={2.5} />
                  </button>
                  <img
                    src={previewFiles[expandedImageIndex].url}
                    alt={`Preview ${expandedImageIndex + 1} expanded`}
                    className="max-w-full max-h-[90vh] w-auto h-auto object-contain rounded-lg shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              )}
            {remainingRequests > 0 && speedType !== "expedited" && (
              <div className="rounded-xl border-2 border-amber-500 bg-amber-100 px-4 py-3 shadow-sm">
                <p className="text-sm font-semibold text-primary">
                  You have {remainingRequests} requests remaining in your
                  subscription.
                </p>
                <p className="mt-1 text-xs sm:text-sm font-medium text-primary/90">
                  Note: Our subscription plans do not include premium brands,
                  valuations, or jewelry.
                </p>
              </div>
            )}
            {/* Market Valuation and Agreement */}
            <div className="space-y-4">
              {(!isBulkFlow || isFinalBulkStep) && (
                <div className="mt-3 p-2">
                  <Controller
                    name="reCaptchaToken"
                    control={control}
                    rules={{
                      validate: (v) =>
                        (v && String(v).trim().length > 0) ||
                        "Please verify you are not a robot",
                    }}
                    render={({ field }) => (
                      <ReCAPTCHA
                        ref={recaptchaRef}
                        sitekey={recaptchaSiteKey}
                        onChange={(token) => {
                          field.onChange(token || "");
                          setValue("recaptcha", !!token, {
                            shouldValidate: false,
                          });
                          if (token) clearErrors("reCaptchaToken");
                        }}
                        onExpired={() => {
                          field.onChange("");
                          setValue("recaptcha", false, {
                            shouldValidate: false,
                          });
                        }}
                        onErrored={() => {
                          field.onChange("");
                          setValue("recaptcha", false, {
                            shouldValidate: true,
                          });
                        }}
                      />
                    )}
                  />
                </div>
              )}

              {(errors.reCaptchaToken || errors.recaptcha) && (
                <p className="text-red-500 text-xs sm:text-sm">
                  {errors.reCaptchaToken?.message || errors.recaptcha?.message}
                </p>
              )}

              {hasAddOns && (
                <div className="flex items-center gap-2 flex-wrap">
                  <input
                    type="checkbox"
                    id="insurance"
                    {...register("insurance")}
                    onClick={(e) => {
                      if (!getValues("insurance")) {
                        e.preventDefault();
                        setShowInsurancePolicyModal(true);
                      }
                    }}
                    className="w-4 h-4 min-w-[16px] min-h-[16px] shrink-0 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2"
                  />
                  <label
                    htmlFor="insurance"
                    onClick={(e) => {
                      if (!getValues("insurance")) {
                        e.preventDefault();
                        setShowInsurancePolicyModal(true);
                      }
                    }}
                    className="text-xs sm:text-sm text-primary font-medium cursor-pointer"
                  >
                    Insurance: $10
                  </label>
                  <a
                    href={`${import.meta.env.BASE_URL}add-on-terms`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="icon-button p-0.5 text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-primary rounded transition-colors"
                    aria-label="Read insurance policy (opens in new tab)"
                    title="Insurance policy"
                  >
                    <FiHelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  </a>
                </div>
              )}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="marketValuation"
                  {...register("marketValuation")}
                  onClick={(e) => {
                    if (!getValues("marketValuation")) {
                      e.preventDefault();
                      setShowMarketValuationAlert(true);
                    }
                  }}
                  className="w-4 h-4 min-w-[16px] min-h-[16px] shrink-0 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2"
                />
                <label
                  htmlFor="marketValuation"
                  onClick={(e) => {
                    if (!getValues("marketValuation")) {
                      e.preventDefault();
                      setShowMarketValuationAlert(true);
                    }
                  }}
                  className="text-xs sm:text-sm text-primary font-medium cursor-pointer"
                >
                  Market Valuation: ${valuationValue}
                </label>
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="agreement"
                  {...register("agreement", {
                    validate: (v) => v || "You must accept the terms",
                    onChange: () => trigger("agreement"),
                  })}
                  className="w-4 h-4 min-w-[16px] min-h-[16px] shrink-0 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2 mt-1"
                />
                <label
                  htmlFor="agreement"
                  className="text-xs sm:text-sm text-primary"
                >
                  By clicking checkout, you accept the{" "}
                  <Link
                    to="/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Privacy Policy
                  </Link>
                </label>
              </div>
              {errors.agreement && (
                <p className="text-red-500 text-xs sm:text-sm">
                  {errors.agreement.message}
                </p>
              )}
            </div>

            {/* Primary action: Add to Cart (final step proceeds to checkout) */}
            <div className="flex justify-center">
              <button
                type="button"
                disabled={isUploading || isSubmitting}
                onClick={handleAddToCartClick}
                className="w-full sm:w-2/3 md:w-1/2 lg:w-2/5 max-w-md bg-primary text-secondary py-3 px-6 rounded-lg font-semibold text-sm sm:text-base hover:bg-primary-hover transition-colors duration-300 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isUploading
                  ? "Uploading images..."
                  : isSubmitting
                    ? "Redirecting to checkout..."
                    : isFinalBulkStep || !isBulkFlow
                      ? "Proceed to checkout"
                      : "Add to cart"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {(uploadPopupState === "uploading" || uploadPopupState === "success") && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 px-4"
          role="dialog"
          aria-modal="true"
          aria-label="Image upload status"
        >
          <div className="w-full max-w-sm rounded-xl bg-white p-6 text-center shadow-2xl">
            {uploadPopupState === "uploading" ? (
              <>
                <div className="mx-auto mb-4 h-12 w-12 rounded-full border-4 border-primary/25 border-t-primary animate-spin" />
                <h3 className="text-primary text-lg sm:text-xl font-bold">
                  Uploading
                </h3>
                <p className="mt-2 text-sm sm:text-base text-primary/80">
                  Please wait while image is being uploaded.
                </p>
              </>
            ) : (
              <>
                <FiCheckCircle className="mx-auto mb-4 h-14 w-14 text-green-600" />
                <h3 className="text-primary text-lg sm:text-xl font-bold">
                  Upload complete
                </h3>
                <p className="mt-2 text-sm sm:text-base text-primary/80">
                  Your image was uploaded successfully.
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Model info alert popup */}
      {showModelInfoAlert && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
          aria-modal="true"
          role="dialog"
        >
          <div className="w-full max-w-md rounded-xl bg-white shadow-xl overflow-hidden p-6 sm:p-8 text-center">
            <h3 className="text-primary font-bold text-xl sm:text-2xl mb-4">
              Model
            </h3>
            <p className="text-primary text-sm sm:text-base font-normal leading-relaxed mb-6 px-1">
              If you do not know the model name please add your own identifier
              so you can reference this request if we require more photos.
            </p>
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => setShowModelInfoAlert(false)}
                className="bg-primary text-secondary font-semibold text-sm sm:text-base px-8 py-3 rounded-xl w-full max-w-xs hover:bg-primary-hover transition-colors shadow-sm"
              >
                Ok
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Market Valuation alert popup – matches design: white modal, dark brown text & button, "Verify certificate" */}
      {showMarketValuationAlert && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
          aria-modal="true"
          role="dialog"
        >
          <div className="w-full max-w-md rounded-xl bg-white shadow-xl overflow-hidden p-6 sm:p-8 text-center">
            <h3 className="text-primary font-bold text-xl sm:text-2xl mb-4">
              Alert
            </h3>
            <p className="text-primary text-sm sm:text-base font-normal leading-relaxed mb-6 px-1">
              You are adding a <b>${valuationValue}</b> market valuation to your
              order. Our team will include a current market value, which is how
              much your item is currently worth, if you select this add-on.
            </p>
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => {
                  setValue("marketValuation", true);
                  setShowMarketValuationAlert(false);
                }}
                className="bg-primary text-secondary font-semibold text-sm sm:text-base px-8 py-3 rounded-xl w-full max-w-xs hover:bg-primary-hover transition-colors shadow-sm"
              >
                Ok
              </button>
            </div>
          </div>
        </div>
      )}

      {showInsurancePolicyModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6"
          aria-modal="true"
          role="dialog"
          aria-labelledby="insurance-policy-title"
        >
          <div className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-xl bg-white shadow-2xl overflow-hidden">
            <div className="shrink-0 px-6 py-5 bg-primary text-secondary flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0 text-center">
                <h2
                  id="insurance-policy-title"
                  className="text-lg sm:text-xl font-bold"
                >
                  Authentication Company Insurance Policy
                </h2>
                <p className="text-sm mt-1 opacity-95">
                  Complete Terms & Agreement
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowInsurancePolicyModal(false)}
                className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                aria-label="Cancel"
              >
                <FiX className="w-5 h-5" strokeWidth={2.5} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-5 text-primary text-sm sm:text-base leading-relaxed space-y-4">
              {INSURANCE_POLICY_SECTIONS.map((section, idx) => (
                <div key={idx}>
                  <h3 className="font-bold text-base mb-2">{section.title}</h3>
                  <div className="space-y-2">
                    {section.content.map((item, i) => {
                      if (item.type === "para") {
                        return (
                          <p key={i} className="text-gray-700">
                            {item.text}
                          </p>
                        );
                      }
                      if (item.type === "bullet") {
                        return (
                          <p
                            key={i}
                            className={`flex gap-2 ${item.bold ? "font-bold" : ""}`}
                          >
                            <span className="shrink-0">•</span>
                            <span className="text-gray-700">{item.text}</span>
                          </p>
                        );
                      }
                      if (item.type === "sub") {
                        return (
                          <p
                            key={i}
                            className="font-semibold text-primary mt-2"
                          >
                            {item.text}
                          </p>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
              ))}
            </div>
            <div className="shrink-0 p-6 border-t border-gray-200 bg-white">
              <button
                type="button"
                onClick={() => {
                  setValue("insurance", true);
                  setShowInsurancePolicyModal(false);
                }}
                className="w-full bg-primary text-secondary py-3 rounded-xl font-semibold hover:bg-primary-hover transition-colors shadow-sm"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}

      {bulkDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl">
            <h3 className="text-lg font-semibold text-primary text-center">
              Bulk Query
            </h3>
            <div className="pt-1">
              <p className="text-sm text-primary mb-3 text-center">
                Select quantity
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 pt-2">
                {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <label
                    key={num}
                    className="inline-flex items-center gap-2 text-sm text-primary"
                  >
                    <input
                      type="radio"
                      name="bulkQuantity"
                      value={num}
                      checked={bulkQuantity === num}
                      onChange={() => setBulkQuantity(num)}
                    />
                    {num}
                  </label>
                ))}
              </div>
            </div>
            <div className="mt-5 flex justify-center gap-2">
              <button
                type="button"
                onClick={handleCloseBulkDialog}
                className="bg-secondary text-primary border border-gray-300 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!bulkQuantity}
                onClick={handleStartBulkFlow}
                className="bg-primary text-secondary px-4 py-2 rounded-lg font-semibold text-sm hover:bg-primary-hover transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {showPhotoGuideModal && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 px-4 py-6"
          role="dialog"
          aria-modal="true"
          aria-label="Photo guide"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setShowPhotoGuideModal(false);
          }}
        >
          <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 sm:px-6">
              <p className="text-sm sm:text-base font-semibold text-primary">
                Photo guide
              </p>
              <button
                type="button"
                onClick={() => setShowPhotoGuideModal(false)}
                className="inline-flex items-center justify-center rounded-lg p-2 text-primary hover:bg-gray-100"
                aria-label="Close"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>
            <div className="max-h-[75vh] overflow-auto bg-[#F5F5F0] p-3 sm:p-4">
              <img
                src={photoGuideImage}
                alt="Important photos for authentication"
                className="mx-auto w-full max-w-[900px] rounded-xl object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

Form.propTypes = {
  onPrimaryButtonClick: PropTypes.func,
  onSecondaryButtonClick: PropTypes.func,
  onSubmit: PropTypes.func,
  openBulkDialog: PropTypes.bool,
  onBulkDialogOpened: PropTypes.func,
  className: PropTypes.string,
  remainingRequests: PropTypes.number,
};

export default Form;
