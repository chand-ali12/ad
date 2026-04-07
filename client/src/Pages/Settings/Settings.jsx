import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { CustomSelect } from "../../components";
import { getUserProfile } from "../../store/slices/profileSlice";
import {
  getBusinessProfile,
  updateBusinessProfile,
} from "../../store/slices/businessSlice";
import { updateUserProfile } from "../../store/slices/profileSlice";
import { getBrands } from "../../store/slices/brandsSlice";
import { getBusinessCountries } from "../../store/slices/homeSlice";
import {
  getProfileImageUrl,
  getProfileCoverUrl,
  getBusinessProfileImageUrl,
  getBusinessCoverImageUrl,
} from "../../utils/imageUtils";
import countries, {
  getCountryCallingCode,
  getCountryDisplayName,
} from "../../utils/countries";

const Settings = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user: authUser } = useAppSelector((state) => state.auth);
  const { user: profileUser, status: profileStatus } = useAppSelector(
    (state) => state.profile,
  );
  const { business, status: businessStatus } = useAppSelector(
    (state) => state.business,
  );
  const { brands: brandsList = [] } = useAppSelector((state) => state.brands);
  const { businessCountries = [] } = useAppSelector((state) => state.home);

  const [bannerImage, setBannerImage] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [profileFile, setProfileFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    variant: "success",
  });
  const bannerInputRef = useRef(null);
  const profileInputRef = useRef(null);

  const hasBusiness = authUser?.user_business?.length > 0;
  const businessId = hasBusiness ? authUser.user_business[0].id : null;
  const isBusinessUser = false; // Settings shows combined form; we use business data when available

  useEffect(() => {
    if (authUser?.id) dispatch(getUserProfile({ id: authUser.id }));
  }, [dispatch, authUser?.id]);

  useEffect(() => {
    if (businessId) dispatch(getBusinessProfile({ id: businessId }));
  }, [dispatch, businessId]);

  useEffect(() => {
    dispatch(getBrands());
    dispatch(getBusinessCountries());
  }, [dispatch]);

  // Set images from user or business
  useEffect(() => {
    if (
      business?.business_cover_picture ||
      business?.business_profile_picture
    ) {
      setBannerImage(getBusinessCoverImageUrl(business.business_cover_picture));
      setProfileImage(
        getBusinessProfileImageUrl(business.business_profile_picture),
      );
    } else if (profileUser) {
      setBannerImage(
        profileUser.cover_picture
          ? getProfileCoverUrl(profileUser.cover_picture)
          : null,
      );
      setProfileImage(
        profileUser.profile_picture
          ? getProfileImageUrl(profileUser.profile_picture)
          : null,
      );
    }
  }, [profileUser, business]);

  const user = profileUser || authUser;
  const loading =
    profileStatus === "loading" ||
    (hasBusiness && businessStatus === "loading");

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    shouldFocusError: true,
    defaultValues: {
      businessName: "",
      email: "",
      aboutBusiness: "",
      companyAddress: "",
      companyWebsite: "",
      country: "",
      brands: "",
      countryCode: "",
      phoneNumber: "",
      facebookLink: "",
      instagramLink: "",
    },
  });

  useEffect(() => {
    const u = profileUser || authUser;
    if (!u && !business) return;
    reset({
      businessName: business?.business_name || u?.name || "",
      email: u?.email || authUser?.email || "",
      aboutBusiness: business?.about_business || u?.about_us || "",
      companyAddress: business?.business_address || "",
      companyWebsite: business?.website || u?.website || u?.website_url || "",
      country: getCountryDisplayName(
        business?.business_country || u?.country || "",
      ),
      brands: business?.business_brands || business?.brands || "",
      countryCode: u?.country_code || "",
      phoneNumber: business?.business_phone || u?.phone || "",
      facebookLink: business?.business_facebook || u?.facebook || "",
      instagramLink: business?.business_instagram || u?.instagram || "",
    });
  }, [profileUser, business, authUser, reset]);

  const normalizeName = (name) =>
    String(name || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, " ")
      .trim();

  const selectedCountry = watch("country");
  const hasSelectedCountry = String(selectedCountry || "").trim().length > 0;

  const extractDialCode = (val) => {
    if (val == null) return "";
    const raw = String(val).trim();
    if (!raw) return "";
    // Accept formats like +92, +1-242, 92, 1-242, or "PK" (handled elsewhere)
    const plusMatch = raw.match(/^\+\d[\d-]*$/) || raw.match(/\+\d[\d-]*/);
    if (plusMatch) return plusMatch[0];
    const digitsMatch = raw.match(/^\d[\d-]*$/);
    if (digitsMatch) return `+${digitsMatch[0]}`;
    return "";
  };

  const selectedApiCountry = (businessCountries || []).find(
    (c) =>
      normalizeName(c?.business_country) === normalizeName(selectedCountry),
  );

  const resolvedFromHelper = getCountryCallingCode(selectedCountry);

  const countryCodeFromApi = extractDialCode(
    selectedApiCountry?.country_code ??
      selectedApiCountry?.phone_code ??
      selectedApiCountry?.dial_code ??
      selectedApiCountry?.dialCode ??
      selectedApiCountry?.calling_code ??
      selectedApiCountry?.callingCode,
  );

  const staticByName = hasSelectedCountry
    ? countries.find(
        (c) => normalizeName(c.name) === normalizeName(selectedCountry),
      )
    : null;

  const staticByFuzzyName = hasSelectedCountry
    ? countries.find((c) => {
        const a = normalizeName(c.name);
        const b = normalizeName(selectedCountry);
        return a.includes(b) || b.includes(a);
      })
    : null;

  // Some APIs send ISO country code in country_code (e.g., PK, AE)
  const apiIsoCode = String(selectedApiCountry?.country_code || "")
    .trim()
    .toUpperCase();
  const staticByIso =
    apiIsoCode && !apiIsoCode.startsWith("+")
      ? countries.find((c) => String(c.code || "").toUpperCase() === apiIsoCode)
      : null;

  const countryCodeFromStatic = hasSelectedCountry
    ? resolvedFromHelper ||
      staticByName?.phoneCode ||
      staticByFuzzyName?.phoneCode ||
      staticByIso?.phoneCode ||
      ""
    : "";

  const autoCountryCode = hasSelectedCountry
    ? countryCodeFromApi || countryCodeFromStatic || ""
    : "";

  const countryOptions = useMemo(() => {
    const seen = new Set();
    const options = [{ value: "", label: "Select country" }];

    // Use static master country list (same old-site behavior): full country names + proper dialing code resolution.
    const sortedCountries = [...countries].sort((a, b) =>
      String(a?.name || "").localeCompare(String(b?.name || "")),
    );

    sortedCountries.forEach((c) => {
      const label = String(c?.name || "").trim();
      if (!label) return;
      const key = normalizeName(label);
      if (!key || seen.has(key)) return;
      seen.add(key);
      options.push({ value: label, label });
    });

    // Keep backward compatibility for legacy saved country value not present in master list.
    const legacyValue = String(selectedCountry || "").trim();
    if (legacyValue) {
      const legacyKey = normalizeName(legacyValue);
      const exists = options.some((o) => normalizeName(o.value) === legacyKey);
      if (!exists) {
        options.push({ value: legacyValue, label: legacyValue });
      }
    }

    return options;
  }, [selectedCountry]);

  useEffect(() => {
    setValue("countryCode", autoCountryCode);
  }, [autoCountryCode, setValue]);

  const handleBannerClick = () => bannerInputRef.current?.click();
  const handleProfilePhotoClick = () => profileInputRef.current?.click();
  const handleBannerChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerFile(file);
      setBannerImage(URL.createObjectURL(file));
    }
  };
  const handleProfileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileFile(file);
      setProfileImage(URL.createObjectURL(file));
    }
  };

  const onSave = async (data) => {
    setSaving(true);
    try {
      if (hasBusiness && business?.id) {
        await dispatch(
          updateBusinessProfile({
            id: business.user_id,
            business_id: business.id,
            business_name: data.businessName,
            business_country: data.country,
            business_phone: data.phoneNumber,
            country_code: autoCountryCode,
            business_address: data.companyAddress,
            about_business: data.aboutBusiness,
            business_brands: data.brands,
            website: data.companyWebsite,
            business_facebook: data.facebookLink,
            business_instagram: data.instagramLink,
            business_profile_picture: profileFile,
            business_cover_picture: bannerFile,
          }),
        ).unwrap();
      }
      if (user?.id) {
        await dispatch(
          updateUserProfile({
            id: user.id,
            name: hasBusiness
              ? user.name || ""
              : data.businessName || user.name,
            about_us: data.aboutBusiness || user.about_us,
            country: data.country || user.country,
            country_code: hasSelectedCountry ? autoCountryCode : "",
            phone: data.phoneNumber || user.phone,
            profile_picture: profileFile || undefined,
            cover_picture: bannerFile || undefined,
            facebook: data.facebookLink || undefined,
            instagram: data.instagramLink || undefined,
          }),
        ).unwrap();
      }
      setToast({
        show: true,
        message: "Settings saved successfully.",
        variant: "success",
      });
      setTimeout(() => setToast((t) => ({ ...t, show: false })), 3000);
      if (businessId) await dispatch(getBusinessProfile({ id: businessId }));
      if (authUser?.id) await dispatch(getUserProfile({ id: authUser.id }));
    } catch (err) {
      setToast({
        show: true,
        message: err?.message || "Failed to save settings",
        variant: "error",
      });
      setTimeout(() => setToast((t) => ({ ...t, show: false })), 3000);
    } finally {
      setSaving(false);
    }
  };

  if (loading && !user) {
    return (
      <div className="min-h-screen bg-[#F5F5F0] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F0]">
      <main className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto w-full">
          <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-6 sm:mb-8">
            Profile Settings
          </h1>

          <div className="bg-white border border-gray-300 rounded-[22px] overflow-visible shadow-sm">
            {/* Cover + Profile photo row — same height so buttons align */}
            <div className="p-6 sm:p-8 lg:px-12 lg:py-10 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 sm:items-stretch">
                <div className="flex-1 flex flex-col">
                  <p className="text-sm font-medium text-primary mb-2">
                    Cover Photo
                  </p>
                  <div className="h-44 rounded-xl bg-gray-100 overflow-hidden flex items-center justify-center flex-shrink-0">
                    {bannerImage ? (
                      <img
                        src={bannerImage}
                        alt="Cover"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-400 text-sm">
                        No cover photo
                      </span>
                    )}
                  </div>
                  <input
                    ref={bannerInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleBannerChange}
                    className="hidden"
                  />
                  <div
                    className="hidden sm:block h-5 flex-shrink-0"
                    aria-hidden
                  />
                  <button
                    type="button"
                    onClick={handleBannerClick}
                    className="mt-3 w-full py-2.5 rounded-lg border border-gray-300 bg-gray-50 text-primary text-sm font-medium hover:bg-gray-100 transition-colors sm:mt-auto"
                  >
                    Update Cover Photo
                  </button>
                </div>
                <div className="flex-1 flex flex-col">
                  <p className="text-sm font-medium text-primary mb-2">
                    Profile Photo
                  </p>
                  <div className="h-44 rounded-xl bg-gray-100 overflow-hidden flex items-center justify-center flex-shrink-0">
                    <div className="w-32 h-32 rounded-full overflow-hidden flex items-center justify-center bg-gray-200">
                      {profileImage ? (
                        <img
                          src={profileImage}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-gray-400 text-xs">No photo</span>
                      )}
                    </div>
                  </div>
                  <input
                    ref={profileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleProfileChange}
                    className="hidden"
                  />
                  <div
                    className="hidden sm:block h-5 flex-shrink-0"
                    aria-hidden
                  />
                  <button
                    type="button"
                    onClick={handleProfilePhotoClick}
                    className="mt-3 w-full py-2.5 rounded-lg border border-gray-300 bg-gray-50 text-primary text-sm font-medium hover:bg-gray-100 transition-colors sm:mt-auto"
                  >
                    Update Profile Photo
                  </button>
                </div>
              </div>
            </div>

            <form
              onSubmit={handleSubmit(onSave)}
              className="p-6 sm:p-8 lg:px-12 lg:py-10 space-y-5"
            >
              <div>
                <label className="block text-primary font-bold underline mb-1">
                  Business Name
                </label>
                <input
                  {...register("businessName")}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-primary bg-white"
                  placeholder="Business name"
                />
              </div>
              <div>
                <label className="block text-primary font-bold underline mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  {...register("email", {
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email",
                    },
                  })}
                  disabled={true}
                  className={`w-full px-4 py-3 rounded-lg border ${errors.email ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-primary bg-white`}
                  placeholder="Email"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-primary font-bold underline mb-1">
                  About Your Business
                </label>
                <input
                  {...register("aboutBusiness")}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-primary bg-white"
                  placeholder="About your business"
                />
              </div>
              <div>
                <label className="block text-primary font-bold underline mb-1">
                  Company Address
                </label>
                <input
                  {...register("companyAddress")}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-primary bg-white"
                  placeholder="Company address"
                />
              </div>
              <div>
                <label className="block text-primary font-bold underline mb-1">
                  Company Website
                </label>
                <input
                  type="url"
                  {...register("companyWebsite")}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-primary bg-white"
                  placeholder="https://"
                />
              </div>
              <div>
                <label className="block text-primary font-bold underline mb-1">
                  Country
                </label>
                <Controller
                  name="country"
                  control={control}
                  render={({ field }) => (
                    <CustomSelect
                      ref={field.ref}
                      name={field.name}
                      onBlur={field.onBlur}
                      options={countryOptions}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Select country"
                    />
                  )}
                />
              </div>
              {hasBusiness && (
                <div>
                  <label className="block text-primary font-bold underline mb-1">
                    Brands
                  </label>
                  <Controller
                    name="brands"
                    control={control}
                    render={({ field }) => (
                      <CustomSelect
                        ref={field.ref}
                        name={field.name}
                        onBlur={field.onBlur}
                        options={[
                          { value: "", label: "Select brands" },
                          ...brandsList.map((b) => ({
                            value: b.brand,
                            label: b.brand,
                          })),
                        ]}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select brands"
                      />
                    )}
                  />
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-primary font-bold underline mb-1">
                    Country Code
                  </label>
                  <input
                    {...register("countryCode")}
                    value={autoCountryCode}
                    readOnly
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-primary cursor-not-allowed"
                    placeholder="Country code"
                  />
                </div>
                <div>
                  <label className="block text-primary font-bold underline mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    {...register("phoneNumber")}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-primary bg-white"
                    placeholder="Phone number"
                  />
                </div>
              </div>
              <div>
                <label className="block text-primary font-bold underline mb-1">
                  Links
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="url"
                    {...register("facebookLink")}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-primary bg-white"
                    placeholder="Facebook"
                  />
                  <input
                    type="url"
                    {...register("instagramLink")}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-primary bg-white"
                    placeholder="Instagram"
                  />
                </div>
              </div>
              <div className="pt-4 flex justify-center">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full sm:w-64 min-w-[200px] px-8 py-3 rounded-lg bg-primary text-secondary font-semibold hover:bg-primary-hover transition-colors disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      {toast.show && (
        <div
          className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg ${toast.variant === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default Settings;
