import React, { useState, useEffect, useRef, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { CustomSelect } from "../../components";
import { getUserProfile, updateUserProfile } from "../../store/slices/profileSlice";
import {
  getBusinessProfile,
  updateBusinessProfile,
} from "../../store/slices/businessSlice";
import { getBrands } from "../../store/slices/brandsSlice";
import { uploadProfileImage } from "../../services/profileServices";
import countries from "../../utils/countries";

const getSocialLink = (social_links, platform) => {
  if (!Array.isArray(social_links)) return "";
  const found = social_links.find((s) => s?.name === platform);
  return found?.link || "";
};

const Settings = () => {
  const dispatch = useAppDispatch();
  const { user: authUser } = useAppSelector((state) => state.auth);
  const { user: profileUser, status: profileStatus } = useAppSelector(
    (state) => state.profile,
  );
  const { business, status: businessStatus } = useAppSelector(
    (state) => state.business,
  );
  const { brands: brandsList = [] } = useAppSelector((state) => state.brands);

  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", variant: "success" });
  const [profileFile, setProfileFile] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [bizProfileFile, setBizProfileFile] = useState(null);
  const [bizProfilePreview, setBizProfilePreview] = useState(null);
  const photoInputRef = useRef(null);
  const coverInputRef = useRef(null);
  const bizProfileInputRef = useRef(null);

  const hasBusiness = !!(authUser?.user_business?.length > 0 || business);
  const businessId = authUser?.user_business?.[0]?.id || business?.id || null;

  useEffect(() => {
    if (authUser?.id) dispatch(getUserProfile({ id: authUser.id }));
  }, [dispatch, authUser?.id]);

  useEffect(() => {
    if (businessId) dispatch(getBusinessProfile({ id: businessId }));
  }, [dispatch, businessId]);

  useEffect(() => {
    dispatch(getBrands());
  }, [dispatch]);

  const user = profileUser || authUser;
  const loading =
    profileStatus === "loading" || (businessId && businessStatus === "loading");

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    shouldFocusError: true,
    defaultValues: {
      name: "",
      email: "",
      aboutBusiness: "",
      companyAddress: "",
      companyWebsite: "",
      country: "",
      brands: "",
      phoneNumber: "",
      facebookLink: "",
      instagramLink: "",
    },
  });

  useEffect(() => {
    if (!user && !business) return;
    reset({
      name: business?.name || user?.name || "",
      email: user?.email || authUser?.email || "",
      aboutBusiness: business?.about || user?.about_me || "",
      companyAddress: business?.address || "",
      companyWebsite: business?.website || "",
      country: business?.country || user?.country || "",
      brands: business?.business_brands || "",
      phoneNumber: business?.phone || user?.phone || "",
      facebookLink: getSocialLink(business?.social_links, "facebook") || user?.facebook || "",
      instagramLink: getSocialLink(business?.social_links, "instagram") || user?.instagram || "",
    });
  }, [profileUser, business, authUser, reset]);

  const countryOptions = useMemo(() => {
    return [...countries]
      .sort((a, b) => String(a?.name || "").localeCompare(String(b?.name || "")))
      .map((c) => ({ value: c.name, label: c.name }));
  }, []);

  const brandOptions = useMemo(() => {
    return [...brandsList]
      .sort((a, b) =>
        String(a?.name || "").toLowerCase().localeCompare(String(b?.name || "").toLowerCase())
      )
      .map((b) => ({ value: b.name || "", label: b.name || "" }))
      .filter((o) => o.value);
  }, [brandsList]);

  const showToast = (message, variant = "success") => {
    setToast({ show: true, message, variant });
    setTimeout(() => setToast((t) => ({ ...t, show: false })), 3000);
  };

  const onSave = async (data) => {
    setSaving(true);
    try {
      let uploadedProfileUrl = undefined;
      let uploadedCoverUrl = undefined;

      if (bizProfileFile) {
        const res = await uploadProfileImage(bizProfileFile);
        uploadedProfileUrl = res?.data?.location || res?.data?.url || res?.data?.path || undefined;
      }
      if (coverFile) {
        const res = await uploadProfileImage(coverFile);
        uploadedCoverUrl = res?.data?.location || res?.data?.url || res?.data?.path || undefined;
      }

      if (hasBusiness && businessId) {
        await dispatch(
          updateBusinessProfile({
            business_id: businessId,
            name: data.name || undefined,
            business_brands: data.brands || undefined,
            website: data.companyWebsite || undefined,
            phone: data.phoneNumber || undefined,
            address: data.companyAddress || undefined,
            country: data.country || undefined,
            about: data.aboutBusiness || undefined,
            facebook: data.facebookLink || undefined,
            instagram: data.instagramLink || undefined,
            ...(uploadedProfileUrl && { profile_picture_url: uploadedProfileUrl }),
            ...(uploadedCoverUrl && { cover_picture_url: uploadedCoverUrl }),
          }),
        ).unwrap();
      }

      await dispatch(
        updateUserProfile({
          name: data.name || user?.name,
          about_me: data.aboutBusiness || undefined,
          country: data.country || undefined,
          phone: data.phoneNumber || undefined,
          facebook: data.facebookLink || undefined,
          instagram: data.instagramLink || undefined,
        }),
      ).unwrap();

      showToast("Settings saved successfully.", "success");
      setBizProfileFile(null);
      setCoverFile(null);
      if (businessId) dispatch(getBusinessProfile({ id: businessId }));
      if (authUser?.id) dispatch(getUserProfile({ id: authUser.id }));
    } catch (err) {
      showToast(err?.message || "Failed to save settings", "error");
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

  // Non-business user: editable profile (photo + name), email read-only
  if (!hasBusiness) {
    const photoUrl = profilePreview || profileUser?.profile_picture_url || authUser?.profile_picture_url || null;

    const handleSaveUser = async (data) => {
      setSaving(true);
      try {
        let uploadedPhotoUrl = undefined;
        if (profileFile) {
          const uploadRes = await uploadProfileImage(profileFile);
          uploadedPhotoUrl = uploadRes?.data?.location || uploadRes?.data?.url || uploadRes?.data?.path || undefined;
        }
        await dispatch(
          updateUserProfile({
            name: data.name,
            ...(uploadedPhotoUrl && { profile_picture_url: uploadedPhotoUrl }),
          }),
        ).unwrap();
        showToast("Profile saved successfully.", "success");
        if (authUser?.id) dispatch(getUserProfile({ id: authUser.id }));
      } catch (err) {
        showToast(err?.message || "Failed to save profile", "error");
      } finally {
        setSaving(false);
      }
    };

    return (
      <div className="min-h-screen bg-[#F5F5F0]">
        <main className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl mx-auto">
            <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-6">
              Profile Settings
            </h1>
            <div className="bg-white border border-gray-300 rounded-[22px] shadow-sm p-8">
              <form onSubmit={handleSubmit(handleSaveUser)} className="flex flex-col items-center gap-6">
                {/* Profile Photo */}
                <div className="flex flex-col items-center gap-3">
                  <div className="w-28 h-28 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                    {photoUrl ? (
                      <img src={photoUrl} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-gray-400 text-sm">No photo</span>
                    )}
                  </div>
                  <input
                    ref={photoInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setProfileFile(file);
                        setProfilePreview(URL.createObjectURL(file));
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => photoInputRef.current?.click()}
                    className="text-sm px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-primary font-medium hover:bg-gray-100 transition-colors"
                  >
                    Change Photo
                  </button>
                </div>

                {/* Name */}
                <div className="w-full">
                  <label className="block text-primary font-bold underline mb-1">Name</label>
                  <input
                    {...register("name", { required: "Name is required" })}
                    className={`w-full px-4 py-3 rounded-lg border ${errors.name ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-primary bg-white`}
                    placeholder="Your name"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                  )}
                </div>

                {/* Email (read-only) */}
                <div className="w-full">
                  <label className="block text-primary font-bold underline mb-1">Email Address</label>
                  <input
                    type="email"
                    value={user?.email || authUser?.email || ""}
                    disabled
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 text-primary bg-gray-50 cursor-not-allowed"
                  />
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full px-8 py-3 rounded-lg bg-primary text-secondary font-semibold hover:bg-primary-hover transition-colors disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save"}
                </button>
              </form>
            </div>
          </div>
        </main>

        {toast.show && (
          <div
            className={`fixed top-4 right-4 z-[9999] px-6 py-4 rounded-lg shadow-lg text-sm font-medium ${
              toast.variant === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"
            }`}
          >
            {toast.message}
          </div>
        )}
      </div>
    );
  }

  // Business user: full editable form
  const profilePhotoUrl = bizProfilePreview || business?.profile_picture_url || profileUser?.profile_picture_url || null;
  const coverPhotoUrl = coverPreview || business?.cover_picture_url || profileUser?.cover_picture_url || null;

  return (
    <div className="min-h-screen bg-[#F5F5F0]">
      <main className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto w-full">
          <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-6 sm:mb-8">
            Profile Settings
          </h1>

          <div className="bg-white border border-gray-300 rounded-[22px] overflow-visible shadow-sm">
            {/* Cover + Profile photo */}
            <div className="p-6 sm:p-8 lg:px-12 lg:py-10 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row gap-6 sm:gap-10">
                {/* Cover Photo */}
                <div className="flex-1 flex flex-col">
                  <p className="text-sm font-medium text-primary mb-2">Cover Photo</p>
                  <div className="h-44 rounded-xl bg-gray-100 overflow-hidden flex items-center justify-center relative group cursor-pointer"
                    onClick={() => coverInputRef.current?.click()}>
                    {coverPhotoUrl ? (
                      <img src={coverPhotoUrl} alt="Cover" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-gray-400 text-sm">No cover photo</span>
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                      <span className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">Change Cover</span>
                    </div>
                  </div>
                  <input
                    ref={coverInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setCoverFile(file);
                        setCoverPreview(URL.createObjectURL(file));
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => coverInputRef.current?.click()}
                    className="mt-2 text-sm px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-primary font-medium hover:bg-gray-100 transition-colors self-start"
                  >
                    Change Cover
                  </button>
                </div>

                {/* Profile Photo */}
                <div className="flex-1 flex flex-col">
                  <p className="text-sm font-medium text-primary mb-2">Profile Photo</p>
                  <div className="h-44 rounded-xl bg-gray-100 overflow-hidden flex items-center justify-center">
                    <div className="w-32 h-32 rounded-full overflow-hidden flex items-center justify-center bg-gray-200 relative group cursor-pointer"
                      onClick={() => bizProfileInputRef.current?.click()}>
                      {profilePhotoUrl ? (
                        <img src={profilePhotoUrl} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-gray-400 text-xs">No photo</span>
                      )}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center rounded-full">
                        <span className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">Change</span>
                      </div>
                    </div>
                  </div>
                  <input
                    ref={bizProfileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setBizProfileFile(file);
                        setBizProfilePreview(URL.createObjectURL(file));
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => bizProfileInputRef.current?.click()}
                    className="mt-2 text-sm px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-primary font-medium hover:bg-gray-100 transition-colors self-start"
                  >
                    Change Photo
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
                  {...register("name")}
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
                  {...register("email")}
                  disabled
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 text-primary bg-gray-50 cursor-not-allowed"
                  placeholder="Email"
                />
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
                      searchable
                      searchPlaceholder="Search countries..."
                    />
                  )}
                />
              </div>

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
                      options={brandOptions}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Select brand"
                      searchable
                      searchPlaceholder="Search brands..."
                    />
                  )}
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

              <div>
                <label className="block text-primary font-bold underline mb-1">
                  Social Links
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    {...register("facebookLink")}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-primary bg-white"
                    placeholder="Facebook URL"
                  />
                  <input
                    {...register("instagramLink")}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-primary bg-white"
                    placeholder="Instagram URL"
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
          className={`fixed top-4 right-4 z-[9999] px-6 py-4 rounded-lg shadow-lg text-sm font-medium ${
            toast.variant === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default Settings;
