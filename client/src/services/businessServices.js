import { request } from "./apiClient";

/** Phase 3: POST /ad/register-business - add a business (ad-old: ADD_A_BUSINESS) */
export const registerBusiness = async ({
  business_name,
  website,
  country,
  business_brands,
  token,
} = {}) => {
  if (!business_name) throw new Error("Business name is required");
  const body = {
    business_name: String(business_name),
    website: website != null ? String(website) : "",
    country: country != null ? String(country) : "",
    business_brands: business_brands != null ? String(business_brands) : "",
  };
  return request("/ad/register-business", {
    method: "POST",
    body,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { sessiontoken: token } : {}),
    },
  });
};

export const getBusinessProfile = async ({ id, token } = {}) => {
  if (!id) {
    throw new Error("Business ID is required");
  }

  return request(`/ad/get-business-profile?id=${id}`, {
    method: "GET",
    headers: token ? { sessiontoken: token } : undefined,
  });
};

/**
 * Public business profile by slug (or id). Ad-old: GET_BUSINESS_PROFILE_SLUG.
 * Backend accepts query param "id" whose value is the business slug (or id).
 */
export const getBusinessProfileBySlug = async ({
  slugOrId,
  page = 1,
  limit = 10,
} = {}) => {
  if (!slugOrId) {
    throw new Error("Business slug or ID is required");
  }
  const params = new URLSearchParams({ id: String(slugOrId).trim() });
  if (page) params.set("page", String(page));
  if (limit) params.set("limit", String(limit));
  return request(`/ad/get-business-profile-slug?${params.toString()}`, {
    method: "GET",
  });
};

export const updateBusinessProfile = async ({
  id,
  business_id,
  business_name,
  business_country,
  country_code,
  business_phone,
  business_address,
  about_business,
  business_brands,
  website,
  business_instagram,
  business_facebook,
  business_linkedin,
  business_twitter,
  hemlock_link,
  business_profile_picture,
  business_cover_picture,
  currentBusinessProfilePicture,
  currentBusinessCoverPicture,
  storage_type = "businessProfile",
  token,
} = {}) => {
  const formData = new FormData();

  if (storage_type) formData.append("storage_type", storage_type);
  if (id) formData.append("id", id);
  if (business_id) formData.append("business_id", business_id);
  if (business_name) formData.append("business_name", business_name);
  if (business_country) formData.append("business_country", business_country);
  if (country_code) formData.append("country_code", country_code);
  if (business_phone) formData.append("business_phone", business_phone);
  if (business_address) formData.append("business_address", business_address);
  if (about_business) formData.append("about_business", about_business);
  if (business_brands) formData.append("business_brands", business_brands);
  if (website) formData.append("website", website);
  if (business_instagram)
    formData.append("business_instagram", business_instagram);
  if (business_facebook)
    formData.append("business_facebook", business_facebook);
  if (business_linkedin)
    formData.append("business_linkedin", business_linkedin);
  if (business_twitter) formData.append("business_twitter", business_twitter);
  if (hemlock_link) formData.append("hemlock_link", hemlock_link);

  if (business_profile_picture) {
    formData.append("business_profile_picture", business_profile_picture);
  } else if (currentBusinessProfilePicture) {
    formData.append("business_profile_picture", currentBusinessProfilePicture);
  }

  if (business_cover_picture) {
    formData.append("business_cover_picture", business_cover_picture);
  } else if (currentBusinessCoverPicture) {
    formData.append("business_cover_picture", currentBusinessCoverPicture);
  }
  // if (business_profile_picture) formData.append('business_profile_picture', business_profile_picture);
  // if (business_cover_picture) formData.append('business_cover_picture', business_cover_picture);

  return request("/ad/update-business-profile", {
    method: "POST",
    body: formData,
    isFormData: true,
    headers: token ? { sessiontoken: token } : undefined,
  });
};
