import { request } from "./apiClient";

/** Add a business to the authenticated user */
export const registerBusiness = async ({
  business_name,
  website,
  country,
  business_brands,
  token,
} = {}) => {
  if (!business_name) throw new Error("Business name is required");
  return request("/business/register-business", {
    method: "POST",
    body: { business_name, website, country, business_brands },
    headers: {
      "Content-Type": "application/json",
      ...(token ? { sessiontoken: token } : {}),
    },
  });
};

export const getBusinessProfile = async ({ id, token } = {}) => {
  if (!id) throw new Error("Business ID is required");
  return request(`/profile/business-profile/${id}`, {
    method: "GET",
    headers: token ? { sessiontoken: token } : undefined,
  });
};

export const updateBusinessProfile = async ({
  business_id,
  name,
  business_brands,
  website,
  phone,
  address,
  country,
  about,
  facebook,
  instagram,
  profile_picture_url,
  cover_picture_url,
  token,
} = {}) => {
  if (!business_id) throw new Error("Business ID is required");

  const social_links = [];
  if (facebook) social_links.push({ name: "facebook", link: facebook });
  if (instagram) social_links.push({ name: "instagram", link: instagram });

  const body = {
    ...(name && { name }),
    ...(business_brands && { business_brands }),
    ...(website && { website }),
    ...(phone && { phone }),
    ...(address && { address }),
    ...(country && { country }),
    ...(about && { about }),
    ...(profile_picture_url && { profile_picture_url }),
    ...(cover_picture_url && { cover_picture_url }),
    ...(social_links.length > 0 && { social_links }),
  };

  return request(`/profile/update-business-profile/${business_id}`, {
    method: "PATCH",
    body,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { sessiontoken: token } : {}),
    },
  });
};

/**
 * Public business profile by slug (or id).
 */
export const getBusinessProfileBySlug = async ({
  slugOrId,
  page = 1,
  limit = 10,
} = {}) => {
  if (!slugOrId) throw new Error("Business slug or ID is required");
  const params = new URLSearchParams({ id: String(slugOrId).trim() });
  if (page) params.set("page", String(page));
  if (limit) params.set("limit", String(limit));
  return request(`/ad/get-business-profile-slug?${params.toString()}`, {
    method: "GET",
  });
};
